# 对话摘录：课程选择与 Transformer 论文学习路线

> 来源线程：`01a008fe-af2e-7c63-9c56-ac65f887315b`
>
> 发生时间：2026-08-16
>
> 本文件保留该线程中的用户问题与最终回答要点，省略系统指令、工具日志和重复进度消息。它是新增的对话资料，不属于语雀原文。

## 一、课程范围与选择

### 用户问题

这几个课各在讲什么？

我现在想把算法、神经网络、深度学习、扩散模型、大语言模型最新的一些理论基础，以及给公司建数据库、向量库、用 RAG（检索增强生成）这些东西都了解清楚。

请你给我推荐一下，我应该看哪一个课程？如果这些内容没有包含在里面，你也可以给我推荐其他的课程。

### 对话结论

如果只在截图中的课程选择，建议先看 3Blue1Brown Chapter 5、6，再完整看 Stanford CME295。截图中的 Stanford Lecture 1 是 CME295 播放列表的第一讲，不需要重复看。

课程被分成两条并行学习线：

1. 模型理论：机器学习、神经网络、深度学习、Transformer、LLM、扩散模型。
2. 数据与检索工程：数据库、索引、向量检索、混合检索、RAG、评测与生产部署。

对话给出的课程定位：

- 3Blue1Brown Chapter 5：从词向量、下一个 Token 预测到 Transformer 数据流。
- 3Blue1Brown Chapter 6：Query、Key、Value、点积、Softmax、掩码和多头注意力。
- Stanford CME295：Transformer、架构技巧、训练与微调、推理、Agent、RAG、评测和趋势。
- MIT 6.S191：神经网络、序列、视觉、生成模型、强化学习和现代基础模型。
- Stanford CS336：从语言模型底层实现进入训练系统、数据、评测、推理和后训练。
- Stanford CME296：DDPM、Score Matching、SDE、Flow Matching、Latent Diffusion、DiT、图像与视频生成。
- CMU 15-445：关系模型、SQL、索引、事务、并发控制和查询优化。
- RAG 课程与项目：BM25、向量数据库、混合检索、分块、元数据、重排、评测、监控和生产部署。

对话给出的精简顺序：

1. 机器学习与深度学习基础。
2. Transformer 和 Attention 的可视化理解。
3. Stanford CME295 或更深入的 Stanford CS336。
4. Stanford CME296。
5. 数据库、向量检索和 RAG。
6. 实现一个 PostgreSQL + pgvector + 混合检索 + Reranker + RAG 评测项目。

## 二、以《Attention Is All You Need》为主线是否合适

### 用户问题

就是像 token、怎么切词、怎么去找向量，然后注意力机制这些，我都 OK 的。

这样吧，你说我去学习《Attention Is All You Need》那篇论文，然后根据那篇论文来发散，去学习里面涉及到的知识，这个学习路径怎么样？

或者说，你有没有其他的 YouTube 视频可以给我推荐？3Blue1Brown 的线性代数我已经看完了。Andrew Ng 的那些视频，刚推荐的视频我也看了。

### 对话结论

《Attention Is All You Need》适合作为起点，但不适合作为唯一主线。

它描述的是 2017 年用于机器翻译的 Encoder-Decoder Transformer。现代文本大语言模型通常采用 Decoder-Only 架构，并继续加入 RoPE、RMSNorm、SwiGLU、Grouped Query Attention、KV Cache、FlashAttention，以及新的数据、训练、推理和后训练方法。

推荐的学习主线：

```text
Attention Is All You Need
        ↓
亲手实现原始 Transformer
        ↓
GPT：Encoder-Decoder 转向 Decoder-Only
        ↓
GPT-2：真正训练一个语言模型
        ↓
LLaMA：现代 Transformer Block
        ↓
Scaling、数据、分布式训练、推理、后训练
        ↓
RAG / Diffusion 分支
```

