"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SlideEngine, Slide } from "@/components/slides/SlideEngine";
import { CaseModal } from "@/components/slides/CaseModal";
import { caseDetails } from "./case-details";
import { Factory, PackageOpen, Server, PlayCircle, PauseCircle, Film, Code2 } from "lucide-react";

/* ============================================
   动画工具
   ============================================ */
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

/* ============================================
   组件：动态时钟幻灯片
   ============================================ */
function TimerSlide({ setModalContent }: { setModalContent: (content: React.ReactNode) => void }) {
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45分钟
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRunning(!isRunning);
  };

  const m = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const s = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <Slide key="timer">
      <motion.div {...fadeUp} className="text-center max-w-5xl mx-auto">
        <h2 
          className="text-[12rem] md:text-[18rem] font-black text-gradient leading-tight tracking-normal mb-8 font-mono cursor-pointer hover:scale-105 transition-transform duration-500"
          onClick={() => setModalContent(caseDetails["live-coding"])}
        >
          {m}:{s}
        </h2>
        <div 
          onClick={toggleTimer}
          className="flex justify-center items-center gap-8 text-[var(--text-secondary)] hover:text-[#2D2A26] transition-colors duration-500 cursor-pointer p-8 rounded-xl border border-transparent hover:border-[var(--brand-primary)] hover:bg-[rgba(255,255,255,0.03)] w-max mx-auto group"
        >
          {isRunning ? <PauseCircle size={28} className="text-red-400 group-hover:text-red-300" /> : <PlayCircle size={28} className="text-green-400 group-hover:text-green-300" />}
          <span className="text-2xl font-bold tracking-wide uppercase">
            {isRunning ? "PAUSING" : "PRESS TO DEPLOY (45 MINS)"}
          </span>
        </div>
      </motion.div>
    </Slide>
  );
}

/* ============================================
   主幻灯片矩阵
   ============================================ */
