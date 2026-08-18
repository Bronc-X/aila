# 对话补充：从 Transformer 论文到现代 LLM、扩散模型与 RAG

> `[对话补充]` 来源线程：`01a008fe-af2e-7c63-9c56-ac65f887315b`
>
> `[边界]` 本章根据 2026-08-16 的对话整理。它不属于语雀原文，也不把课程推荐写成唯一正确路径。

## 1. 你的当前起点

`[对话原文]` 你已经理解 Token、切词、向量和注意力机制，也看完了 3Blue1Brown 的线性代数与 Andrew Ng 的相关入门内容。

`[确切变化]` 因此本章不再把时间放在“Token 是什么”“向量是什么”“Attention 是看重点”这些入门解释上，而是把验收标准提高到：

1. 能从论文公式写出可以运行的 Transformer。
2. 能说明 Encoder-Decoder、Decoder-Only 和现代 LLaMA Block 的结构差异。
3. 能解释一个语言模型怎样完成训练、推理、缓存和后训练。
4. 能把模型知识连接到扩散模型、数据库、向量检索和 RAG 工程。

## 2. 痛点源头

只读《Attention Is All You Need》会留下五个明确缺口：

1. 论文目标是机器翻译，不是现代通用聊天模型。
2. 论文同时包含 Encoder 和 Decoder，现代文本 LLM 大量使用 Decoder-Only。
3. 论文没有覆盖 RoPE、RMSNorm、SwiGLU、GQA、KV Cache 和 FlashAttention。
4. 论文没有完整讲数据清洗、Scaling Law、分布式训练、推理服务和后训练。
5. 论文不能替代数据库、向量检索、RAG 和扩散模型的独立知识体系。

`[不能说成什么]` “读懂 2017 Transformer 论文”等于“理解现代 LLM 全栈”是不成立的。

## 3. 物理齿轮：论文驱动的学习链

### 第一步：逐段读原论文

**必学资料**

- 《Attention Is All You Need》原论文。
- 李沐《Transformer 论文逐段精读》。
- Harvard The Annotated Transformer。

**要解决的问题**

1. 输入 Embedding 和位置编码怎样组成模型输入。
2. `QK^T / sqrt(d_k)` 为什么要缩放。
3. Softmax 后的权重怎样作用到 V。
4. 多头结果怎样拼接并重新投影。
5. Padding Mask 和 Causal Mask 分别阻止什么信息进入计算。
6. Encoder、Decoder、Cross-Attention 怎样连接。
7. Residual、LayerNorm、FFN 在一个 Block 中的执行顺序。

**验收**

合上论文后，画出训练时和自回归推理时的两条独立数据流。

### 第二步：把论文写成代码

**必学资料**

- Umar Jamil：Coding a Transformer from Scratch in PyTorch。

**必须自己写出的部件**

1. Scaled Dot-Product Attention。
2. Multi-Head Attention。
3. Padding Mask。
4. Causal Mask。
5. Encoder Block。
6. Decoder Block。
7. Positional Encoding。
8. 训练循环。
9. 自回归解码循环。

**验收**

不能只复制最终代码。至少为 Attention 形状、Mask 行为、残差输出和自回归可见范围写测试。

### 第三步：从原始 Transformer 进入 Decoder-Only GPT

**必学资料**

- Andrej Karpathy：Let's Build GPT from Scratch。

**核心变化**

1. 移除 Encoder 和 Cross-Attention。
2. 每个位置只读取它前面的 Token。
3. 训练目标改为预测下一个 Token。
4. 生成时把新 Token 追加到上下文，再执行下一步预测。

**验收**

能解释为什么分类式 Encoder、机器翻译式 Encoder-Decoder 和语言生成式 Decoder-Only 不能被一句“都是 Transformer”抹平差异。

### 第四步：真正训练 GPT-2

**必学资料**

- Andrej Karpathy：Let's Reproduce GPT-2 (124M)。

**核心内容**

1. 权重初始化。
2. 优化器与学习率调度。
3. Batch 与梯度累积。
4. 混合精度。
5. 训练稳定性。
6. 多 GPU 训练。
7. 训练日志和验证损失。

**验收**

保存每次训练的配置、代码版本、数据范围、损失曲线和样例输出。只保存最终权重无法解释模型为何变好或变坏。

### 第五步：补齐现代 LLaMA Block

**必学资料**

- Umar Jamil：Coding LLaMA 2 from Scratch。

**需要补齐的结构**

- RoPE：把相对位置信息写入 Q 和 K 的旋转关系。
- RMSNorm：按均方根规范数值，不执行 LayerNorm 的完整均值处理。
- SwiGLU：使用门控和 SiLU 组成 FFN 变体。
- GQA：多组 Query Head 共享较少的 Key/Value Head。
- KV Cache：保存已经生成位置的 K/V，避免每一步重复计算全部历史。

**回查内容**

- FlashAttention 改变 Attention 中间矩阵的分块、保存、重算和显存读写方式。
- 具体速度和显存倍数必须绑定硬件、序列长度、精度和实现版本，不能直接背固定数字。

