---
title: RAG 检索链路的工程要点笔记
date: '2026-10-04'
tags: [RAG, Milvus, 向量检索, 后端]
category: 人工智能
summary: 把 RAG 从 demo 做到能用的过程中，真正影响效果的其实不是大模型，而是切片、召回和重排这三件事。
---

::: tip 这是一篇学习笔记
内容整理自搭建 Ragent 时的实践与踩坑，结论会随着我对这条链路的理解加深持续更新。如果你发现错误，欢迎指出。
:::

做 RAG 最容易产生的误解是：**效果不好 = 换一个更强的大模型**。实际跑下来，绝大多数"答不准"的问题出在大模型之前的检索环节——模型没拿到正确的上下文，再强也只能编。

这篇文章记录我觉得影响最大的三个环节。

## 一、切片决定了召回的上限

切片（chunking）是整条链路里最不起眼但影响最大的一步。切片切得不好，后面用什么 Embedding、什么重排都救不回来。

我目前采用的策略：

```python
def chunk_document(text: str, size: int = 512, overlap: int = 64):
    """按语义段落优先、长度兜底的切分策略"""
    paragraphs = split_by_semantic(text)     # 先按标题/段落结构切
    chunks, buffer = [], ""

    for para in paragraphs:
        if len(buffer) + len(para) <= size:
            buffer = f"{buffer}\n{para}" if buffer else para
        else:
            if buffer:
                chunks.append(buffer)
            # 长段落再按窗口重叠切，保证上下文不断裂
            chunks.extend(window_split(para, size, overlap))
            buffer = ""
    if buffer:
        chunks.append(buffer)
    return chunks
```

几个实测有效的经验：

| 问题 | 现象 | 处理 |
| --- | --- | --- |
| 切片过长 | 召回片段里塞满无关内容，稀释关键信息 | 控制在模型上下文窗口的 1/8 左右 |
| 切片过短 | 语义不完整，答案常常只有半截 | 设置 10%-15% 的重叠窗口 |
| 按字数硬切 | 表格、代码块被腰斩 | 先按结构（标题、列表、代码块）切，再按长度兜底 |
| 丢元数据 | 召回后不知道这段出自哪一节 | 每个 chunk 带上标题路径、页码、文档 ID |

::: warning 容易忽略的一点
chunk 里一定要带上**文档标题或章节路径**。比如把 `"第三章 > 3.2 相似度计算"` 拼到 chunk 前面再向量化，对用户问"相似度是怎么算的"这类问题召回率提升很明显——因为标题本身就是强语义信号。
:::

## 二、纯向量检索不够用

向量检索擅长语义相似，但对**专有名词、缩写、ID、代码片段**非常不敏感。问"IVF_FLAT 索引的 nlist 怎么设"，向量召回很可能给你一堆讲 HNSW 的段落。

解决方案是混合检索（hybrid search）：一路 BM25 关键词召回，一路向量召回，再做融合。常用的融合方式是 RRF（Reciprocal Rank Fusion）：

$$
\text{RRF}(d) = \sum_{r \in R} \frac{1}{k + \text{rank}_r(d)}
$$

其中 $R$ 是各路召回结果的集合，$\text{rank}_r(d)$ 是文档 $d$ 在第 $r$ 路召回中的排名，$k$ 通常取 60。RRF 的好处是不需要归一化各路的分数——分数尺度不同是混合检索里最难处理的问题，RRF 直接用排名绕开了它。

```java
public List<Doc> hybridSearch(String query, int topK) {
    List<Doc> dense = milvusClient.search(query, topK * 2);   // 向量召回，多取一些
    List<Doc> sparse = bm25Store.search(query, topK * 2);     // 关键词召回

    return reciprocalRankFusion(List.of(dense, sparse), 60)
        .stream()
        .limit(topK)
        .toList();
}
```

::: info Milvus 侧的注意
Milvus 支持在同一个 collection 里同时存稠密向量与稀疏向量并用 `hybrid_search` 做召回，比在应用层做两路查询再合并要省事，也少一次网络往返。如果数据量不大，应用层 RRF 也完全够用，先跑通再优化。
:::

## 三、重排是性价比最高的一步

多路召回之后拿到的候选片段，直接拼上下文的效果通常不如先做一次精排（rerank）。原因是召回模型为了速度，通常是双塔结构——query 和文档各自独立编码，交互太浅；而 Cross-Encoder 会把两者拼起来过一遍模型，精度高得多，但慢。

所以标准做法是：**召回要宽，重排要准**。

$$
\text{score}(q, d) = \text{CrossEncoder}(q \oplus d) \in [0, 1]
$$

实测里，召回 50 条再重排取前 5，比召回 5 条直接用，答案质量提升很明显，而延迟增加通常在 100-200ms 量级（取决于 rerank 模型大小）。这个取舍在大多数问答场景下非常划算。

## 四、缓存：被低估的优化

生产环境里 RAG 的成本大头是 LLM 调用。两类缓存值得做：

1. **Embedding 缓存**：同一个 query 重复出现时对 Identical 输入缓存结果，用 Redis 做 `query -> vector` 的映射即可
2. **答案缓存**：对完全相同的 query + 相同的召回结果集合，直接返回上次的答案

```java
public Answer ask(String query) {
    String cacheKey = "rag:answer:" + DigestUtils.md5DigestAsHex(query.getBytes());
    Answer cached = (Answer) redisTemplate.opsForValue().get(cacheKey);
    if (cached != null) {
        return cached;                       // 命中缓存，省掉整条链路
    }
    Answer answer = pipeline.run(query);
    redisTemplate.opsForValue().set(cacheKey, answer, Duration.ofHours(1));
    return answer;
}
```

::: danger 缓存失效要谨慎
如果底层文档更新了（新增、删除、版本升级），**必须主动清理相关缓存**，否则用户会一直拿到基于旧文档的过期答案。我的做法是在文档入库成功后按文档 ID 批量删 key，而不是依赖 TTL。
:::

## 小结

按重要性排序的话：

1. **切片策略** —— 决定召回上限，优先打磨
2. **混合召回** —— 解决专有名词与精确匹配
3. **重排** —— 精度提升最直接
4. **缓存** —— 成本和延迟优化，注意失效策略
5. **换更强的 LLM** —— 放在最后，往往是前几步没做好时的无效解法

下一步打算写写 RAG 的评估怎么做——"看起来不错"和"指标不错"之间，差的也是一整套方法论。
