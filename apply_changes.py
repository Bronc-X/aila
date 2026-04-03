#!/usr/bin/env python3
import re

with open('app/slides/d1-morning/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update S_llm_dev with 10 nodes
old_s_llm_dev_pattern = r'// \[新增\] S_llm_dev: LLM发展历程 - 从GPT-1到GPT-5\.4.*?</tbody>'
new_s_llm_dev = '''// [新增] S_llm_dev: LLM发展历程 - 十大关键节点
    <Slide key="s_llm_dev">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl font-black text-[#2D2A26] mb-4 text-center">
          大模型<span className="text-gradient">进化简史</span>：十大关键节点
        </h2>
        <p className="text-center text-[var(--text-muted)] mb-10">从最早的语言模型到具备自我操控能力的GPT-5.4，十次跨越重新定义"AI能做什么"</p>
        <div className="overflow-hidden rounded-2xl border border-[#E5E1D8]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#F3F1ED]">
                <th className="p-4 font-bold text-[#6B6660] uppercase tracking-wide w-[100px]">时间</th>
                <th className="p-4 font-bold text-[#6B6660] uppercase tracking-wide">模型</th>
                <th className="p-4 font-bold text-[#6B6660] uppercase tracking-wide">参数量</th>
                <th className="p-4 font-bold text-[#6B6660] uppercase tracking-wide">关键突破</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#E5E1D8]">
                <td className="p-4 text-[var(--text-muted)] font-mono">2018</td>
                <td className="p-4 font-bold text-[#2D2A26]">GPT-1</td>
                <td className="p-4 text-[var(--text-secondary)]">1.17亿</td>
                <td className="p-4 text-[var(--text-secondary)]">证明了"预训练+微调"的范式可行性</td>
              </tr>
              <tr className="border-t border-[#E5E1D8] bg-[#FAFAF8]">
                <td className="p-4 text-[var(--text-muted)] font-mono">2019</td>
                <td className="p-4 font-bold text-[#2D2A26]">GPT-2</td>
                <td className="p-4 text-[var(--text-secondary)]">15亿</td>
                <td className="p-4 text-[var(--text-secondary)]">长篇生成引起关注，暂缓开源</td>
              </tr>
              <tr className="border-t border-[#E5E1D8]">
                <td className="p-4 text-[var(--text-muted)] font-mono">2020</td>
                <td className="p-4 font-bold text-[#2D2A26]">GPT-3</td>
                <td className="p-4 text-[var(--text-secondary)]">1750亿</td>
                <td className="p-4 text-[var(--text-secondary)]">涌现能力爆发——零样本学习、代码生成</td>
              </tr>
              <tr className="border-t border-[#E5E1D8] bg-[#FAFAF8]">
                <td className="p-4 text-[var(--text-muted)] font-mono">2023.03</td>
                <td className="p-4 font-bold text-[#D97706]">GPT-4</td>
                <td className="p-4 text-[#D97706] font-bold">万亿级(估算)</td>
                <td className="p-4 text-[#D97706] font-bold">多模态 + 超越90%人类考试成绩</td>
              </tr>
              <tr className="border-t border-[#E5E1D8]">
                <td className="p-4 text-[var(--text-muted)] font-mono">2024.06</td>
                <td className="p-4 font-bold text-[#D97706]">Claude 3.5 Sonnet</td>
                <td className="p-4 text-[#D97706] font-bold">~300B</td>
                <td className="p-4 text-[#D97706] font-bold">编程能力领跑，全网全行业代码效率2倍进阶</td>
              </tr>
              <tr className="border-t border-[#E5E1D8] bg-[#FAFAF8]">
                <td className="p-4 text-[var(--text-muted)] font-mono">2024.12</td>
                <td className="p-4 font-bold text-[#D97706]">Gemini 2.0</td>
                <td className="p-4 text-[#D97706] font-bold">多模态</td>
                <td className="p-4 text-[#D97706] font-bold">原生多模态实时交互革命</td>
              </tr>
              <tr className="border-t border-[#E5E1D8]">
                <td className="p-4 text-[var(--text-muted)] font-mono">2025.01</td>
                <td className="p-4 font-bold text-[#D97706]">DeepSeek-R1</td>
                <td className="p-4 text-[#D97706] font-bold">671B MoE</td>
                <td className="p-4 text-[#D97706] font-bold">中国开源模型首在数学推理逼近GPT-4o</td>
              </tr>
              <tr className="border-t border-[#E5E1D8] bg-[#FAFAF8]">
                <td className="p-4 text-[var(--text-muted)] font-mono">2025.08</td>
                <td className="p-4 font-bold text-[#D97706]">GPT-5</td>
                <td className="p-4 text-[#D97706] font-bold">——</td>
                <td className="p-4 text-[#D97706] font-bold">100万上下文 + 面向系统的自主决策Agent</td>
              </tr>
              <tr className="border-t border-[#E5E1D8]">
                <td className="p-4 text-[var(--text-muted)] font-mono">2026.01</td>
                <td className="p-4 font-bold text-[#D97706]">Claude Agent Teams</td>
                <td className="p-4 text-[#D97706] font-bold">——</td>
                <td className="p-4 text-[#D97706] font-bold">机器首次实现复杂目标的自动任务分解联合作业</td>
              </tr>
              <tr className="border-t border-[#E5E1D8] bg-[#FAFAF8]">
                <td className="p-4 text-[var(--text-muted)] font-mono">2026.03</td>
                <td className="p-4 font-bold text-[#D97706]">GPT-5.4</td>
                <td className="p-4 text-[#D97706] font-bold">——</td>
                <td className="p-4 text-[#D97706] font-bold">全面操控电脑、各类OS、甚至现实机器，OSWorld 90%+</td>
              </tr>
            </tbody>'''
content = re.sub(old_s_llm_dev_pattern, new_s_llm_dev, content, flags=re.DOTALL)

# 2. Update P5 (S_history + S_revolution). Let's merge them into one striking slide about 认知革命 and the logic
old_s_history_pattern = r'// \[新增\] S4: 科技进化史.*?</Slide>\n\n    // \[新增\] S_revolution: 三次革命冲击力量化对比\n    <Slide key="s_revolution".*?</Slide>'

new_s_revolution = '''// [新增] S4: 认知革命——超越信息革命的力量
    <Slide key="s4">
      <motion.div {...fadeUp} className="text-center max-w-5xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-black text-[#D97706] mb-6">
          认知<span className="text-gradient">革命</span>
        </h2>
        <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-3xl mx-auto leading-relaxed">
          电的发现让人类实现<b>能量的自由流动</b>，开启工业时代。<br/>
          互联网把<b>信息</b>变成可检索的资产，消灭了距离。<br/>
          <strong className="text-[#2D2A26]">AI 认知革命</strong> 则是让 <b>思考和决策</b> 本身实现自动化，这是堪比电的发现的极高维度跃迁，它的冲击力远超互联网产生的信息革命。
        </p>

        {/* 横向时间轴对比三次革命 */}
        <div className="flex flex-col gap-10">
          <div className="relative h-20 md:h-24">
            <div className="absolute left-0 top-0 w-1/3 text-center">
              <div className="text-xl md:text-2xl font-black text-[#2D2A26]">动力革命 (19世纪)</div>
              <div className="text-sm md:text-base text-[var(--text-muted)] mt-1">GDP 年均增速 <strong>+0.3%~0.6%</strong></div>
              <div className="mt-3 h-2 w-16 md:w-24 bg-[#D97706] rounded-full mx-auto" style={{width: '30%'}}></div>
            </div>
            <div className="absolute left-1/3 top-0 w-1/3 text-center">
              <div className="text-xl md:text-2xl font-black text-[#2D2A26]">信息革命 (1990s)</div>
              <div className="text-sm md:text-base text-[var(--text-muted)] mt-1">GDP 年均增速 <strong>+0.4%~0.8%</strong></div>
              <div className="mt-3 h-2 w-16 md:w-24 bg-[#D97706] rounded-full mx-auto" style={{width: '55%'}}></div>
            </div>
            <div className="absolute right-0 top-0 w-1/3 text-center">
              <div className="text-xl md:text-2xl font-black text-[#D97706]">AI 认知革命 (此时)</div>
              <div className="text-sm md:text-base text-[var(--text-muted)] mt-1">预估年均 <strong>+1.2%~1.5%</strong></div>
              <div className="mt-3 h-2 w-16 md:w-24 bg-[#D97706] shadow-glow rounded-full mx-auto" style={{width: '90%'}}></div>
            </div>
          </div>

          {/* 影响维度表格 */}
          <div className="overflow-hidden rounded-2xl border border-[#E5E1D8]">
            <table className="w-full text-left text-sm md:text-base">
              <thead className="bg-[#F3F1ED]">
                <tr>
                  <th className="p-4 font-bold text-[#6B6660] uppercase tracking-wide">核心指标</th>
                  <th className="p-4 font-bold text-[#6B6660] uppercase tracking-wide">动力 / 蒸汽电气</th>
                  <th className="p-4 font-bold text-[#6B6660] uppercase tracking-wide">信息 / PC互联网</th>
                  <th className="p-4 font-bold text-[#D97706] uppercase tracking-wide">认知 / 生成式AI</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[#E5E1D8]">
                  <td className="p-4 font-bold text-[#2D2A26]">渗透速度</td>
                  <td className="p-4 text-[var(--text-secondary)]">数十年</td>
                  <td className="p-4 text-[var(--text-secondary)]">约 20 年</td>
                  <td className="p-4 text-[#D97706] font-bold">18 个月窗口期</td>
                </tr>
                <tr className="border-t border-[#E5E1D8] bg-[#FAFAF8]">
                  <td className="p-4 font-bold text-[#2D2A26]">本质影响</td>
                  <td className="p-4 text-[var(--text-secondary)]">解放体力劳动</td>
                  <td className="p-4 text-[var(--text-secondary)]">消灭信息差与距离</td>
                  <td className="p-4 text-[#D97706] font-bold">认知自动化与自主决策</td>
                </tr>
                <tr className="border-t border-[#E5E1D8]">
                  <td className="p-4 font-bold text-[#2D2A26]">商业增量</td>
                  <td className="p-4 text-[var(--text-secondary)]">规模化制造</td>
                  <td className="p-4 text-[var(--text-secondary)]">全球化协作、中介消亡</td>
                  <td className="p-4 text-[#D97706] font-bold">年经济增量可达 2.6T~4.4T 美元</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </Slide>'''

content = re.sub(old_s_history_pattern, new_s_revolution, content, flags=re.DOTALL)

# 3. Replace text-red-xxx with text-[#D97706] globally in page.tsx
content = re.sub(r'text-red-400/60', 'text-[#D97706]/60', content)
content = re.sub(r'text-red-400/80', 'text-[#D97706]/80', content)
content = re.sub(r'text-red-400', 'text-[#D97706]', content)
content = re.sub(r'text-red-500', 'text-[#D97706]', content) # just in case

with open('app/slides/d1-morning/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# Now do the same for case-details.tsx
with open('app/slides/d1-morning/case-details.tsx', 'r', encoding='utf-8') as f:
    cd = f.read()

cd = re.sub(r'text-red-400/60', 'text-[#D97706]/60', cd)
cd = re.sub(r'text-red-400/80', 'text-[#D97706]/80', cd)
cd = re.sub(r'text-red-400', 'text-[#D97706]', cd)
cd = re.sub(r'text-red-500', 'text-[#D97706]', cd)

with open('app/slides/d1-morning/case-details.tsx', 'w', encoding='utf-8') as f:
    f.write(cd)

print("Updates applied via python script.")
