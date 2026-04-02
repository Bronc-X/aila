"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SlideEngine, Slide } from "@/components/slides/SlideEngine";
import { CaseModal } from "@/components/slides/CaseModal";
import { caseDetails } from "./case-details";
import { GitPullRequest, Search, LineChart, MessageSquare } from "lucide-react";

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
          <br /><span className="text-[#444]">{"& 1v1 解局"}</span>
        </motion.h1>
      </motion.div>
    </Slide>,

    <Slide key="s2">
      <motion.div {...fadeUp} className="text-center w-full max-w-5xl mx-auto pl-8">
        <h2 className="text-5xl md:text-7xl font-black text-[#6B6660] leading-tight mb-8 tracking-normal text-left">
          听了这么多奇迹，
        </h2>
        <p className="text-6xl md:text-[6.5rem] text-[#2D2A26] font-black tracking-normal text-left leading-[1.1] mt-4">
          终于轮到<br /><span className="text-[#D97706]">你自己的公司了</span>。
        </p>
      </motion.div>
    </Slide>,

    <Slide key="s2_5" bg="white">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full text-center">
        <h2 className="text-5xl md:text-6xl font-black text-[#2D2A26] leading-tight mb-8 tracking-normal">
          5 分钟极速诊断
        </h2>
        <p className="text-2xl text-[#6B6660] leading-relaxed mt-4 mb-16">
          请各位在纸上写下，您公司目前<span className="font-bold text-[#D97706]">“最烧钱、最拖沓”</span>的 3 个具体业务环节。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
           {[1, 2, 3].map(num => (
             <div key={num} className="border border-[#E5E1D8] p-8 rounded-xl bg-[#FAF9F6] shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-[#D97706] opacity-[0.03] rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
               <div className="text-[#D97706] font-black text-2xl mb-4">0{num}</div>
               <div className="border-b-2 border-dashed border-[#A3A3A3] mb-6 mt-8 h-8"></div>
               <div className="text-sm font-mono text-[#9E9B96] uppercase">如：每个月花 2 万外包写小红书流水账</div>
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
            <span className="text-[#2D2A26]">现场解剖 / </span> 3 步构建法
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {[
            { tag: "STEP 1", title: "找痛点", subtitle: "锚定最厚重的环节", icon: Search },
            { tag: "STEP 2", title: "画图纸", subtitle: "AI 替代人工流向", icon: GitPullRequest },
            { tag: "STEP 3", title: "算笔账", subtitle: "推演重构后的 ROI", icon: LineChart },
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
          ROI (投资回报率) 推演模型
        </h2>
        <div className="bg-white border border-[#E5E1D8] rounded-2xl p-10 shadow-lg flex flex-col md:flex-row gap-12 items-center">
           <div className="flex-1 space-y-8 w-full">
             <div>
               <div className="text-sm font-bold text-[#6B6660] mb-2 uppercase tracking-wide">原外包/人力年开销</div>
               <div className="text-4xl font-mono text-[#2D2A26] border-b-2 border-[#E5E1D8] pb-2">¥ 350,000</div>
             </div>
             <div>
               <div className="text-sm font-bold text-[#6B6660] mb-2 uppercase tracking-wide">预计 AI 替代比例</div>
               <div className="text-4xl font-mono text-[#2D2A26] border-b-2 border-[#E5E1D8] pb-2 text-[#D97706]">65%</div>
             </div>
           </div>
           <div className="flex-1 bg-[#F5F3EE] rounded-xl p-8 w-full border border-[#E5E1D8]">
             <div className="text-sm font-bold text-[#6B6660] mb-4 uppercase tracking-wide text-center">推演第一年纯利润增量</div>
             <div className="text-6xl md:text-7xl font-black text-[#2D2A26] font-mono text-center mb-4">
               22.7 <span className="text-3xl">W</span>
             </div>
             <div className="text-center text-sm text-[#A3A3A3]">不包含业务增效带来的间接收入</div>
           </div>
        </div>
      </motion.div>
    </Slide>,

    <Slide key="pre_qa" bg="white">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <h2 className="text-5xl font-black text-[#2D2A26] tracking-wide mb-16 text-center">
          下一步：让 AI 真正在您的公司跑起来。
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-[#FAF9F6] border border-[#E5E1D8] p-10 rounded-xl">
             <h3 className="text-3xl font-bold text-[#2D2A26] mb-4 border-l-4 border-[#D97706] pl-4">定制化高管内训</h3>
             <p className="text-xl text-[#6B6660] leading-relaxed">带着您的核心高管团队，我们提供闭门 1v1 的业务流拆解，将今天的理论直接转化为下周的执行表。</p>
           </div>
           <div className="bg-[#FAF9F6] border border-[#E5E1D8] p-10 rounded-xl">
             <h3 className="text-3xl font-bold text-[#2D2A26] mb-4 border-l-4 border-[#D97706] pl-4">私有智能体交付</h3>
             <p className="text-xl text-[#6B6660] leading-relaxed">不需要您有开发团队。我们将为您全包搭建企业专属的私有知识库、销售外脑与营销自动化剧本。</p>
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
        <p className="text-3xl text-[#6B6660] tracking-wide mt-8 font-mono">1v1 SESSION</p>
      </motion.div>
    </Slide>,

    <Slide key="closing" bg="white">
      <motion.div {...fadeUp} className="text-center w-full max-w-5xl mx-auto flex flex-col items-center justify-center">
        <h2 className="text-5xl md:text-[5.5rem] font-black text-[#2D2A26] leading-[1.3] tracking-normal mx-auto max-w-5xl text-left font-sans">
          “ 不要为了用 AI 而用 AI。<br />
          让 AI 帮你做完脏活，<br />
          <span className="text-[#D97706]">去夺回属于企业家的<br />自由与生活。 </span>”
        </h2>
        <motion.p {...d(0.8)} className="text-xl text-[#9E9B96] tracking-widest mt-20 font-mono border-t border-[#E5E1D8] pt-8 uppercase">
          AI 造浪营 · SEASON I · 正式结业
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
          subtitle="D2下午 · 闭门工作坊与结营"
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
