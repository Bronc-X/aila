"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SlideEngine, Slide } from "@/components/slides/SlideEngine";
import { CaseModal } from "@/components/slides/CaseModal";
import { caseDetails } from "./case-details";
import { Factory, PackageOpen, Server, Film, Code2, Users, Database, MessageSquare, Map, BookOpen } from "lucide-react";

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
  const [timeLeft, setTimeLeft] = useState(45 * 60);
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
    <Slide key="timer" bg="#FAF9F6">
      <motion.div 
        {...fadeUp} 
        className="flex flex-col items-center justify-center w-full h-full max-w-7xl mx-auto relative group pt-20"
      >
        <div className="absolute top-10 left-1/2 -translate-x-1/2 text-2xl text-[#9E9B96] font-bold tracking-[0.5em] uppercase opacity-40">
           LIVE CODING DEPLOYMENT
        </div>

        <h2 
          className={`text-[12rem] md:text-[24rem] font-black leading-none tracking-tighter font-mono cursor-pointer select-none transition-all duration-700 ease-in-out ${isRunning ? 'text-[#D97706] scale-100' : 'text-[#2D2A26] opacity-30 scale-95 hover:scale-100 hover:opacity-80'}`}
          onClick={toggleTimer}
          onDoubleClick={(e) => {
             e.stopPropagation();
             setModalContent(caseDetails["live-coding"]);
          }}
          title="单击启动/暂停 · 双击查看架构图"
        >
          {m}<span className={isRunning ? 'animate-pulse opacity-50' : 'opacity-100'}>:</span>{s}
        </h2>

        <p className={`text-2xl font-medium tracking-[0.3em] uppercase mt-12 transition-all duration-1000 ${isRunning ? 'text-[#D97706] opacity-60' : 'text-[#9E9B96] opacity-0 group-hover:opacity-60'}`}>
           {isRunning ? 'SYSTEM DEPLOYING IN PROGRESS...' : 'CLICK COUNTER TO INITIALIZE'}
        </p>
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
          你以为AI还在"写文章"？
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

    // ====== P4 (S3): 工业制造 —— 真实场景枚举 ======
    <Slide key="s3">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <div className="flex gap-8 items-center mb-8">
          <Factory size={56} className="text-[#9E9B96]" />
          <h2 className="text-4xl font-black text-[#666] tracking-wide uppercase">
            <span className="text-[#2D2A26]">工业制造</span> / 肉眼→算法
          </h2>
        </div>
        <div className="border-t border-[#E5E1D8] pt-12 grid grid-cols-1 md:grid-cols-2 gap-12 cursor-pointer group" onClick={() => setModalContent(caseDetails["manufacturing"])}>
           <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 flex items-center justify-center">
              <img src="/cases/industry_manufacturing_1775101754129.png" alt="Industrial CV" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute bottom-6 left-6 right-6">
                 <h4 className="text-2xl font-bold text-white mb-2 drop-shadow-md">老师傅请假 = 产线停摆？</h4>
                 <p className="text-[#D97706] font-mono tracking-wider drop-shadow-md font-bold">AI 检测 · 零疲劳 · 零情绪 · 全年无休</p>
              </div>
           </div>
           <div className="flex flex-col justify-center">
              <div className="space-y-4 text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                <p>🏭 <b className="text-[#2D2A26]">注塑/五金厂：</b>模具良品率全靠师傅肉眼挑，一个老师傅请假就出大批次质量事故</p>
                <p>📦 <b className="text-[#2D2A26]">包装印刷厂：</b>色差比对靠人手举色卡，交期紧时老板自己上手都来不及</p>
                <p>🔧 <b className="text-[#2D2A26]">机加工厂：</b>产能瓶颈不在CNC加工，而在人工量检——每件量3分钟，日产能卡死</p>
              </div>
              <div className="bg-white border border-[#E5E1D8] p-8 rounded-xl shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="text-gray-500">某注塑厂 50人质检组</span>
                  <span className="text-2xl font-bold text-[#2D2A26]">→ 仅留5人 <span className="text-sm text-green-600">↓90%</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">年节省人力成本</span>
                  <span className="text-3xl font-black text-[#D97706]">¥ 1,800,000+</span>
                </div>
              </div>
           </div>
        </div>
      </motion.div>
    </Slide>,

    // ====== P5 (S4): 跨境出海 —— 老板听得懂的语言 ======
    <Slide key="s4">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <div className="flex gap-8 items-center mb-8">
          <PackageOpen size={56} className="text-[#9E9B96]" />
          <h2 className="text-4xl font-black text-[#666] tracking-wide uppercase">
            <span className="text-[#2D2A26]">跨境出海</span> / 一人舰队
          </h2>
        </div>
        <div className="border-t border-[#E5E1D8] pt-12 grid grid-cols-1 md:grid-cols-2 gap-12 cursor-pointer group" onClick={() => setModalContent(caseDetails["retail"])}>
           <div className="flex flex-col justify-center">
              <div className="space-y-4 text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                <p>📱 <b className="text-[#2D2A26]">亚马逊/TikTok Shop：</b>开新品要翻6国语言+拍8组图+分平台上架，2周成本5万+ → Agent半天搞定</p>
                <p>🌍 <b className="text-[#2D2A26]">外贸工厂：</b>阿里国际站询盘，2小时不回客户就流失 → AI 7×24秒级回复+自动出报价单</p>
                <p>📊 <b className="text-[#2D2A26]">选品困局：</b>老板飞美国选品一趟花20万，回来还拿不准 → AI 10分钟出选品报告</p>
              </div>
              <div className="bg-white border border-[#E5E1D8] p-8 rounded-xl shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="text-gray-500">某深圳3C出海团队</span>
                  <span className="text-2xl font-bold text-[#2D2A26]">外籍文案 3→0人</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">年节省人力成本</span>
                  <span className="text-3xl font-black text-[#D97706]">¥ 450,000+</span>
                </div>
              </div>
           </div>
           <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 flex items-center justify-center">
              <img src="/cases/ecommerce_dashboard_1775101771068.png" alt="Ecommerce Analytics" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute bottom-6 left-6 right-6">
                 <h4 className="text-2xl font-bold text-white mb-2 drop-shadow-md">询盘不过夜 · 选品不靠飞</h4>
                 <p className="text-[#D97706] font-mono tracking-wider drop-shadow-md font-bold">翻译 → 文案 → 上架 → 投放全自动</p>
              </div>
           </div>
        </div>
      </motion.div>
    </Slide>,

    // ====== P6 (S5): 泛服务业 —— 经验不再被人带走 ======
    <Slide key="s5">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <div className="flex gap-8 items-center mb-8">
          <Server size={56} className="text-[#9E9B96]" />
          <h2 className="text-4xl font-black text-[#666] tracking-wide uppercase">
            <span className="text-[#2D2A26]">泛服务业</span> / 经验不再被人带走
          </h2>
        </div>
        <div className="border-t border-[#E5E1D8] pt-12 grid grid-cols-1 md:grid-cols-2 gap-12 cursor-pointer group" onClick={() => setModalContent(caseDetails["service"])}>
           <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 flex items-center justify-center">
              <img src="/cases/service_knowledge_1775101783025.png" alt="Knowledge Base" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
              <div className="absolute bottom-6 left-6 right-6">
                 <h4 className="text-2xl font-bold text-white mb-2 drop-shadow-md">十年经验 · 一键继承</h4>
                 <p className="text-[#D97706] font-mono tracking-wider drop-shadow-md font-bold">新人入职 = 拥有公司全部记忆</p>
              </div>
           </div>
           <div className="flex flex-col justify-center">
              <div className="space-y-4 text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                <p>⚖️ <b className="text-[#2D2A26]">律所/法务：</b>老合伙人带走客户，新律师不敢接复杂案件 → AI+十年卷宗秒级检索</p>
                <p>📋 <b className="text-[#2D2A26]">财税/审计：</b>年政策变50+条，靠人记不靠谱，一个错判赔全年利润 → 政策库+智能审查</p>
                <p>🏥 <b className="text-[#2D2A26]">医美/连锁：</b>好销售一走客户全丢，新人培训3月才独立 → 话术库+AI客户画像</p>
                <p>🔨 <b className="text-[#2D2A26]">装修/建材：</b>设计师报价全凭感觉，换人差距30% → 项目知识库+AI自动估价</p>
              </div>
              <div className="bg-white border border-[#E5E1D8] p-8 rounded-xl shadow-sm space-y-4">
                 <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="text-gray-500">某连锁财税所 新人上岗周期</span>
                  <span className="text-2xl font-bold text-[#2D2A26]">3个月→3天 <span className="text-sm text-green-600">↓97%</span></span>
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

    // ====== P7 (S6): 内容传媒 —— 老板的变现语言 ======
    <Slide key="s6">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <div className="flex gap-8 items-center mb-8">
          <Film size={56} className="text-[#9E9B96]" />
          <h2 className="text-4xl font-black text-[#666] tracking-wide uppercase">
            <span className="text-[#2D2A26]">内容传媒</span> / 1人=10人矩阵团队
          </h2>
        </div>
        <div className="border-t border-[#E5E1D8] pt-12 grid grid-cols-1 md:grid-cols-2 gap-12 cursor-pointer group" onClick={() => setModalContent(caseDetails["media"])}>
           <div className="flex flex-col justify-center">
              <div className="space-y-4 text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                <p>📹 <b className="text-[#2D2A26]">短视频矩阵：</b>以前养10个号雇8人 → 现在AI一天批量200条不重复内容，自动分发</p>
                <p>🛒 <b className="text-[#2D2A26]">直播切片：</b>老板播一场，AI自动切50条精华带货视频分发全平台</p>
                <p>📝 <b className="text-[#2D2A26]">小红书/公众号：</b>运营发推文改8遍 → AI 3分钟采集、改写、配图、排版一条龙</p>
                <p>🎤 <b className="text-[#2D2A26]">数字人IP：</b>老板录一段口播，AI生成多语言版，TikTok全球分发</p>
              </div>
              <div className="bg-white border border-[#E5E1D8] p-8 rounded-xl shadow-sm space-y-4">
                 <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="text-gray-500">某餐饮品牌 外包摄影费</span>
                  <span className="text-2xl font-bold text-[#2D2A26]">年15万→¥0 <span className="text-sm text-green-600">彻底归零</span></span>
                 </div>
                 <div className="flex justify-between items-center">
                  <span className="text-gray-500">抖音矩阵曝光量</span>
                  <span className="text-3xl font-black text-[#D97706]">100x 放大</span>
                 </div>
              </div>
           </div>
           <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 flex items-center justify-center">
              <img src="/cases/media_creator_1775101804245.png" alt="Media Factory" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute bottom-6 left-6 right-6">
                 <h4 className="text-2xl font-bold text-white mb-2 drop-shadow-md">你播一场 · AI 裂变一千场</h4>
                 <p className="text-[#D97706] font-mono tracking-wider drop-shadow-md font-bold">切片 → 配音 → 多平台 → 全自动</p>
              </div>
           </div>
        </div>
      </motion.div>
    </Slide>,

    // ====== P8 (S6.5): 服务能力宣言 ======
    <Slide key="s6_5" bg="white">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <div className="flex gap-6 items-center mb-4">
          <div className="w-16 h-1 bg-[#D97706]"></div>
          <h2 className="text-3xl font-black text-[#2D2A26] tracking-wide">
            我们帮企业打造的 AI 基建
          </h2>
        </div>
        <p className="text-lg text-[#9E9B96] mb-10">高价值服务 · 高交付标准 · 对得起你下单的每一分钱</p>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { icon: <Code2 size={28} className="text-[#D97706]" />, tag: "01", title: "企业级 AI 工具定制开发", desc: "用 IDE + AI 编程，按你的业务逻辑、审批链条、数据口径量身打造自研工具。不是SaaS套模板，是你独有的数字武器。" },
            { icon: <Users size={28} className="text-[#D97706]" />, tag: "02", title: "百位专家 Agent 矩阵", desc: "为企业打造100+个专家级AI Agent，覆盖销售/法务/采购/运营/客服全岗位。每个Agent吃透十年数据，7×24不休不走。" },
            { icon: <Database size={28} className="text-[#D97706]" />, tag: "03", title: "企业数字资产 / 专家知识库", desc: "把散落在微信群、飞书文档、各人电脑里的知识全部汇入AI大脑。新人入职=十年老员工。数据不出企业围墙，私有部署。" },
            { icon: <MessageSquare size={28} className="text-[#D97706]" />, tag: "04", title: "飞书 / 钉钉 / 企微 无痛接入", desc: "CLI一键集成，不换系统、不培训、不停工。现有审批流、日报、客服直接升维AI驱动。零学习成本，当天部署当天用。" },
          ].map(item => (
            <div key={item.tag} className="bg-[#F9F8F5] border border-[#E5E1D8] p-8 rounded-xl hover:border-[#D97706] transition-colors">
              <div className="flex items-center gap-4 mb-4">
                {item.icon}
                <span className="text-xs font-bold text-[#D97706] tracking-wider">{item.tag}</span>
              </div>
              <h3 className="text-xl font-bold text-[#2D2A26] mb-3">{item.title}</h3>
              <p className="text-[#6B6660] leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-2xl font-bold text-[#2D2A26] mt-10 tracking-wide">
          这不是卖你一个软件，是帮你的企业<span className="text-[#D97706]">装上 AI 引擎</span>
        </p>
      </motion.div>
    </Slide>,

    // ====== P9 (S6.8): 收获预期（第三项已修改） ======
    <Slide key="s6_8">
      <motion.div {...fadeUp} className="max-w-4xl mx-auto w-full">
        <h2 className="text-4xl font-black text-[#2D2A26] tracking-wide mb-12 text-center">
          经过这 2 天，你将带走什么？
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { tag: "01 PLAN", title: "一份私有诊断", desc: "摸清你企业利润正在流失的三大出血点。" },
            { tag: "02 TOOL", title: "一套现成工具库", desc: "6 套开箱即用的 AI 提效工具，直接给员工上手。" },
            { tag: "03 MAP", title: "一份AI改造路线图", desc: "企业老板如何改造成新AI企业 + 全员AI工具使用白皮书。" },
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

    // ====== P10: 诊断展开 —— 利润出血点 ======
    <Slide key="p10" bg="white">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <h2 className="text-4xl font-black text-[#2D2A26] tracking-wide mb-3 text-center">
          你的企业，每月在为<span className="text-[#D97706]">无效人力</span>付多少钱？
        </h2>
        <p className="text-lg text-[#9E9B96] text-center mb-10">精准诊断你的利润出血点</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              tag: "出血点 ①", title: "信息传递消耗",
              points: ["业务员每天40%时间在找资料、汇报、等审批", "这些时间不产生一分钱收入", "AI做到：信息秒检索、审批自动、日报自动生成"],
              highlight: "月薪6000的员工，实际产出时间只值3600",
            },
            {
              tag: "出血点 ②", title: "经验无法复制",
              points: ["最怕的事：核心员工离职带走客户和know-how", "新人学3个月还犯低级错误，投诉率飙升", "AI做到：十年经验灌入知识库，新人即战力"],
              highlight: "你花3年培养的总监，AI 3天复制80%能力",
            },
            {
              tag: "出血点 ③", title: "决策靠拍脑袋",
              points: ["补货多少？投哪个渠道？该不该接这单？全凭经验", "一个判断失误可能亏掉一整年利润", "AI做到：数据驱动决策、实时分析、竞品监控"],
              highlight: "用数据赚钱，比用直觉赚钱安全10倍",
            },
          ].map(item => (
            <div key={item.tag} className="bg-[#F9F8F5] border border-[#E5E1D8] p-8 rounded-xl flex flex-col">
              <div className="text-xs font-bold text-red-500 tracking-wider mb-3">{item.tag}</div>
              <h3 className="text-xl font-bold text-[#2D2A26] mb-5">{item.title}</h3>
              <ul className="space-y-3 text-[#6B6660] text-sm leading-relaxed flex-1">
                {item.points.map((p, i) => <li key={i} className="flex gap-2"><span className="text-[#D97706] shrink-0">›</span> {p}</li>)}
              </ul>
              <div className="mt-6 pt-4 border-t border-[#E5E1D8]">
                <p className="text-sm font-bold text-[#D97706]">★ {item.highlight}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xl text-[#6B6660] mt-10">
          诊断报告免费出 · <span className="font-bold text-[#2D2A26]">让数据告诉你，你的企业正在哪里漏钱</span>
        </p>
      </motion.div>
    </Slide>,

    // ====== P11: 工具库展开 ======
    <Slide key="p11" bg="white">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <h2 className="text-4xl font-black text-[#2D2A26] tracking-wide mb-3 text-center">
          别人的员工已经<span className="text-[#D97706]">用上了</span>，你还在靠嘴喊
        </h2>
        <p className="text-lg text-[#9E9B96] text-center mb-10">6套AI工具已就位，给你的团队装上涡轮增压</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "🎯", title: "AI 获客引擎", desc: "自动生图、文案、多平台分发\n1人 = 5人营销团队" },
            { icon: "💬", title: "AI 销售军师", desc: "实时话术提示、客户画像分析\n成交概率预测" },
            { icon: "🎧", title: "AI 客服管家", desc: "7×24无休应答、投诉识别\n满意度追踪" },
            { icon: "📊", title: "AI 运营看板", desc: "日报周报自动生成\n数据异常预警" },
            { icon: "🛒", title: "AI 采购助手", desc: "比价系统、供应商评估\n库存智能预警" },
            { icon: "📝", title: "AI 会议纪要", desc: "开完会自动出纪要\n分配任务、跟踪进度" },
          ].map(t => (
            <div key={t.title} className="bg-white border border-[#E5E1D8] p-6 rounded-xl hover:border-[#D97706] hover:shadow-md transition-all text-center">
              <div className="text-4xl mb-4">{t.icon}</div>
              <h3 className="text-lg font-bold text-[#2D2A26] mb-3">{t.title}</h3>
              <p className="text-[#6B6660] text-sm leading-relaxed whitespace-pre-line">{t.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xl font-bold text-[#2D2A26] mt-10">
          你的竞争对手正在悄悄上这些工具。<br />
          <span className="text-[#D97706]">你每晚一天，就多付一天的无效人力成本。</span>
        </p>
      </motion.div>
    </Slide>,

    // ====== P12: AI改造路线图 ======
    <Slide key="p12" bg="white">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <h2 className="text-4xl font-black text-[#2D2A26] tracking-wide mb-3 text-center">
          你不需要懂AI，你需要<span className="text-[#D97706]">一张路线图</span>
        </h2>
        <p className="text-lg text-[#9E9B96] text-center mb-10">企业老板 → 新AI企业 落地白皮书</p>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-[#F9F8F5] border border-[#E5E1D8] p-8 rounded-xl">
            <h3 className="text-xl font-black text-[#2D2A26] mb-6 flex items-center gap-3">
              <Map size={24} className="text-[#D97706]" /> 老板要做的 3 件事
            </h3>
            <div className="space-y-6">
              {[
                { week: "第一周", title: "诊断", desc: "我来帮你做一次企业AI体检，找出3个最值得AI改造的岗位" },
                { week: "第二周", title: "试点", desc: "选一个岗位先上AI，让全公司看到ROI的真实数据" },
                { week: "第三周", title: "推广", desc: "发布公司级AI使用规范，把工具权限发到每个人手里" },
              ].map(step => (
                <div key={step.week} className="flex gap-4">
                  <div className="shrink-0 w-16 h-16 rounded-full bg-white border-2 border-[#D97706] flex items-center justify-center text-xs font-bold text-[#D97706]">{step.week}</div>
                  <div>
                    <h4 className="font-bold text-[#2D2A26] mb-1">{step.title}</h4>
                    <p className="text-[#6B6660] text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#F9F8F5] border border-[#E5E1D8] p-8 rounded-xl">
            <h3 className="text-xl font-black text-[#2D2A26] mb-6 flex items-center gap-3">
              <BookOpen size={24} className="text-[#D97706]" /> 员工白皮书的核心
            </h3>
            <div className="space-y-5 text-[#6B6660] text-base leading-relaxed">
              <p className="font-bold text-[#2D2A26] text-lg">不是让员工学编程，是教他们用自然语言指挥AI</p>
              <div className="space-y-3 pt-4 border-t border-[#E5E1D8]">
                <p>📖 <b className="text-[#2D2A26]">AI提问技巧：</b>怎么问，AI才能给出你要的答案</p>
                <p>🎯 <b className="text-[#2D2A26]">业务场景模板：</b>开箱即用，覆盖90%日常工作</p>
                <p>🚫 <b className="text-[#2D2A26]">安全红线：</b>哪些数据绝对不能喂给AI</p>
              </div>
              <div className="bg-white border border-[#E5E1D8] p-4 rounded-lg mt-4">
                <p className="text-[#2D2A26] font-bold text-center">结果：每个员工变成<br /><span className="text-[#D97706] text-lg">{'"1人 + 1个AI助手"的战队'}</span></p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-xl font-bold mt-10 text-[#2D2A26]">
          2026年底还没完成AI改造的企业——<br />
          <span className="text-[#D97706]">不是被AI淘汰，是被先改造完的同行淘汰。你敢赌吗？</span>
        </p>
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
    <TimerSlide key="timer_module" setModalContent={setModalContent} />,
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
