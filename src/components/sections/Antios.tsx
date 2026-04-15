"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Cpu, Layers, Globe, Database, Lock } from "lucide-react";

export default function Antios() {
  return (
    <>
      {/* -------------------- ANTIOS PAGE 1: 产品定位与差异 -------------------- */}
      <section className="snap-section relative z-10 flex flex-col items-center justify-center min-h-screen p-8 bg-neutral-900/40 backdrop-blur-md border-t border-neutral-800/50">
        <div className="max-w-7xl mx-auto w-full flex flex-col-reverse lg:flex-row gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex-1 flex justify-center w-full"
          >
            <div className="relative w-[320px] h-[650px] rounded-[3rem] border-[8px] border-neutral-900 bg-black shadow-[0_0_100px_rgba(255,255,255,0.05)] overflow-hidden scale-90 lg:scale-100">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 bg-neutral-900 rounded-full z-20" />
              
              <div className="w-full h-full relative flex flex-col items-center justify-center rounded-[2rem] overflow-hidden">
                 <video 
                   src="/antios.mp4" 
                   autoPlay 
                   loop 
                   muted 
                   playsInline 
                   className="absolute inset-0 w-full h-full object-cover"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-8"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-mono text-neutral-400">iOS 原生健康 Agent 平台 (Health Agent Runtime)</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4">
              antios.
            </h2>
            <h3 className="text-xl font-mono text-white tracking-widest">不是 AI 聊天 App，是健康状态运行时</h3>
            
            <p className="text-sm text-neutral-400 leading-relaxed font-mono mt-8">
              市面上绝大多数"AI 健康助手"的工作方式是：用户打字描述症状 → 大模型生成一段模糊建议。这个流程的核心缺陷是模型没有接触过该用户的任何真实身体数据，输出结果完全依赖用户自述的准确程度，极易产生错误甚至有害建议。
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed font-mono mt-4">
              Antios 做了一个根本性的架构决策：Agent 的第一输入源不是文字，而是 Apple Watch 每秒采集的生理参数——HRV（心率变异性）、静息心率、睡眠分期、呼吸速率、运动恢复指数。这些硬参数在本地压缩成 8 个强类型的派生状态变量（如 arousal_load / recovery_debt），然后才交给大模型做有约束的推理。
            </p>
          </motion.div>
        </div>
      </section>

      {/* -------------------- ANTIOS PAGE 2: 三层递增护城河 -------------------- */}
      <section className="snap-section relative z-10 flex flex-col items-center justify-center min-h-screen p-8 bg-[#050505] border-t border-neutral-800/50 overflow-hidden">
        <motion.div 
           className="max-w-6xl mx-auto w-full relative z-10"
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: false, amount: 0.3 }}
           transition={{ duration: 0.8 }}
        >
           <div className="text-center mb-16">
              <h3 className="text-4xl lg:text-5xl text-white font-bold tracking-tight mb-4">
                 护城河随时间自动加深的三层结构
              </h3>
              <p className="text-neutral-500 font-mono tracking-widest text-sm">越用越深，越深越难替代</p>
           </div>
           
           <div className="space-y-8">
              <motion.div
                 initial={{ opacity: 0, x: -30 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: false, amount: 0.3 }}
                 transition={{ duration: 0.6 }}
                 className="bg-black/60 border border-neutral-800 p-8 rounded-2xl backdrop-blur flex gap-6 items-start"
              >
                 <div className="flex flex-col items-center shrink-0">
                   <Database className="w-8 h-8 text-white mb-2" />
                   <div className="w-px h-full bg-neutral-800 min-h-[60px]" />
                 </div>
                 <div>
                   <h4 className="text-xl text-white font-bold mb-3">第一层：传感器记忆层（Month 1+）</h4>
                   <p className="text-neutral-400 font-mono text-sm leading-relaxed">
                      系统从第一天起就在持续积累该用户的 5 层记忆堆栈：原始传感器数据 → 传感器衍生记忆（如"连续三天恢复不足"）→ 行为循环记忆（做了什么、效果如何）→ 对话记忆 → 策略记忆。这套记忆体系是存在用户本机与私有后端的。一个使用了 6 个月的用户，其记忆层的厚度是全新安装时的数十倍。任何竞品想要复制这份针对个体的生理档案，需要该用户从零重新佩戴设备 6 个月。
                   </p>
                 </div>
              </motion.div>
              
              <motion.div
                 initial={{ opacity: 0, x: -30 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: false, amount: 0.3 }}
                 transition={{ duration: 0.6, delay: 0.15 }}
                 className="bg-black/60 border border-neutral-800 p-8 rounded-2xl backdrop-blur flex gap-6 items-start"
              >
                 <div className="flex flex-col items-center shrink-0">
                   <Zap className="w-8 h-8 text-white mb-2" />
                   <div className="w-px h-full bg-neutral-800 min-h-[60px]" />
                 </div>
                 <div>
                   <h4 className="text-xl text-white font-bold mb-3">第二层：贝叶斯个性化引擎（Month 3+）</h4>
                   <p className="text-neutral-400 font-mono text-sm leading-relaxed">
                      系统使用显式的多变量贝叶斯公式（match_score = 0.34H + 0.26S + 0.18T + 0.12R + 0.10A）来计算每一条干预建议的匹配度。随着用户的行为反馈数据（做了/没做/有用/没用）源源不断地回灌，先验概率被持续更新。3 个月后，这套为该个体量身定制的概率矩阵几乎不可能被任何新下载的竞品复制。
                   </p>
                 </div>
              </motion.div>
              
              <motion.div
                 initial={{ opacity: 0, x: -30 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: false, amount: 0.3 }}
                 transition={{ duration: 0.6, delay: 0.3 }}
                 className="bg-black/60 border border-neutral-800 p-8 rounded-2xl backdrop-blur flex gap-6 items-start"
              >
                 <div className="flex flex-col items-center shrink-0">
                   <Lock className="w-8 h-8 text-white mb-2" />
                 </div>
                 <div>
                   <h4 className="text-xl text-white font-bold mb-3">第三层：平台 API 网关锁定（Month 6+）</h4>
                   <p className="text-neutral-400 font-mono text-sm leading-relaxed">
                      V1.2 架构已经定义了 10 个强类型 Agent API（observe_state_snapshot / score_bayesian_uplift / retrieve_science_journals 等）。未来任何第三方 Agent 如果想要了解该用户的健康状态，必须通过 Antios 暴露的窄接口进行请求，Antios 始终是策略执行和隐私审核的最终裁决方。接入的外部 Agent 越多，Antios 的平台网关地位越不可替代。
                   </p>
                 </div>
              </motion.div>
           </div>
        </motion.div>
      </section>

      {/* -------------------- ANTIOS PAGE 3: 商业回报模型 -------------------- */}
      <section className="snap-section relative z-10 flex flex-col items-center justify-center min-h-screen p-8 bg-neutral-900/40 backdrop-blur-sm border-t border-neutral-800/50">
        <motion.div 
           className="max-w-5xl mx-auto w-full flex flex-col lg:flex-row gap-12 items-center"
           initial={{ opacity: 0, filter: "blur(10px)" }}
           whileInView={{ opacity: 1, filter: "blur(0px)" }}
           viewport={{ once: false, amount: 0.3 }}
           transition={{ duration: 1 }}
        >
           <div className="flex-1 space-y-8 text-center lg:text-left">
              <Globe className="w-16 h-16 text-white mx-auto lg:mx-0 opacity-50" />
              <h3 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
                 商业模型：生理数据的过路费
              </h3>
              <p className="text-neutral-400 font-mono text-sm leading-relaxed text-justify">
                 Antios 的商业价值不在于卖一个 App，而在于占据了"人体生理参数 → AI 决策"这条链路的咽喉位置。
              </p>
              <p className="text-neutral-400 font-mono text-sm leading-relaxed text-justify mt-4">
                 当苹果、华为、小米等硬件厂商的 Agent 未来想要为用户提供健康建议时，它们需要的不仅仅是原始心率数字——它们需要经过临床安全验证的派生状态变量和个性化贝叶斯置信度。而这些只存在于已经运行了几个月的 Antios 实例中。我们收取的是生理数据的 API 调用使用费。
              </p>
           </div>
           
           <div className="lg:w-1/3 flex flex-col gap-6">
              <div className="border border-neutral-800 bg-[#050505] rounded-lg p-6 hover:bg-neutral-800 transition-colors">
                 <span className="text-white font-mono text-2xl block mb-2">订阅制</span>
                 <p className="text-sm font-mono text-neutral-400">个人用户 ¥198/年。企业健康管理批量授权另议。</p>
              </div>
              <div className="border border-neutral-800 bg-[#050505] rounded-lg p-6 hover:bg-neutral-800 transition-colors">
                 <span className="text-white font-mono text-2xl block mb-2">API 调用费</span>
                 <p className="text-sm font-mono text-neutral-400">第三方 Agent 每次查询用户状态快照按次计费。</p>
              </div>
              <div className="border border-neutral-800 bg-[#050505] rounded-lg p-6 hover:bg-neutral-800 transition-colors">
                 <span className="text-white font-mono text-2xl block mb-2">极低流失率</span>
                 <p className="text-sm font-mono text-neutral-400">卸载 = 放弃 6 个月的生理记忆积累。用户承受不起这个沉没成本。</p>
              </div>
           </div>
        </motion.div>
      </section>
    </>
  );
}
