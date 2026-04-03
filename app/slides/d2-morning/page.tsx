"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SlideEngine, Slide } from "@/components/slides/SlideEngine";
import { CaseModal } from "@/components/slides/CaseModal";
import { caseDetails } from "./case-details";
import { 
  Network, Megaphone, Coins, Blocks, Headphones, 
  ShoppingCart, Briefcase, Zap, Search 
} from "lucide-react";

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
        <motion.div {...d(0.1)} className="text-[#D97706] font-mono tracking-wide uppercase text-sm mb-12">
          D2 SESSION I
        </motion.div>
        <motion.h1 {...d(0.3)} className="text-7xl md:text-[8rem] font-black leading-tight tracking-normal mb-10">
          <span className="text-[#2D2A26]">硅基员工</span>
          <br /><span className="text-gradient">全景阅兵</span>
        </motion.h1>
      </motion.div>
    </Slide>,

    <Slide key="s2">
      <motion.div {...fadeUp} className="text-center w-full max-w-5xl mx-auto pl-8">
        <h2 className="text-5xl md:text-7xl font-black text-[#2D2A26] leading-tight mb-8 tracking-normal text-left">
          理论到此为止。
        </h2>
        <p className="text-6xl md:text-[6.5rem] text-[#D97706] font-black tracking-normal text-left leading-[1.1] mt-4">
          今天只做一件事：<br /><span className="whitespace-nowrap">选定兵器，下场厮杀。</span>
        </p>
      </motion.div>
    </Slide>,

    <Slide key="s2_5" bg="white">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full text-center">
        <h2 className="text-5xl md:text-6xl font-black text-[#2D2A26] leading-tight mb-8 tracking-normal">
          “可是，上新系统，员工学不会<span className="whitespace-nowrap">怎么办？”</span>
        </h2>
        <p className="text-3xl text-[#6B6660] leading-relaxed mt-10 max-w-4xl mx-auto">
          接下来展示的工具，<span className="font-bold border-b-4 border-[#D97706]">不需要任何培训和改变习惯</span>。<br />
          因为它们全都能长在微信、飞书、钉钉里。<br />
          <span className="font-bold text-[#D97706]">员工只会觉得自己加了一个“神仙同事”。</span>
        </p>
        <div className="grid grid-cols-3 gap-12 mt-16 text-left">
           <div className="border border-[#E5E1D8] p-12 rounded-xl bg-[#FAF9F6] shadow-sm">
             <div className="text-3xl mb-4">👩‍💼</div>
             <div className="font-bold text-xl text-[#2D2A26]">前台行政老师</div>
             <div className="text-[#6B6660] mt-2">→ 变身“海外客户接待大使”</div>
           </div>
           <div className="border border-[#E5E1D8] p-12 rounded-xl bg-[#FAF9F6] shadow-sm">
             <div className="text-3xl mb-4">👩‍💻</div>
             <div className="font-bold text-xl text-[#2D2A26]">初级设计/运营</div>
             <div className="text-[#6B6660] mt-2">→ 变身“全栈素材与传播中台”</div>
           </div>
           <div className="border border-[#E5E1D8] p-12 rounded-xl bg-[#FAF9F6] shadow-sm">
             <div className="text-3xl mb-4">👨‍💼</div>
             <div className="font-bold text-xl text-[#2D2A26]">数据/财务出纳</div>
             <div className="text-[#6B6660] mt-2">→ 变身“BI 商业数据分析师”</div>
           </div>
        </div>
      </motion.div>
    </Slide>,

    <Slide key="s3">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <div className="flex gap-8 items-center mb-16">
          <Network size={56} className="text-[#9E9B96]" />
          <h2 className="text-4xl font-black text-[#6B6660] tracking-wide uppercase">
            <span className="text-[#2D2A26]">六大降本提效引擎</span> / THE MAP
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {[
            { tag: "01", title: "AI 获客引擎", icon: Megaphone, key: "marketing" },
            { tag: "02", title: "AI 销售军师", icon: Coins, key: "sales" },
            { tag: "03", title: "AI 客服管家", icon: Headphones, key: "service" },
            { tag: "04", title: "AI 运营看板", icon: Blocks, key: "ops" },
            { tag: "05", title: "AI 寻源采购", icon: ShoppingCart, key: "supply" },
            { tag: "06", title: "AI 协同中枢", icon: Briefcase, key: "admin" },
          ].map((item, i) => (
             <motion.div key={item.title} {...d(0.15 + i * 0.1)}
              onClick={() => {
                if(caseDetails[item.key]) setModalContent(caseDetails[item.key]);
              }}
              className="bg-white border border-[#E5E1D8] hover:border-[#D97706] cursor-pointer transition-colors p-8 rounded-xl flex flex-col justify-between aspect-[4/3] group shadow-sm hover:shadow-md">
                <div className="flex justify-between items-start">
                  <div className="text-sm font-bold text-[#D97706] tracking-wide font-mono">{item.tag}</div>
                  <item.icon className="text-[#9E9B96] group-hover:text-[#D97706] transition-colors" size={32} />
                </div>
                <h3 className="text-2xl font-black text-[#2D2A26] tracking-normal mt-6">{item.title}</h3>
             </motion.div>
          ))}
        </div>
      </motion.div>
    </Slide>,

    // ENGINE 1: 获客
    <Slide key="s_m1">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-[#D97706] tracking-wide uppercase mb-4">01 获客引擎</h3>
          <h2 className="text-6xl md:text-7xl font-black text-[#2D2A26] leading-[1.1] tracking-normal mb-8">
            内容不再是成本，<br />是<span className="text-[#D97706]">免费弹药</span>。
          </h2>
          <p className="text-xl text-[#6B6660] leading-relaxed mb-8">
            扔掉低产能的外包写手。丢一篇竞品爆款进去，Agent 会自动剥离大纲，融进你的产品卖点，并瞬时裂变出 100 篇契合小红书、抖音、独立站体质的种草图文。
          </p>
          <div className="bg-white border border-[#E5E1D8] p-5 rounded-xl flex justify-between items-center relative overflow-hidden">
             <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#2D2A26]"></div>
             <div className="pl-4 w-1/2 border-r border-[#E5E1D8]">
               <div className="text-sm text-[#9E9B96] font-bold mb-1">碳基员工 (人)</div>
               <div className="text-[#2D2A26] font-medium text-lg">1 篇 / 45分钟</div>
             </div>
             <div className="pl-6 w-1/2">
               <div className="text-sm text-[#D97706] font-bold mb-1">硅基员工 (Agent)</div>
               <div className="text-[#D97706] font-black text-2xl">100 篇 / 1分钟</div>
             </div>
          </div>
        </div>
        <div className="flex-1 border-l border-[#E5E1D8] pl-16 py-8 cursor-pointer group" onClick={() => setModalContent(caseDetails["marketing"])}>
           <div className="text-[10rem] font-black text-[#2D2A26] leading-tight tracking-normal opacity-90 mb-4 group-hover:text-[#D97706] transition-colors duration-300">100<span className="text-5xl">x</span></div>
           <p className="font-mono text-[#9E9B96] tracking-wide uppercase font-bold">产能倍增释放</p>
           <p className="text-sm text-[#6B6660] mt-4 flex items-center gap-2"><Search size={16} /> 点击查看控制台界面</p>
        </div>
      </motion.div>
    </Slide>,

    // ENGINE 2: 销售
    <Slide key="s_m2">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 border-r border-[#E5E1D8] pr-16 py-8 text-right cursor-pointer group" onClick={() => setModalContent(caseDetails["sales"])}>
           <div className="text-[10rem] font-black text-[#2D2A26] leading-tight tracking-normal opacity-90 mb-4 group-hover:text-[#D97706] transition-colors duration-300">40<span className="text-5xl">%</span></div>
           <p className="font-mono text-[#9E9B96] tracking-wide uppercase font-bold">无效跟进耗损剔除</p>
           <p className="text-sm text-[#6B6660] mt-4 flex items-center justify-end gap-2"><Search size={16} /> 点击查看控制台界面</p>
        </div>
        <div className="flex-1 pl-4">
          <h3 className="text-2xl font-bold text-[#D97706] tracking-wide uppercase mb-4">02 销售军师</h3>
          <h2 className="text-5xl md:text-6xl font-black text-[#2D2A26] leading-tight mb-8 tracking-normal">
            销冠之所以是销冠，<br />因为他不干脏活。
          </h2>
          <p className="text-xl text-[#6B6660] leading-relaxed mb-8">
            把你的销售从“整理录音、填CRM资料、想发什么逼单微信”的烂泥里拔出来。开完会，Agent 直接吐出客户画像总结、成单概率打分，并生成三套破冰跟进话术。
          </p>
          <div className="bg-white border border-[#E5E1D8] p-5 rounded-xl flex justify-between items-center relative overflow-hidden">
             <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#2D2A26]"></div>
             <div className="pl-4 w-1/2 border-r border-[#E5E1D8]">
               <div className="text-sm text-[#9E9B96] font-bold mb-1">碳基销售有效沟通时长</div>
               <div className="text-[#2D2A26] font-medium text-lg">仅占 35%</div>
             </div>
             <div className="pl-6 w-1/2">
               <div className="text-sm text-[#D97706] font-bold mb-1">引入销售军师后</div>
               <div className="text-[#D97706] font-black text-2xl">飙升至 80%</div>
             </div>
          </div>
        </div>
      </motion.div>
    </Slide>,

    // ENGINE 3: 客服
    <Slide key="s_m3" bg="white">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-[#D97706] tracking-wide uppercase mb-4">03 客服管家</h3>
          <h2 className="text-6xl md:text-7xl font-black text-[#2D2A26] leading-[1.1] tracking-normal mb-8">
            用十年的老骨干，<br />做 7x24 小时接待。
          </h2>
          <p className="text-xl text-[#6B6660] leading-relaxed mb-8">
            将公司过去 10 年的法务、售后、客诉聊天记录和文档全部喂入。新兵客服只需盯着屏幕，AI 会实时判断客户情绪，并在右侧给出完美解答。下班后，这套引擎自己接管全平台咨询。
          </p>
          <div className="bg-[#FAF9F6] border border-[#E5E1D8] p-5 rounded-xl flex justify-between items-center relative overflow-hidden">
             <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#2D2A26]"></div>
             <div className="pl-4 w-1/2 border-r border-[#E5E1D8]">
               <div className="text-sm text-[#9E9B96] font-bold mb-1">碳基员工培训期</div>
               <div className="text-[#2D2A26] font-medium text-lg">师傅带 3 个月</div>
             </div>
             <div className="pl-6 w-1/2">
               <div className="text-sm text-[#D97706] font-bold mb-1">硅基+碳基上岗</div>
               <div className="text-[#D97706] font-black text-2xl">0 天即战力</div>
             </div>
          </div>
        </div>
        <div className="flex-1 border-l border-[#E5E1D8] pl-16 py-8 cursor-pointer group" onClick={() => setModalContent(caseDetails["service"])}>
           <div className="text-[10rem] font-black text-[#2D2A26] leading-tight tracking-normal opacity-90 mb-4 group-hover:text-[#D97706] transition-colors duration-300">24<span className="text-5xl text-[#D97706]">.7</span></div>
           <p className="font-mono text-[#9E9B96] tracking-wide uppercase font-bold">算力无休，情绪永远稳定</p>
           <p className="text-sm text-[#6B6660] mt-4 flex items-center gap-2"><Search size={16} /> 点击查看控制台界面</p>
        </div>
      </motion.div>
    </Slide>,

    // ENGINE 4: 运营
    <Slide key="s_m4">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 border-r border-[#E5E1D8] pr-16 py-8 text-right cursor-pointer group" onClick={() => setModalContent(caseDetails["ops"])}>
           <div className="text-[10rem] font-black text-[#2D2A26] leading-tight tracking-normal opacity-90 mb-4 group-hover:text-[#D97706] transition-colors duration-300">3<span className="text-5xl">SEC</span></div>
           <p className="font-mono text-[#9E9B96] tracking-wide uppercase font-bold">告别“表哥表姐”熬夜拉数据</p>
           <p className="text-sm text-[#6B6660] mt-4 flex items-center justify-end gap-2"><Search size={16} /> 点击查看控制台界面</p>
        </div>
        <div className="flex-1 pl-4">
          <h3 className="text-2xl font-bold text-[#D97706] tracking-wide uppercase mb-4">04 运营看板</h3>
          <h2 className="text-5xl md:text-6xl font-black text-[#2D2A26] leading-tight mb-8 tracking-normal">
            用“人话”来算账。<br />你的决策不必等周报。
          </h2>
          <p className="text-xl text-[#6B6660] leading-relaxed mb-8">
            每天不用再等下属汇报数据。甩一份 CSV 账单或流量表进去，直接提问“找出毛利骤降的异常门店并生成归因”，Agent 3秒后吐出可视化图表和高管洞察。
          </p>
          <div className="bg-white border border-[#E5E1D8] p-5 rounded-xl flex justify-between items-center relative overflow-hidden">
             <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#2D2A26]"></div>
             <div className="pl-4 w-1/2 border-r border-[#E5E1D8]">
               <div className="text-sm text-[#9E9B96] font-bold mb-1">碳基财务/数据岗</div>
               <div className="text-[#2D2A26] font-medium text-lg">归因出表需 1-2 天</div>
             </div>
             <div className="pl-6 w-1/2">
               <div className="text-sm text-[#D97706] font-bold mb-1">硅基 BI 分析</div>
               <div className="text-[#D97706] font-black text-2xl">3 秒即时出图</div>
             </div>
          </div>
        </div>
      </motion.div>
    </Slide>,

    <Slide key="s_m_finish" bg="linear-gradient(135deg, #1C1917 0%, #292420 100%)">
      <motion.div {...fadeUp} className="text-center w-full max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-black text-[#FAF9F6] leading-[1.3] mb-8 tracking-normal">
          所有的这些能力，<br />
          全都可以<span className="text-[#D97706]">无痛</span><span className="whitespace-nowrap">缝合进您的现状。</span>
        </h2>
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="border border-neutral-700 p-8 rounded-xl bg-neutral-800/50 backdrop-blur">
            <img src="https://lf6-cdn-tos.bytescm.com/obj/static/fe/wechat_logo.png" alt="WeChat" className="h-12 mx-auto mb-4 opacity-70 grayscale" />
            <p className="text-neutral-300 font-bold">企微无缝接入</p>
          </div>
          <div className="border border-neutral-700 p-8 rounded-xl bg-neutral-800/50 backdrop-blur relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-[#D97706]/40 to-transparent blur-md"></div>
            <img src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/feishu-logo-white.svg" alt="Feishu" className="h-10 mx-auto mb-4 mt-1 relative z-10" />
            <p className="text-white font-bold relative z-10">飞书群组唤醒</p>
          </div>
          <div className="border border-neutral-700 p-8 rounded-xl bg-neutral-800/50 backdrop-blur">
            <img src="https://img.alicdn.com/tfs/TB1Y5WJpNYaK1RjSZFnXXa80pXa-480-480.png" alt="Dingtalk" className="h-12 mx-auto mb-4 opacity-70 grayscale" />
            <p className="text-neutral-300 font-bold">钉钉审批绑定</p>
          </div>
        </div>
      </motion.div>
    </Slide>,

    <Slide key="s8_live_demo">
      <motion.div {...fadeUp} className="text-center w-full max-w-5xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-black text-[#2D2A26] leading-tight mb-8 tracking-normal">
          不用再看 PPT 上的录屏。
        </h2>
        <p className="text-4xl text-[#D97706] font-bold tracking-wide mt-10">
          现在，打开控制台。
        </p>
        <p className="text-2xl text-[#6B6660] leading-relaxed mt-10 max-w-4xl mx-auto">
          我将给在座的各位<span className="font-bold text-[#2D2A26]">直接发放 6 大工具包的内部测试接口</span>。<br />
          今天上午的剩余时间，请拿您公司的真实数据，亲自感受硅基战力。
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
          subtitle="D2上午 · 全景实操阅兵"
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
