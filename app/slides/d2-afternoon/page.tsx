"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SlideEngine, Slide } from "@/components/slides/SlideEngine";
import { CaseModal } from "@/components/slides/CaseModal";
import { caseDetails } from "./case-details";
import { GitPullRequest, Search, LineChart, MessageSquare, CheckCircle2, ChevronRight } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 50, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { type: "spring" as const, stiffness: 100, damping: 20, delay: 0.1 },
};
const d = (delay: number) => ({
  initial: { opacity: 0, y: 30, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { type: "spring" as const, stiffness: 100, damping: 20, delay },
});

function allSlides(setModalContent: (content: React.ReactNode) => void) {
  return [
    <Slide key="s1" bg="#FAF9F6">
      <div className="hero-glow" />
      <motion.div {...fadeUp} className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div {...d(0.1)} className="text-[var(--brand-glow)] font-mono tracking-wide uppercase text-sm mb-12">
          D2 SESSION II · CLOSING
        </motion.div>
        <motion.h1 {...d(0.3)} className="text-7xl md:text-[8rem] font-black leading-[1.1] tracking-normal mb-10">
          <span className="text-[#2D2A26]">落地工作坊</span>
          <br /><span className="text-[#D97706]">{"& 商业赋能"}</span>
        </motion.h1>
      </motion.div>
    </Slide>,

    <Slide key="s2">
      <motion.div {...fadeUp} className="text-center w-full max-w-5xl mx-auto pl-8">
        <h2 className="text-5xl md:text-7xl font-black text-[#6B6660] leading-tight mb-8 tracking-normal text-left">
          听了这么多奇迹，
        </h2>
        <p className="text-6xl md:text-[6.5rem] text-[#2D2A26] font-black tracking-normal text-left leading-[1.1] mt-4">
          终于轮到<br /><span className="text-[#D97706] whitespace-nowrap">怎么给您的公司开刀子了。</span>
        </p>
      </motion.div>
    </Slide>,

    <Slide key="s2_5" bg="white">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full text-center">
        <h2 className="text-5xl md:text-6xl font-black text-[#2D2A26] leading-tight mb-8 tracking-normal">
          5 分钟极限诊断
        </h2>
        <p className="text-2xl text-[#6B6660] leading-relaxed mt-4 mb-16">
          请在纸上写下，您公司目前<span className="font-bold text-[#D97706] border-b-4 border-[#D97706]">最大的 3 个利润出血点</span>。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
           {[
             { num: "01", example: "如：客服团队15人，每年开销150万，但还总被投诉回应慢。" },
             { num: "02", example: "如：销售一走就带走所有客户和话术，新人接不上盘。" },
             { num: "03", example: "如：每个月花3万块请外包代运营，ROI 几乎为零。" }
           ].map(item => (
             <div key={item.num} className="border border-[#E5E1D8] p-8 rounded-xl bg-[#FAF9F6] shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-[#D97706] opacity-[0.03] rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
               <div className="text-[#D97706] font-black text-2xl mb-4">{item.num}</div>
               <div className="border-b-2 border-dashed border-[#A3A3A3] mb-6 mt-8 h-8"></div>
               <div className="text-sm font-mono text-[#6B6660]">{item.example}</div>
             </div>
           ))}
        </div>
      </motion.div>
    </Slide>,

    <Slide key="s3">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <div className="flex gap-8 items-center mb-16">
          <GitPullRequest size={56} className="text-[#D97706]" />
          <h2 className="text-4xl font-black text-[#6B6660] tracking-wide uppercase">
            <span className="text-[#2D2A26]">重构流转 / </span> 3 步落地法
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {[
            { tag: "STEP 1", title: "测算耗损", subtitle: "锁定最废人的部门与薪资总额", icon: Search },
            { tag: "STEP 2", title: "植入硅基", subtitle: "用 AI 定制工具切片替代人工流向", icon: GitPullRequest },
            { tag: "STEP 3", title: "利润锁定", subtitle: "当月降低成本，拉高纯利", icon: LineChart },
          ].map((item, i) => (
             <motion.div key={item.title} {...d(0.1 + i * 0.15)}
              onClick={() => {
                const mapKeys: Record<string, string> = { "STEP 1": "step1", "STEP 2": "step2", "STEP 3": "step3" };
                const cur = mapKeys[item.tag];
                if(caseDetails[cur]) setModalContent(caseDetails[cur]);
              }}
              className="flex-1 bg-white border border-[#E5E1D8] hover:border-[#D97706] cursor-pointer transition-colors p-10 rounded-xl shadow-sm hover:shadow-md group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D97706] opacity-0 group-hover:opacity-5 rounded-full blur-3xl transition-opacity"></div>
                <div className="text-sm font-mono text-[#D97706] tracking-wide mb-8 font-bold">{item.tag}</div>
                <item.icon className="text-[#A3A3A3] group-hover:text-[#2D2A26] transition-colors mb-6" size={48} />
                <h3 className="text-4xl font-black text-[#2D2A26] tracking-normal mb-4">{item.title}</h3>
                <p className="text-lg text-[#6B6660]">{item.subtitle}</p>
             </motion.div>
          ))}
        </div>
      </motion.div>
    </Slide>,

    <Slide key="s3_roi" bg="#FAF9F6">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <h2 className="text-5xl font-black text-[#2D2A26] tracking-wide mb-12 text-center">
          不要看功能，看 <span className="text-[#D97706]">投资回报率 (ROI)</span>
        </h2>
        <div className="bg-white border border-[#E5E1D8] rounded-2xl p-10 shadow-lg flex flex-col md:flex-row gap-12 items-center">
           <div className="flex-1 space-y-8 w-full">
             <div>
               <div className="text-sm font-bold text-[#6B6660] mb-2 uppercase tracking-wide">原外包 / 低效人力开销</div>
               <div className="text-4xl font-mono text-[#2D2A26] border-b-2 border-[#E5E1D8] pb-2">¥ 350,000 / 年</div>
             </div>
             <div>
               <div className="text-sm font-bold text-[#D97706] mb-2 uppercase tracking-wide">预计 AI 硅基兵团替代比例</div>
               <div className="text-4xl font-mono text-[#D97706] font-black border-b-2 border-[#E5E1D8] pb-2">65%</div>
             </div>
           </div>
           <div className="flex-1 bg-[#F5F3EE] rounded-xl p-8 w-full border border-[#D97706]">
             <div className="text-sm font-bold text-[#6B6660] mb-4 uppercase tracking-wide text-center">推演第一年节省现金流直接转为纯利润：</div>
             <div className="text-6xl md:text-7xl font-black text-[#2D2A26] font-mono text-center mb-4">
               22.7 <span className="text-3xl">万元</span>
             </div>
             <div className="text-center text-sm text-[#A3A3A3] font-bold">这还不包含 AI 带来的人效增速、收入爆发！</div>
           </div>
        </div>
      </motion.div>
    </Slide>,

    // 【新增】高端定价服务页
    <Slide key="s_pricing" bg="linear-gradient(135deg, #1C1917 0%, #292420 100%)">
      <motion.div {...fadeUp} className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-[#FAF9F6] leading-tight tracking-normal">
            下一步：获取您的专属赋能方案
          </h2>
          <p className="text-xl text-[#9E9B96] mt-4">不是卖课，不是卖软件。我们提供深度的业务切割与赋能打包。</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
           {/* STEP 01 - 培训卡 */}
           <div className="border border-neutral-700/60 p-10 rounded-2xl bg-neutral-900/50 backdrop-blur shadow-2xl relative overflow-hidden flex flex-col">
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-neutral-100/5 to-transparent blur-md"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="inline-block bg-neutral-800 border border-neutral-700 text-neutral-300 text-sm font-bold px-4 py-1.5 rounded-full mb-6 w-max">STEP 01</div>
                <h3 className="text-3xl font-black text-white mb-6">企业主闭门实战特训</h3>
                
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-white">¥1,980</span>
                    <span className="text-neutral-500 font-mono text-lg">/ 席位</span>
                  </div>
                  <div className="text-[#D97706] font-bold mt-3 text-sm flex items-center gap-2">
                    ★ 第一期仅开放 30 席
                  </div>
                </div>

                <div className="border-t border-neutral-800 pt-6 mb-8 text-neutral-400 text-sm leading-relaxed">
                  两天一晚，高压输入。抛弃理论，直接拿着您企业的真实痛点进场，带走可落地的 AI SOP 改造方案。
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                   {[
                     "2026年AI前沿边界全景扫描",
                     "五大行业案例深度拆解",
                     "现场一对一痛点业务诊断",
                     "员工思想改造与落地法则"
                   ].map((li, i) => (
                     <li key={i} className="flex gap-3 text-neutral-300 items-start">
                       <CheckCircle2 size={18} className="text-[#D97706] mt-0.5 shrink-0" />
                       <span>{li}</span>
                     </li>
                   ))}
                </ul>
              </div>
           </div>

           {/* STEP 02 - 部署卡 */}
           <div className="border border-[#D97706]/40 p-10 rounded-2xl bg-gradient-to-b from-neutral-900/80 to-[#1A1612] backdrop-blur shadow-[0_0_40px_rgba(217,119,6,0.1)] relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D97706]/10 rounded-full blur-[80px]"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="inline-block bg-[#D97706] text-white text-sm font-bold px-4 py-1.5 rounded-full mb-6 w-max shadow-[0_0_15px_rgba(217,119,6,0.4)]">
                   STEP 02 : 深度定制
                </div>
                <h3 className="text-3xl font-black text-white mb-6">企业数字化深度内训与部署</h3>
                
                <div className="mb-8">
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-black text-white">¥40,000</span>
                    <span className="text-neutral-500 line-through font-mono text-lg">¥60,000</span>
                  </div>
                  <div className="text-[#D97706] font-bold mt-3 text-sm leading-relaxed">
                    ★ 早期体验价，仅限首批 5 家头部合作企业，之后将恢复至 ¥60,000 原价
                  </div>
                </div>

                <div className="border-t border-neutral-800 pt-6 mb-8 text-neutral-400 text-sm leading-relaxed">
                  不是卖课，也不是卖软件。我们提供直接下沉到您业务一线的 IDE 级定制化开发，和全员内训闭环交付。
                </div>

                <ul className="space-y-4 mb-4 flex-1">
                   {[
                     "企业知识库与数字资产梳理注入",
                     "部署百位数专属业务 Agent 集群",
                     "飞书/钉钉等管理工具的 CLI 无痛接入",
                     "全员实操落地内训，确保用得起来"
                   ].map((li, i) => (
                     <li key={i} className="flex gap-3 text-white items-start">
                       <ChevronRight size={18} className="text-[#D97706] mt-0.5 shrink-0" />
                       <span className="font-medium tracking-wide">{li}</span>
                     </li>
                   ))}
                </ul>
              </div>
           </div>
        </div>
      </motion.div>
    </Slide>,

    <Slide key="qa" bg="#FAF9F6">
      <motion.div {...fadeUp} className="text-center max-w-5xl mx-auto flex flex-col items-center cursor-pointer group" onClick={() => setModalContent(caseDetails["qa"])}>
        <MessageSquare size={100} className="text-[#E5E1D8] group-hover:text-[#D97706] transition-colors duration-500 mb-10" />
        <h2 className="text-[10rem] md:text-[14rem] font-black text-[#2D2A26] leading-tight tracking-normal mb-4 group-hover:scale-105 transition-transform duration-500">
          Q&A
        </h2>
        <p className="text-3xl text-[#6B6660] tracking-wide mt-8 font-mono">1v1 商业规划解局</p>
      </motion.div>
    </Slide>,

    <Slide key="closing" bg="white">
      <motion.div {...fadeUp} className="text-center w-full max-w-5xl mx-auto flex flex-col items-center justify-center">
        <h2 className="text-4xl md:text-[5rem] font-black text-[#2D2A26] leading-[1.3] tracking-normal mx-auto max-w-5xl text-left">
          “ 在 2026 年，<br />
          要么你<span className="text-[#D97706] border-b-[8px] pb-2 border-[#D97706]">改造</span><span className="whitespace-nowrap">你的企业，</span><br />
          要么你的同行用AI<span className="text-[#D97706] border-b-[8px] pb-2 border-[#D97706]">吞噬</span><span className="whitespace-nowrap">你。</span><br />
          没有中间选项。 ”
        </h2>
        <motion.p {...d(0.8)} className="text-xl text-[#9E9B96] tracking-widest mt-24 font-mono border-t border-[#E5E1D8] pt-8 uppercase font-bold">
          AI 造浪营 · 闭门会 · 收官
        </motion.p>
      </motion.div>
    </Slide>
  ];
}

export default function D2AfternoonSlides() {
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);

  return (
    <div className="bg-[#FAF9F6] relative w-screen h-screen overflow-hidden">
      <motion.div
        animate={{
          scale: modalContent ? 0.96 : 1,
          filter: modalContent ? "blur(12px)" : "blur(0px)",
          opacity: modalContent ? 0.5 : 1,
        }}
        transition={{ type: "spring" as const, damping: 25, stiffness: 150 }}
        className="origin-center w-full h-full"
      >
        <SlideEngine
          slides={allSlides(setModalContent)}
          title="AI造浪营"
          subtitle="D2下午 · 商业赋能与落地签约"
        />
      </motion.div>

      <CaseModal 
        isOpen={!!modalContent} 
        onClose={() => setModalContent(null)} 
        content={modalContent} 
      />
    </div>
  );
}