function allSlides(setModalContent: (content: React.ReactNode) => void) {
  return [
    // S1: 封面
    <Slide key="s1" bg="linear-gradient(135deg, #FAF9F6 0%, #F3F1ED 100%)">
      <div className="hero-glow" />
      <motion.div {...fadeUp} className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div {...d(0.1)} className="text-gray-400 font-mono tracking-wide uppercase text-sm mb-12">
          D1 SESSION II
        </motion.div>
        <motion.h1 {...d(0.3)} className="text-7xl md:text-[8rem] font-black leading-tight tracking-normal mb-10">
          <span className="text-[#2D2A26]">行业渗透</span>
          <br /><span className="text-gradient">{"& Live Coding"}</span>
        </motion.h1>
      </motion.div>
    </Slide>,

    // S2: 观念震撼
    <Slide key="s2">
      <motion.div {...fadeUp} className="text-center w-full max-w-5xl mx-auto pl-8">
        <h2 className="text-5xl md:text-7xl font-black text-[#2D2A26] leading-tight mb-8 tracking-normal text-left">
          你以为AI还在“写文章”？
        </h2>
        <p className="text-6xl md:text-[6.5rem] text-[#D97706] font-black tracking-normal text-left leading-[1.1] mt-4">
          它已经真正潜入了<br />产业链的核心血管。
        </p>
      </motion.div>
    </Slide>,

    // S2.5: 紧迫感锚定
    <Slide key="s2_5" bg="white">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <div className="flex gap-8 items-center mb-10">
          <div className="w-16 h-1 bg-[#D97706]"></div>
          <h2 className="text-4xl font-black text-[#2D2A26] tracking-wide uppercase">
            不要被媒体的热搜欺骗
          </h2>
        </div>
        <p className="text-4xl text-[#6B6660] font-medium leading-[1.6] tracking-wide">
          当你在短视频里看别人用 AI 生成搞笑视频时，
          <span className="text-[#2D2A26] font-bold block mt-4 text-5xl">
            你的竞争对手，正在利用企业级自动化矩阵，
            悄无声息地<span className="text-[#D97706]">缩减 40% 的刚性人力成本</span>。
          </span>
        </p>
      </motion.div>
    </Slide>,

    // S3: 工业制造 深钻
    <Slide key="s3">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <div className="flex gap-8 items-center mb-8">
          <Factory size={56} className="text-[#9E9B96]" />
          <h2 className="text-4xl font-black text-[#666] tracking-wide uppercase">
            <span className="text-[#2D2A26]">工业制造</span> / 绝密引擎
          </h2>
        </div>
        <div className="border-t border-[#E5E1D8] pt-12 grid grid-cols-1 md:grid-cols-2 gap-12 cursor-pointer group" onClick={() => setModalContent(caseDetails["manufacturing"])}>
           <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 flex items-center justify-center">
              <img src="/cases/industry_manufacturing_1775101754129.png" alt="Industrial CV" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute bottom-6 left-6 right-6">
                 <h4 className="text-2xl font-bold text-white mb-2 shadow-sm drop-shadow-md">大模型 + 工业机器视觉</h4>
                 <p className="text-[#D97706] font-mono tracking-wider drop-shadow-md font-bold">0 情绪 | 24H 不停机 | 亚秒级判卷</p>
              </div>
           </div>
           <div className="flex flex-col justify-center">
              <p className="text-[var(--text-secondary)] text-xl leading-relaxed mb-6">传统电池产线瑕疵检测极度依赖人眼，老手在 8 小时轮班后也会面临视疲劳。部署专用检测流后：</p>
              <div className="bg-white border border-[#E5E1D8] p-12 rounded-xl shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="text-gray-500">检测准确率</span>
                  <span className="text-2xl font-bold text-[#2D2A26]">99.8% <span className="text-sm text-green-600">↑3%</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">人力成本节省</span>
                  <span className="text-3xl font-black text-[#D97706]">¥ 850,000 / 年</span>
                </div>
              </div>
           </div>
        </div>
      </motion.div>
    </Slide>,

    // S4: 跨境出海 深钻
    <Slide key="s4">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <div className="flex gap-8 items-center mb-8">
          <PackageOpen size={56} className="text-[#9E9B96]" />
          <h2 className="text-4xl font-black text-[#666] tracking-wide uppercase">
            <span className="text-[#2D2A26]">跨境出海</span> / 无界分身
          </h2>
        </div>
        <div className="border-t border-[#E5E1D8] pt-12 grid grid-cols-1 md:grid-cols-2 gap-12 cursor-pointer group" onClick={() => setModalContent(caseDetails["retail"])}>
           <div className="flex flex-col justify-center">
              <p className="text-[var(--text-secondary)] text-xl leading-relaxed mb-6">从选品抓取、竞对打分，到英语/阿语商用级文案，再到平台自投。原先需要由 5 位高薪人才用两周磨出的业务闭环，现在只需一个 Agent。</p>
              <div className="bg-white border border-[#E5E1D8] p-12 rounded-xl shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="text-gray-500">新品全球开城周期</span>
                  <span className="text-2xl font-bold text-[#2D2A26]">0.5 天 <span className="text-sm text-green-600">↓13.5天</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">外籍文案替换</span>
                  <span className="text-3xl font-black text-[#D97706]">省下 3 个人头头数</span>
                </div>
              </div>
           </div>
           <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 flex items-center justify-center">
              <img src="/cases/ecommerce_dashboard_1775101771068.png" alt="Ecommerce Analytics" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute bottom-6 left-6 right-6">
                 <h4 className="text-2xl font-bold text-white mb-2 shadow-sm drop-shadow-md">多模态 Agent 工作流</h4>
                 <p className="text-[#D97706] font-mono tracking-wider drop-shadow-md font-bold">选品 → 翻译 → 生成 → 投放全串联</p>
              </div>
           </div>
        </div>
      </motion.div>
    </Slide>,

    // S5: 泛服务业 深钻
    <Slide key="s5">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <div className="flex gap-8 items-center mb-8">
          <Server size={56} className="text-[#9E9B96]" />
          <h2 className="text-4xl font-black text-[#666] tracking-wide uppercase">
            <span className="text-[#2D2A26]">泛服务业</span> / 知识平权
          </h2>
        </div>
        <div className="border-t border-[#E5E1D8] pt-12 grid grid-cols-1 md:grid-cols-2 gap-12 cursor-pointer group" onClick={() => setModalContent(caseDetails["service"])}>
           <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 flex items-center justify-center">
              <img src="/cases/service_knowledge_1775101783025.png" alt="Knowledge Base Assistant" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
              <div className="absolute bottom-6 left-6 right-6">
                 <h4 className="text-2xl font-bold text-white mb-2 shadow-sm drop-shadow-md">企业私有大脑 (RAG)</h4>
                 <p className="text-[#D97706] font-mono tracking-wider drop-shadow-md font-bold">吸尽核心数据 | 无限分身解答</p>
              </div>
           </div>
           <div className="flex flex-col justify-center">
              <p className="text-[var(--text-secondary)] text-xl leading-relaxed mb-6">律所、财税、售后支持常年困于“老骨干留不住，新兵教不会”。通过将 10 年业务档案全部喂给大模型构建的私域大脑，打破了能力垄断。</p>
              <div className="bg-white border border-[#E5E1D8] p-12 rounded-xl shadow-sm space-y-4">
                 <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="text-gray-500">新人培养周期</span>
                  <span className="text-2xl font-bold text-[#2D2A26]">3 天 <span className="text-sm text-green-600">↓ 原本3个月</span></span>
                 </div>
                 <div className="flex justify-between items-center">
                  <span className="text-gray-500">客户承接力</span>
                  <span className="text-3xl font-black text-[#D97706]">提升 400%</span>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    </Slide>,

    // S6: 娱乐传媒 深钻
    <Slide key="s6">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <div className="flex gap-8 items-center mb-8">
          <Film size={56} className="text-[#9E9B96]" />
          <h2 className="text-4xl font-black text-[#666] tracking-wide uppercase">
            <span className="text-[#2D2A26]">内容传媒</span> / 工业流水线
          </h2>
        </div>
        <div className="border-t border-[#E5E1D8] pt-12 grid grid-cols-1 md:grid-cols-2 gap-12 cursor-pointer group" onClick={() => setModalContent(caseDetails["media"])}>
           <div className="flex flex-col justify-center">
              <p className="text-[var(--text-secondary)] text-xl leading-relaxed mb-6">长尾账号极耗资金，剪辑师、画手薪资见涨，稍不留神就被流量反噬。现在的打法是利用 AI 视频与生图，单日裂变千条符合平台算法的带货切片。</p>
              <div className="bg-white border border-[#E5E1D8] p-12 rounded-xl shadow-sm space-y-4">
                 <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="text-gray-500">外包摄制费用</span>
                  <span className="text-2xl font-bold text-[#2D2A26]">¥ 0 <span className="text-sm text-green-600">彻底归零</span></span>
                 </div>
                 <div className="flex justify-between items-center">
                  <span className="text-gray-500">矩阵裂变基数</span>
                  <span className="text-3xl font-black text-[#D97706]">100x 放大</span>
                 </div>
              </div>
           </div>
           <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 flex items-center justify-center">
              <img src="/cases/media_creator_1775101804245.png" alt="Media Factory" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute bottom-6 left-6 right-6">
                 <h4 className="text-2xl font-bold text-white mb-2 shadow-sm drop-shadow-md">音视频工业流水线</h4>
                 <p className="text-[#D97706] font-mono tracking-wider drop-shadow-md font-bold">克隆分身 | 批量搬运再创作</p>
              </div>
           </div>
        </div>
      </motion.div>
    </Slide>,

    // S6.5: 击破技术恐惧
    <Slide key="s6_5" bg="white">
      <motion.div {...fadeUp} className="text-center w-full max-w-5xl mx-auto pl-8">
        <h2 className="text-5xl md:text-7xl font-black text-[#2D2A26] leading-tight mb-8 tracking-normal">
          “我不懂代码，是不是没戏了？”
        </h2>
        <p className="text-4xl text-[#D97706] font-bold tracking-wide mt-10">
          这是 2026 年最大的谎言。
        </p>
        <p className="text-2xl text-[#6B6660] leading-relaxed mt-8 max-w-3xl mx-auto">
          AI 工具早已完成了平民化革命。通过 Flow 和自然语言编排，
          你不需要会写一行代码，只需要知道<span className="font-bold text-[#2D2A26]">“你的业务卡在哪里”</span>。这正是企业主最大的优势：懂业务。
        </p>
      </motion.div>
    </Slide>,

    // S6.8: 收获预期
    <Slide key="s6_8">
      <motion.div {...fadeUp} className="max-w-4xl mx-auto w-full">
        <h2 className="text-4xl font-black text-[#2D2A26] tracking-wide mb-12 text-center">
          经过这 2 天，你将带走什么？
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { tag: "01 PLAN", title: "一份私有诊断", desc: "摸清你企业利润正在流失的三大出血点。" },
            { tag: "02 TOOL", title: "一套现成工具库", desc: "6 套开箱即用的 AI 提效界面，直接拨给员工用。" },
            { tag: "03 ACTION", title: "一个降本时间表", desc: "明确在接下来的 30 天内，要砍掉哪三个外包和岗位。" },
          ].map(b => (
            <div key={b.tag} className="bg-white border border-[#E5E1D8] p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
               <div className="text-sm font-bold text-[#D97706] mb-2">{b.tag}</div>
               <h3 className="text-2xl font-bold text-[#2D2A26] mb-4">{b.title}</h3>
               <p className="text-[#6B6660] leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </Slide>,

    // S7: Live Coding 引入页
    <Slide key="lk" bg="#FAF9F6">
      <motion.div {...fadeUp} className="text-center w-full">
        <motion.div {...d(0.1)} className="text-[var(--brand-glow)] font-mono tracking-wide uppercase text-sm mb-12">
           THE ULTIMATE PROOF
        </motion.div>
        <h2 className="text-[7rem] md:text-[9rem] font-black text-[#2D2A26] leading-[1.1] mb-10 tracking-normal">
          实战推演 <span className="text-[#D97706]">部署</span>
        </h2>
        <motion.p {...d(0.5)} className="text-3xl text-[#6B6660] tracking-normal leading-relaxed">
          接下来的 45 分钟，没有枯燥的 PPT。<br />
          我将打开实战控制台，<span className="font-bold text-[#2D2A26]">从 0 到 1 现场向各位企业家演示</span><br />
          如何搭建一条帮核心业务节省 <span className="text-[#D97706]">50% 运转成本</span> 的自动化流水线。
        </motion.p>
      </motion.div>
    </Slide>,
    
    // S8: 45分钟倒计时页
    <TimerSlide key="timer_module" setModalContent={setModalContent} />
  ];
}

/* ============================================
   页面根组件：携带推送动画
   ============================================ */
export default function D1AfternoonSlides() {
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
          subtitle="D1下午 · 行业案例体验与 45 分钟实录构建"
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