### 第六步：用 Stanford CS336 收束系统知识

**必学模块**

1. Tokenizer 与数据。
2. Transformer、MoE 和 Attention 变体。
3. GPU、Triton 与算子。
4. 分布式训练。
5. Scaling Law。
6. Inference。
7. Evaluation。
8. Post-training。
9. Multimodality。

**选学策略**

你已经掌握的 Token、向量和 Attention 入门部分可以快速检查，不需要按初学速度重复观看。把时间放在作业、实现和系统边界上。

## 4. 扩散模型分支

### 痛点源头

Transformer 语言模型的下一个 Token 预测不能自动解释图像扩散模型怎样从噪声恢复数据。

### 必学顺序

1. DDPM 的前向加噪与反向去噪目标。
2. ELBO 与训练目标之间的关系。
3. Score Matching。
4. SDE 视角。
5. Flow Matching 与 Rectified Flow。
6. Latent Diffusion。
7. Classifier-Free Guidance。
8. Diffusion Transformer。
9. 图像、视频生成与评测。

### 资料

- Stanford CME296。
- Coding Stable Diffusion from Scratch。

### 验收

能明确区分训练时随机时间步的噪声预测，与推理时按多个时间步逐次更新样本的过程。

## 5. 数据库、向量检索与 RAG 分支

### 痛点源头

模型参数不会自动包含公司的最新私有资料。把所有资料直接塞进 Prompt 会增加长度、延迟和错误风险，也无法稳定控制权限、版本和来源。

### 数据库底座

**选学资料**

- CMU 15-445 中的关系模型、SQL、索引、事务、并发控制和查询优化。

**验收**

能解释数据表负责什么、B-Tree 索引负责什么、事务负责什么，以及为什么向量索引不能替代普通业务数据库。

### RAG 内部步骤

1. 读取并解析文档。
2. 保留标题、页码、表格和来源元数据。
3. 按结构与长度切分。
4. 生成 Embedding。
5. 建立向量索引和关键词索引。
6. 执行 BM25 与向量检索。
7. 合并为混合检索候选。
8. 使用 Reranker 重新排序。
9. 选择有限证据组成模型上下文。
10. 生成带来源的回答。
11. 评测召回、引用、回答、拒答、延迟与成本。

### 必做项目

```text
PostgreSQL
  + pgvector
  + BM25
  + 混合检索
  + Reranker
  + RAG Evaluation
```

**确切验收**

- 知识库有答案时，测试答案是否被召回。
- 召回后，测试证据是否实际进入最终上下文。
- 生成后，测试引用是否支持结论。
- 没有足够证据时，测试系统是否拒答或追问。
- 数据有权限或版本差异时，测试过滤是否在检索前生效。

## 6. 论文首页的 `*` 与 `†`

- `*`：论文脚注定义为 Equal contribution，表示这些作者贡献相同；该论文说明作者排序是随机的。
- `†`：不是加号，而是 dagger。该论文用它说明 Aidan N. Gomez 的工作是在 Google Brain 任职期间完成的。

`[边界]` 符号含义必须以当前论文脚注为准。在其他论文中，`†` 可能表示通讯作者或其他说明。

## 7. 最精简执行顺序

### 必学

1. 李沐论文精读 + 《Attention Is All You Need》。
2. Umar Jamil 从零实现 Transformer。
3. Karpathy 从零构建 GPT。
4. Karpathy 复现 GPT-2。
5. Umar Jamil 从零实现 LLaMA 2。
6. Stanford CS336 的训练、数据、推理、评测和后训练模块。
7. PostgreSQL + pgvector + BM25 + 混合检索 + Reranker + RAG Evaluation 项目。

### 选学

1. Stanford CME296，用于扩散模型完整分支。
2. CMU 15-445 的数据库、索引和事务章节。
3. Stanford CME295，作为现代 LLM 全景复盘。

### 回查

1. The Annotated Transformer。
2. 3Blue1Brown Chapter 5、6、7。
3. 论文脚注、公式推导和各实现的版本差异。
4. 任何固定性能、显存和准确率数字的实验条件。

## 8. 自测题

1. 为什么《Attention Is All You Need》不能单独覆盖现代 LLM？
2. Decoder-Only 相比 Encoder-Decoder 删除了什么，又改变了什么训练目标？
3. Padding Mask 与 Causal Mask 的作用是否相同？
4. KV Cache 保存什么，为什么能减少生成阶段的重复计算？
5. GQA 与标准 MHA 的 Key/Value Head 使用方式有什么差异？
6. 为什么向量数据库不能替代 PostgreSQL 的事务和业务表？
7. Reranker 为什么不能找回第一阶段完全没有召回的文档？
8. 如何证明一次 RAG 优化不是只让回答“看起来更通顺”？
9. 扩散模型的训练步骤和采样步骤分别改变什么状态？
10. 论文作者旁的 `†` 是否在所有论文里都代表同一含义？

## 9. 外部资料入口

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
