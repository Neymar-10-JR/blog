---
title: Markdown 写作速查（含数学公式）
date: '2026-10-04'
tags: [工具, Markdown, LaTeX]
category: 工具
summary: 本站支持的 Markdown 语法一览：代码块、表格、提示块、数学公式、折叠面板，写完自查用。
sticky: true
---

这篇文章既是给自己的速查表，也是一次渲染效果的验证。写新文章时如果不确定某种语法是否生效，回来看一眼就行。

## 基础排版

**加粗**、*斜体*、~~删除线~~、`行内代码`。

引用块：

> 如果你无法用简单的语言解释它，说明你还没有真正理解它。

有序列表：

1. 第一步
2. 第二步
   - 子项
   - 子项

任务列表：

- [x] 搭好博客
- [ ] 写完第一篇文章

## 链接

- 站内文章：[第一篇](/posts/first-post)
- 站内页面：[项目页](/projects)
- 外部链接：[VitePress 文档](https://vitepress.dev)

## 代码块

````markdown
```java
@Service
public class RagService {
    private final VectorStore vectorStore;

    public RagService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public List<Doc> retrieve(String query, int topK) {
        return vectorStore.similaritySearch(query, topK);
    }
}
```
````

渲染效果：

```java
@Service
public class RagService {
    private final VectorStore vectorStore;

    public RagService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public List<Doc> retrieve(String query, int topK) {
        return vectorStore.similaritySearch(query, topK);
    }
}
```

带行高亮与大括号行号：

```python {2,4-5}
def hybrid_search(query: str, top_k: int = 5):
    dense = vector_search(query, top_k * 2)      # 向量召回
    sparse = bm25_search(query, top_k * 2)       # 关键词召回
    merged = rrf_fuse([dense, sparse], k=60)     # reciprocal rank fusion
    return rerank(query, merged)[:top_k]
```

## 表格

| 向量索引 | 构建速度 | 查询速度 | 召回率 | 内存占用 |
| --- | --- | --- | --- | --- |
| FLAT | 快 | 慢 | 100% | 高 |
| IVF_FLAT | 中 | 中 | 高 | 中 |
| HNSW | 慢 | 快 | 高 | 高 |

## 提示块

::: tip 提示
信息型提示，用来放补充背景。
:::

::: info 信息
中立要点，适合写结论或注意事项。
:::

::: warning 警告
容易被坑的地方写在这里。
:::

::: danger 危险
会导致数据丢失或线上事故的操作放这里。
:::

::: details 可折叠内容
点击展开，适合放长代码、配置或 BibTeX。

```text
这里可以放任何内容
```

:::

## 数学公式

行内公式：注意力机制的核心是一次加权的 $Q$、$K$ 相似度匹配。

块级公式：

$$
\text{Attention}(Q, K, V) = \text{softmax}\left( \frac{QK^{\top}}{\sqrt{d_k}} \right) V
$$

多头注意力：

$$
\text{MultiHead}(Q,K,V) = \text{Concat}(\text{head}_1, \dots, \text{head}_h) W^O, \quad \text{head}_i = \text{Attention}(QW_i^Q, KW_i^K, VW_i^V)
$$

带编号与对齐的推导：

$$
\begin{aligned}
\mathcal{L} &= -\sum_{i=1}^{N} \log p(y_i \mid y_{<i}, x) \\
            &= -\sum_{i=1}^{N} \log \frac{\exp(s_{i,y_i})}{\sum_{j=1}^{V} \exp(s_{i,j})}
\end{aligned}
$$

矩阵形式：

$$
H^{(l+1)} = \sigma\left( \tilde{D}^{-\frac{1}{2}} \tilde{A} \tilde{D}^{-\frac{1}{2}} H^{(l)} W^{(l)} \right)
$$

::: tip 从 LaTeX 粘贴的小建议
论文里的公式可以直接拷过来，但要注意 `\tag`、`\label` 这类需要 amsmath 环境的语法可能不生效，块级公式里保留纯公式部分即可。
:::

## 图片

图片放在 `docs/public/images/` 下，引用时用根路径：

```markdown
![架构图](/images/rag-arch.png)
```

建议给每张图加一句图注说明它想表达什么，纯图往往不如一句话有信息量。

## Frontmatter

每篇文章开头的元信息：

```yaml
---
title: 文章标题
date: '2026-10-04'
tags: [标签一, 标签二]
category: 分类
summary: 一句话摘要
sticky: false
---
```

`date` 建议加引号，避免被 YAML 解析成日期对象导致排序异常。
