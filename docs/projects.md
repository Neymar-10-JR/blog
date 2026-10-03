---
title: 项目
description: 个人项目展示：RAG 问答系统 Ragent 及后端实践
aside: false
outline: deep
---

# 项目

## Ragent — 面向 Agentic RAG 的 Java AI 应用平台

**技术栈**：Spring Boot · Spring AI 2.0 · Milvus · Redis · PostgreSQL · MCP

> TODO：下面写的是项目本身的通用能力与我的实践重点，建议补上你具体改动了哪个模块、
> 解决了什么问题——面试官追问的永远是「你做的那部分」，而不是项目 README。

Ragent 是一个面向 Agentic RAG 演进的 Java AI 应用平台，覆盖从文档入库到智能问答的完整链路。
我在它的基础上做了二次开发与模块级拆解，重点看了检索链路、会话记忆和流量保护三块。

**关注的系统能力**

| 模块 | 能力 | 工程价值 |
| --- | --- | --- |
| 混合检索 | 向量、关键词、知识图谱、联网搜索并行召回 + 去重 + RRF 融合 + Rerank | 解决纯向量召回对专有名词不敏感的问题 |
| 问题理解 | 查询词映射、问题重写与拆分、树形意图识别、多知识库路由 | 用户口语化提问也能命中正确知识库 |
| 会话记忆 | 最近 N 轮消息 + 持久化摘要 | 控制 Token 成本的同时保留关键上下文 |
| 流量保护 | Redis 公平排队 + 分布式并发控制 | 突发请求不会打爆模型服务 |
| 工具调用 | MCP 工具发现、提参与校验 | 把业务接口标准化暴露给模型调用 |
| 知识闭环 | 可编排入库 Pipeline、回答溯源、用户反馈、Trace | 线上问题可定位可回溯 |

**源码**

- 上游仓库：<https://github.com/nageoffer/ragent>
- 我的 fork（含修改与笔记）：<https://github.com/Neymar-10-JR/ragent>

**延伸**：检索链路部分的实践整理在 [RAG 检索链路的工程要点笔记](/posts/rag-retrieval-notes) 一文里。

---

## 其他小项目

> TODO：可以把课程项目、算法竞赛题解、阅读笔记仓库等一并列出，每个 2-3 行足够。

- **TODO**：项目名称 —— 一句话说明做了什么 + 技术栈 + 链接

---

## 本站脚手架

本站本身也是一个可复用的项目：**VitePress + Cloudflare Pages** 的零成本静态博客方案，支持 Markdown 写作、LaTeX 公式、全文搜索、`git push` 自动部署。构建方式见仓库 README。