对话建议把原论文与 Harvard The Annotated Transformer 放在一起阅读，然后依次完成：

1. Umar Jamil：Coding a Transformer from Scratch in PyTorch。
2. Andrej Karpathy：Let's Build GPT from Scratch。
3. Andrej Karpathy：Let's Reproduce GPT-2 (124M)。
4. Umar Jamil：Coding LLaMA 2 from Scratch。
5. Stanford CS336 Language Modeling from Scratch。

代码验收内容：

- Scaled Dot-Product Attention。
- Multi-Head Attention。
- Padding Mask 和 Causal Mask。
- Encoder Block 和 Decoder Block。
- Residual、LayerNorm、FFN。
- 训练过程和自回归推理。
- RoPE、RMSNorm、SwiGLU、GQA、KV Cache。

后续分支：

- 扩散模型：Coding Stable Diffusion from Scratch；Stanford CME296。
- RAG：Learn RAG From Scratch；随后实现 BM25 + 向量检索 + Hybrid Search + Reranker + RAG Evaluation。

## 三、李沐的 Transformer 论文精读

### 用户问题

用户询问视频：

`https://www.youtube.com/watch?v=nzqlFIcCSWQ`

### 对话结论

该视频是李沐的《Transformer 论文逐段精读》，适合以论文为中心向外扩展的学习方式。

它按论文顺序讲解，并覆盖：

- RNN、机器翻译和 Encoder-Decoder 的背景。
- Encoder、Decoder。
- LayerNorm。
- Scaled Dot-Product Attention。
- Multi-Head Attention。
- Embedding 和位置编码。
- 作者为何采用这些设计，以及论文应该怎样阅读。

它不能替代代码实现，也不会完整覆盖现代 LLM 的 RoPE、RMSNorm、SwiGLU、GQA、KV Cache、FlashAttention、Scaling Law 和后训练。

因此对话将路线调整为：

1. 李沐论文精读。
2. Umar Jamil 从零实现 Transformer。
3. Karpathy 从零构建 GPT。
4. Karpathy 复现 GPT-2。
5. Umar Jamil 从零实现 LLaMA 2。
6. Stanford CS336。

## 四、论文作者旁的星号与匕首符号

### 用户问题

Gomez 旁边的 `*` 和看起来像 `+` 的符号是什么意思？

### 对话结论

- `*`：表示这些作者贡献相同，英文是 Equal contribution。论文脚注说明作者排序是随机的。
- `†`：不是加号，而是 dagger 符号。它表示 Aidan N. Gomez 的这项工作是在 Google Brain 工作期间完成的，尽管论文署名单位是多伦多大学。

这些符号的含义由每篇论文自己的脚注定义。在其他论文中，`†` 也可能表示通讯作者或其他说明，不能脱离脚注直接套用。

## 五、对话中出现的主要资料

- Attention Is All You Need：https://arxiv.org/abs/1706.03762
- The Annotated Transformer：https://nlp.seas.harvard.edu/annotated-transformer/
- 李沐 Transformer 论文逐段精读：https://www.youtube.com/watch?v=nzqlFIcCSWQ
- Coding a Transformer from Scratch in PyTorch：https://www.youtube.com/watch?v=ISNdQcPhsts
- Let's Build GPT from Scratch：https://www.youtube.com/watch?v=kCc8FmEb1nY
- Let's Reproduce GPT-2 (124M)：https://www.youtube.com/watch?v=l8pRSuU81PU
- Coding LLaMA 2 from Scratch：https://www.youtube.com/watch?v=oM4VmoabDAI
- Stanford CS336：https://cs336.stanford.edu/
- Stanford CME296：https://cme296.stanford.edu/
- Coding Stable Diffusion from Scratch：https://www.youtube.com/watch?v=ZBKpAp_6TGI
- Learn RAG From Scratch：https://www.youtube.com/watch?v=sVcwVQRHIc8
