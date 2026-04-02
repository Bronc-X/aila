"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SlideEngine, Slide } from "@/components/slides/SlideEngine";
import { CaseModal } from "@/components/slides/CaseModal";
import { caseDetails } from "./case-details";
import { Network, Megaphone, Coins, Blocks, Headphones } from "lucide-react";

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
    <Slide key="s1" bg="linear-gradient(135deg, #FAF9F6 0%, #F3F1ED 100%)">
      <div className="hero-glow" />
      <motion.div {...fadeUp} className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div {...d(0.1)} className="text-gray-400 font-mono tracking-wide uppercase text-sm mb-12">
          D2 SESSION I
        </motion.div>
        <motion.h1 {...d(0.3)} className="text-7xl md:text-[8rem] font-black leading-tight tracking-normal mb-10">
          <span className="text-[#2D2A26]">AI 工具</span>
          <br /><span className="text-gradient">全景实操</span>
        </motion.h1>
      </motion.div>
    </Slide>,

    <Slide key="s2">
      <motion.div {...fadeUp} className="text-center w-full max-w-5xl mx-auto pl-8">
        <h2 className="text-5xl md:text-7xl font-black text-[#2D2A26] leading-tight mb-8 tracking-normal text-left">
          理论到此为止。
        </h2>
        <p className="text-6xl md:text-[6.5rem] text-[#D97706] font-black tracking-normal text-left leading-[1.1] mt-4">
          今天只做一件事：<br />选定兵器，下场厮杀。
        </p>
      </motion.div>
    </Slide>,

    <Slide key="s2_5" bg="white">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full text-center">
        <h2 className="text-5xl md:text-6xl font-black text-[#2D2A26] leading-tight mb-8 tracking-normal">
          “可是，我的员工学不会怎么办？”
        </h2>
        <p className="text-3xl text-[#6B6660] leading-relaxed mt-10 max-w-4xl mx-auto">
          接下来要展示的 6 大工具，不需要任何编程背景。<br />
          <span className="font-bold text-[#D97706]">如果他们会用微信聊天，他们就能用这些工具。</span>
        </p>
        <div className="grid grid-cols-3 gap-12 mt-16 text-left">
           <div className="border border-[#E5E1D8] p-12 rounded-xl bg-[#FAF9F6] shadow-sm">
             <div className="text-3xl mb-4">👩‍💼</div>
             <div className="font-bold text-xl text-[#2D2A26]">前台行政老师</div>
             <div className="text-[#6B6660] mt-2">→ 变身“多语种海外接待”</div>
           </div>
           <div className="border border-[#E5E1D8] p-12 rounded-xl bg-[#FAF9F6] shadow-sm">
             <div className="text-3xl mb-4">👩‍💻</div>
             <div className="font-bold text-xl text-[#2D2A26]">初级运营专员</div>
             <div className="text-[#6B6660] mt-2">→ 变身“全栈文案与海报中台”</div>
           </div>
           <div className="border border-[#E5E1D8] p-12 rounded-xl bg-[#FAF9F6] shadow-sm">
             <div className="text-3xl mb-4">👨‍💼</div>
             <div className="font-bold text-xl text-[#2D2A26]">数据汇总出纳</div>
             <div className="text-[#6B6660] mt-2">→ 变身“BI 商业分析师”</div>
           </div>
        </div>
      </motion.div>
    </Slide>,

    <Slide key="s3">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <div className="flex gap-8 items-center mb-16">
          <Network size={56} className="text-[#9E9B96]" />
          <h2 className="text-4xl font-black text-[#6B6660] tracking-wide uppercase">
            <span className="text-[#2D2A26]">2026 杀手级企业工具</span> / THE MAP
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { tag: "MARKETING", title: "获客引擎", icon: Megaphone, key: "marketing" },
            { tag: "SALES", title: "销售转化", icon: Coins, key: "sales" },
            { tag: "OPS", title: "运营中枢", icon: Blocks, key: "ops" },
            { tag: "SERVICE", title: "无休客服", icon: Headphones, key: "service" },
          ].map((item, i) => (
             <motion.div key={item.title} {...d(0.15 + i * 0.1)}
              onClick={() => {
                if(caseDetails[item.key]) setModalContent(caseDetails[item.key]);
              }}
              className="bg-white border border-[#E5E1D8] hover:border-[#D97706] cursor-pointer transition-colors p-8 rounded-xl flex flex-col justify-between aspect-square group shadow-sm hover:shadow-md">
                <div>
                  <div className="text-xs font-mono text-[var(--text-muted)] tracking-wide mb-4">{item.tag}</div>
                  <item.icon className="text-[#9E9B96] group-hover:text-[var(--brand-glow)] transition-colors mb-6" size={40} />
                </div>
                <h3 className="text-3xl font-black text-[#2D2A26] tracking-normal">{item.title}</h3>
             </motion.div>
          ))}
        </div>
      </motion.div>
    </Slide>,

    <Slide key="s4">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-[#D97706] tracking-wide uppercase mb-4">01 MARKETING ENGINE</h3>
          <h2 className="text-6xl md:text-7xl font-black text-[#2D2A26] leading-[1.1] tracking-normal mb-8">千篇一律<br />不如<span className="text-[#D97706]">千人千面</span></h2>
          <p className="text-xl text-[#6B6660] leading-relaxed mb-8">
            扔掉低效的公关写手。利用 Coze / Dify 搭建带联网搜索的大模型 Agent。一条指令，矩阵式生成 100 个契合小红书、抖音、独立站风格的爆款物料。
          </p>
          <div className="bg-white border border-[#E5E1D8] p-5 rounded-xl flex justify-between items-center relative overflow-hidden">
             <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#D97706]"></div>
             <div className="pl-4">
               <div className="text-sm text-[#9E9B96] uppercase tracking-wide font-bold mb-1">人工手写 vs AI 生成</div>
               <div className="text-[#2D2A26] font-medium"><span className="line-through text-gray-400 mr-2">单篇 45 分钟</span><span className="text-[#D97706] font-bold text-xl">1 篇 / 15 秒</span></div>
             </div>
          </div>
        </div>
        <div className="flex-1 border-l border-[#E5E1D8] pl-16 py-8">
           <div className="text-[10rem] font-black text-[#2D2A26] leading-tight tracking-normal opacity-90 mb-4 hover:opacity-100 transition-opacity cursor-pointer duration-300" onClick={() => setModalContent(caseDetails["marketing"])}>100<span className="text-5xl text-[#D97706]">x</span></div>
           <p className="font-mono text-[#9E9B96] tracking-wide uppercase">Content Matrix Multiplier</p>
           <p className="text-xs text-[#A3A3A3] mt-2 font-mono">📍 数据来源: AILA 实测企业数据库 (2025 Q4)</p>
        </div>
      </motion.div>
    </Slide>,

    <Slide key="s5">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 border-r border-[#E5E1D8] pr-16 py-8 text-right cursor-pointer" onClick={() => setModalContent(caseDetails["sales"])}>
           <div className="text-[10rem] font-black text-[#2D2A26] leading-tight tracking-normal opacity-90 mb-4 hover:opacity-100 transition-opacity duration-300">2<span className="text-5xl text-[#D97706]">MIN</span></div>
           <p className="font-mono text-[#9E9B96] tracking-wide uppercase">代替 30 分钟 CRM 录入</p>
           <p className="text-xs text-[#A3A3A3] mt-2 font-mono">📍 数据来源: HubSpot AI 销售效能报告</p>
        </div>
        <div className="flex-1 pl-4">
          <h3 className="text-2xl font-bold text-[#D97706] tracking-wide uppercase mb-4">02 SALES & FOLLOW-UP</h3>
          <h2 className="text-5xl md:text-6xl font-black text-[#2D2A26] leading-tight mb-8 tracking-normal">
            你销售的瓶颈，<br />全在 CRM 录入上。
          </h2>
          <p className="text-xl text-[#6B6660] leading-relaxed mb-8">
            让销售专注与客户面谈 40 分钟，剩余的脏活丢给 AI。自动提炼会议纪要、生成客户画像剖析、评估成单概率，并自动撰写全网群发逼单邮件。
          </p>
          <div className="bg-white border border-[#E5E1D8] p-5 rounded-xl flex justify-between items-center relative overflow-hidden">
             <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#D97706]"></div>
             <div className="pl-4">
               <div className="text-sm text-[#9E9B96] uppercase tracking-wide font-bold mb-1">销售有效沟通时长占比</div>
               <div className="text-[#2D2A26] font-medium"><span className="line-through text-gray-400 mr-2">原先 35%</span><span className="text-[#D97706] font-bold text-xl">飙升至 80%</span></div>
             </div>
          </div>
        </div>
      </motion.div>
    </Slide>,

    <Slide key="s6">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-[#D97706] tracking-wide uppercase mb-4">03 OPERATIONS</h3>
          <h2 className="text-6xl md:text-7xl font-black text-[#2D2A26] leading-[1.1] tracking-normal mb-8">告别表哥表姐。<br />用 <span className="text-[#D97706]">Prompt 算账</span>。</h2>
          <p className="text-xl text-[#6B6660] leading-relaxed mb-8">
            企业经营报表无需层层人工汇总。直接丢上传原数据 CSV 至 Code Interpreter。一句“找出季度毛利跌幅最大的品类并完成归因”，3秒内为您吐出高管级财务洞察。
          </p>
          <div className="bg-white border border-[#E5E1D8] p-5 rounded-xl flex justify-between items-center relative overflow-hidden">
             <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#D97706]"></div>
             <div className="pl-4">
               <div className="text-sm text-[#9E9B96] uppercase tracking-wide font-bold mb-1">报表制作与归因分析</div>
               <div className="text-[#2D2A26] font-medium"><span className="line-through text-gray-400 mr-2">周报 2 天</span><span className="text-[#D97706] font-bold text-xl">3 秒即时出图</span></div>
             </div>
          </div>
        </div>
        <div className="flex-1 border-l border-[#E5E1D8] pl-16 py-8 cursor-pointer" onClick={() => setModalContent(caseDetails["ops"])}>
           <div className="text-[10rem] font-black text-[#2D2A26] leading-tight tracking-normal opacity-90 mb-4 hover:opacity-100 transition-opacity duration-300">0<span className="text-5xl text-[#D97706]">.</span>1</div>
           <p className="font-mono text-[#9E9B96] tracking-wide uppercase">秒级图表生成与病灶诊断</p>
           <p className="text-xs text-[#A3A3A3] mt-2 font-mono">📍 数据来源: AILA 测试基准</p>
        </div>
      </motion.div>
    </Slide>,

    <Slide key="s7_service" bg="white">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 border-r border-[#E5E1D8] pr-16 py-8 text-right">
           <div className="text-[10rem] font-black text-[#2D2A26] leading-tight tracking-normal opacity-90 mb-4 hover:opacity-100 transition-opacity duration-300">24<span className="text-5xl text-[#D97706]">/7</span></div>
           <p className="font-mono text-[#9E9B96] tracking-wide uppercase">全年无休专家级响应</p>
           <p className="text-xs text-[#A3A3A3] mt-2 font-mono">📍 数据来源: RAG 知识库客户部署验证</p>
        </div>
        <div className="flex-1 pl-4">
          <h3 className="text-2xl font-bold text-[#D97706] tracking-wide uppercase mb-4">04 SERVICE & KNOWLEDGE</h3>
          <h2 className="text-5xl md:text-6xl font-black text-[#2D2A26] leading-tight mb-8 tracking-normal">
            打破人脑瓶颈，<br />构建企业“维基百科”。
          </h2>
          <p className="text-xl text-[#6B6660] leading-relaxed mb-8">
            售后疑难杂症、冗长法务条文不用再找“老师傅”。部署私有化知识库 (RAG)，让 AI 阅读 1000 份 PDF 手册，并对外提供专家级别的精准对答。
          </p>
          <div className="bg-[#FAF9F6] border border-[#E5E1D8] p-5 rounded-xl flex justify-between items-center relative overflow-hidden">
             <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#D97706]"></div>
             <div className="pl-4">
               <div className="text-sm text-[#9E9B96] uppercase tracking-wide font-bold mb-1">员工培训与上手周期</div>
               <div className="text-[#2D2A26] font-medium"><span className="line-through text-gray-400 mr-2">师徒带教 3 个月</span><span className="text-[#D97706] font-bold text-xl">零培训即刻上岗</span></div>
             </div>
          </div>
        </div>
      </motion.div>
    </Slide>,

    <Slide key="s8_live_demo">
      <motion.div {...fadeUp} className="text-center w-full max-w-5xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-black text-[#2D2A26] leading-tight mb-8 tracking-normal">
          接下来，<br />打开我们的控制台。
        </h2>
        <p className="text-3xl text-[#6B6660] leading-relaxed mt-10 max-w-4xl mx-auto">
          我将给大家<span className="font-bold text-[#D97706]">直接下发 6 大工具包接口</span>。<br />
          今天上午的剩余时间，请各位在手机或电脑上亲自体验 AI 的业务重构力。
        </p>
      </motion.div>
    </Slide>,
  ];
}

export default function D2MorningSlides() {
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
          subtitle="D2上午 · 工具实操"
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
