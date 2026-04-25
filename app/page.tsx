"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Target,
  MessageSquare,
  FlaskConical,
  BarChart3,
  Building2,
  Headphones,
  ArrowRight,
  Calendar,
  MapPin,
  Users,
  Sparkles,
  ChevronDown,
  TrendingDown,
  TrendingUp,
  X,
  Loader2,
  Check,
  Lock,
  Presentation,
  Radio,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import TokenGate from "./components/TokenGate";

// 动画配置
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const Highlight = ({ children }: { children: any }) => (
  <strong className="text-[#D97706] text-3xl md:text-3xl mx-2 font-black whitespace-nowrap inline-block tracking-tight bg-[#D97706]/10 px-2 py-0.5 rounded-xl border border-[#D97706]/20">
    {children}
  </strong>
);

const casesData = [
  {
    title: "咨询行业问卷统计与智能决策系统",
    desc: <>利用 AI 编程开发定制化问卷统计系统，深度挖掘商业增长策略。成果为业务级交付产品，<Highlight>仅需 5 天完成</Highlight>（含业务梳理与搭建，后续使用仅需每次运行 10 分钟自动化程序），为企业直接<Highlight>精准省下 2 周人力</Highlight>，整体团队效能爆发式<Highlight>提升 300%</Highlight>，数据洞察深度远胜纯人工处理。</>,
    metrics: ["交付周期减至 5 天", "省下 2 周无用功", "效能火箭式提升 300%"],
    images: ["/cases/media__1775491662965.jpg"],
  },
  {
    title: "电商爆品极速筛查雷达",
    desc: <>全自动低粉账号短视频爆品精选。传统人工一天 <Highlight>24H 不到 10 个候选品</Highlight>，现在仅需<Highlight>5 分钟锁定超 100 款</Highlight>过去一周爆品。搭配智能二次过滤，成功助带货选品实现<Highlight>30 倍量产提效</Highlight>，让人工彻底回归核心实操策略。</>,
    metrics: ["24h 压缩至 5 分钟", "智能二次拦截过滤", "全网爆款发现率提升 30 倍"],
    images: ["/cases/media__1775491662974.png", "/cases/media__1775491662998.png"],
  },
  {
    title: "商用级电商自动化海报工坊",
    desc: <>摒弃无法落地的娱乐级生图。针对模特与商品的商用级呈现，进行极严苛的模型微调与部署。海量输出极高可用性的带货物料，<Highlight>100% 替代场地与摄制费</Highlight>，经测算为公司<Highlight>一年实打实省下 45 万硬开支</Highlight>。</>,
    metrics: ["彻底干掉拍摄与模特费", "单年结余超 45 万成本", "千量级商用图矩阵化高产"],
    images: ["/cases/media__1775491663001.png", "/cases/media__1775491663011.jpg"],
  },
];

// 工具模块数据
const toolModules = [
  {
    icon: Target,
    title: "获客中心",
    desc: "批量 AI 海报生成、短视频自动化制作、全平台文案矩阵铺设",
  },
  {
    icon: MessageSquare,
    title: "销售助手",
    desc: "高意向对话实时分析、金牌话术库动态挂载、极速智能预测与回访",
  },
  {
    icon: FlaskConical,
    title: "研发工坊",
    desc: "业务级大模型头脑风暴、基于自然语言的极速原型验证、行业全网趋势研判",
  },
  {
    icon: BarChart3,
    title: "老板仪表盘",
    desc: "基于图表的智能仪表盘生成、高管视角的 AI 自动总结分析、成交数据洞察",
  },
  {
    icon: Building2,
    title: "行政效率",
    desc: "律师级合同自动审核生成、冗长会议提取式自动纪要、审批流与 RPA 改造诊断",
  },
  {
    icon: Headphones,
    title: "智能客服",
    desc: "基于 RAG 对接企业私域知识库的客诉处理、舆情公关监控、大量客户反馈之声提炼",
  },
];

// 两天流程：从中小企业主痛点出发重写
const schedule = [
  {
    day: "DAY 1",
    date: "4月17日",
    title: "破局：利润下滑不是终点，是您换引擎的信号",
    blocks: [
      {
        time: "上午 09:00",
        label: "看清残局：您的利润正在被谁吞掉？",
        items: [
          "2026 年 AI 能力边界全景：哪些岗位正在被替代，哪些企业已经在翻倍增长",
          "残酷数据对比：用上 AI 的同行，获客成本砍半、人效翻三倍的真实账本",
          "中小企业引入 AI 最容易踩的三个致命深坑，以及怎么绕过去",
        ],
      },
      {
        time: "下午 13:30",
        label: "对号入座：您的行业，AI 正在颠覆哪个环节？",
        items: [
          "五大行业真实案例拆解：他们怎样用 AI 把利润率从 8% 拉到 23%",
          "现场诊断：随机抽取在座企业，当场锁定 AI 可切入的利润增长点",
          "🔥 45 分钟实战：从零搭建一套全自动获客→跟单→成交流水线",
        ],
      },
    ],
  },
  {
    day: "DAY 2",
    date: "4月18日",
    title: "上手：不再观望，今天就让 AI 替您干活",
    blocks: [
      {
        time: "上午 09:00",
        label: "工具实训：零基础也能即学即用的杀手级武器",
        items: [
          "从 100+ AI 工具中筛出最适合中小企业的 12 个杀手级应用",
          "手把手教学：用 Dify / Coze 搭建您自己的智能获客 + 销售系统",
          "10 秒出报表：用 AI 替代过去要花半天的数据分析工作",
        ],
      },
      {
        time: "下午 13:30",
        label: "定制交付：带走属于您企业的 AI 作战地图",
        items: [
          "工作坊：画出您企业的 AI 改造蓝图——哪些岗位换工具、哪些流程自动化",
          "算一笔账：引入 AI 后，您每月能省多少人力成本、多接多少订单",
          "🔥 1v1 专家诊断：针对您的企业定制 AI 落地时间表，离场即可执行",
        ],
      },
    ],
  },
];

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [tokenGateOpen, setTokenGateOpen] = useState(false);
  const [tokenGateTarget, setTokenGateTarget] = useState("/slides");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 报名表单状态
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', company: '', inviteCode: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMessage("请填写姓名和手机号");
      setFormStatus('error');
      return;
    }

    setFormStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        setFormStatus('success');
      } else {
        setErrorMessage(result.message || '报名失败，请稍后再试');
        setFormStatus('error');
      }
    } catch (err) {
      setErrorMessage('网络错误，请稍后再试');
      setFormStatus('error');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6] overflow-hidden font-sans">
      {/* 图片放大 Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-12 cursor-zoom-out backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            alt="Expanded screen" 
          />
        </div>
      )}

      {/* Token 验证 Modal */}
      <TokenGate
        isOpen={tokenGateOpen}
        onClose={() => setTokenGateOpen(false)}
        redirectTo={tokenGateTarget}
      />

      {/* 现场报名 Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-[200] flex justify-center items-start sm:items-center overflow-y-auto p-4 sm:p-6 backdrop-blur-md bg-black/40 transition-opacity">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="my-auto bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 w-full max-w-md shadow-2xl relative border border-[#E5E1D8]"
          >
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="absolute top-6 right-6 text-[#9E9B96] hover:text-[#2D2A26] transition-colors"
            >
              <X size={24} />
            </button>

            <h3 className="text-3xl font-black text-[#2D2A26] mb-3 tracking-tight text-center">报名咨询</h3>
            <p className="text-center text-sm text-[#6B6660] mb-6 flex items-center justify-center gap-2">
              <Calendar size={14} className="text-[#D97706]" />
              2026 年 4 月 17 日（周五）- 18 日（周六）
            </p>

            {/* 新增：价格锚点与特推提示 */}
            <div className="bg-[#FAF9F6] border border-[#D97706]/20 rounded-xl p-4 mb-6 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#D97706]/10 to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-center">
                   <div>
                      <div className="text-[#9E9B96] text-xs font-medium mb-0.5 flex items-center gap-2">
                         <span>官方统一定价</span>
                      </div>
                      <div className="text-[#2D2A26] text-sm font-bold flex items-baseline gap-1.5">
                         统一指导价 <span className="text-[#D97706] text-2xl tracking-tight">￥2,580</span><span className="text-xs text-[#9E9B96] font-normal">/ 人</span>
                      </div>
                   </div>
                   <div className="text-right flex flex-col items-end justify-center">
                      <div className="text-[#D97706] bg-[#D97706]/10 p-2 rounded-lg flex items-center justify-center">
                         <Sparkles size={18} />
                      </div>
                   </div>
                </div>
            </div>

            {formStatus === 'success' ? (
              <>
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="w-12 h-12 bg-[#16A34A]/10 text-[#16A34A] rounded-full flex items-center justify-center mb-4">
                    <Check size={24} strokeWidth={3} />
                  </div>
                  <h4 className="text-xl font-bold text-[#2D2A26] mb-1">报名信息已提交</h4>
                  <p className="text-[#6B6660] text-sm mb-6 max-w-[360px]">
                    顾问会基于你的信息确认席位、价格和邀请码有效性，当前流程不再展示未落库的锁座或支付成功状态。
                  </p>
                  <div className="bg-[#FAF9F6] p-4 rounded-xl shadow-sm border border-[#E5E1D8] mb-6 flex flex-col items-center w-full max-w-[320px]">
                    <img
                      src="/assistant.jpg"
                      alt="课程顾问微信"
                      className="w-32 h-32 object-contain rounded-xl border border-[#E5E1D8] bg-white mb-4"
                    />
                    <div className="w-full space-y-2 text-left text-sm">
                      <div className="flex items-center justify-between rounded-lg border border-[#E5E1D8] bg-white px-3 py-2">
                        <span className="text-[#6B6660]">标准票</span>
                        <span className="font-bold text-[#2D2A26]">￥2,580 / 人</span>
                      </div>
                      <div className="rounded-lg border border-[#E5E1D8] bg-white px-3 py-2 text-[#6B6660] leading-relaxed">
                        {formData.inviteCode.trim()
                          ? "已记录邀请码，优惠资格将由顾问人工复核后确认。"
                          : "如有邀请码，可在顾问联系时补充核验。"}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-[#9E9B96] mb-8 flex items-center gap-1 justify-center">
                    <Lock size={12} />
                    <span>当前流程仅提交报名信息，不直接创建支付单或锁定名额</span>
                  </div>
                  <button
                    onClick={() => setIsRegisterOpen(false)}
                    className="bg-[#2D2A26] text-white py-3 px-8 rounded-xl font-bold hover:bg-black transition-colors w-full"
                  >
                    我知道了，关闭窗口
                  </button>
                </div>
                <div className="hidden">
                <div className="w-12 h-12 bg-[#16A34A]/10 text-[#16A34A] rounded-full flex items-center justify-center mb-4">
                  <Check size={24} strokeWidth={3} />
                </div>
                <h4 className="text-xl font-bold text-[#2D2A26] mb-1">查验通过，席位已临时锁定</h4>
                <p className="text-[#6B6660] text-sm mb-6">请在 30 分钟内完成支付，逾期名额将自动释放</p>
                
                {/* 隐藏大面积的绿色，只露出中间纯粹的黑白付款码区域，匹配咨询公司的审美约束 */}
                <div className="bg-[#FAF9F6] p-4 rounded-xl shadow-lg border border-[#E5E1D8] mb-6 flex flex-col items-center w-full max-w-[280px]">
                  <div className="text-[11px] text-[#9E9B96] mb-4 tracking-widest uppercase font-bold flex items-center gap-2">
                     <span className="w-8 h-px bg-[#E5E1D8]"></span>锁定名额 · 扫码支付<span className="w-8 h-px bg-[#E5E1D8]"></span>
                  </div>
                  
                  {/* 全新官方定制二维码纯净展示 */}
                  <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-[#E5E1D8]/50 shadow-inner bg-white mb-4 p-1.5 flex items-center justify-center">
                    <img 
                      src="/qr-pay.png" 
                      alt="支付二维码" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="w-full bg-white py-2 px-3 rounded text-sm font-bold flex justify-between items-center border border-[#E5E1D8]">
                    <span className="text-[#6B6660] font-normal">应付金额:</span>
                    <span className="text-xl text-[#D97706]">
                      {formData.inviteCode && formData.inviteCode.trim() !== '' ? '￥1,980' : '￥2,580'}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-[#9E9B96] mb-8 flex items-center gap-1 justify-center">
                  <Lock size={12} />
                  <span>支付金额由微信支付平台进行担保与加密结算</span>
                </div>

                <button
                    onClick={() => setIsRegisterOpen(false)}
                    className="bg-[#2D2A26] text-white py-3 px-8 rounded-xl font-bold hover:bg-black transition-colors w-full"
                  >
                    我已完成支付，关闭窗口
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-8">
                {/* 微信二维码区域极简 */}
                <div className="flex justify-center">
                  <img 
                    src="/assistant.jpg" 
                    alt="助理微信" 
                    className="w-48 h-auto object-contain rounded-xl border border-[#E5E1D8] shadow-sm"
                  />
                </div>
                
                <div className="relative flex items-center py-2">
                   <div className="flex-grow border-t border-[#E5E1D8]" />
                   <span className="flex-shrink-0 mx-4 text-xs font-bold text-[#D97706] uppercase tracking-widest">OR</span>
                   <div className="flex-grow border-t border-[#E5E1D8]" />
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-[#2D2A26] mb-2">姓名 *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-5 py-3 rounded-xl border border-[#E5E1D8] focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 transition-all outline-none bg-[#FAF9F6] text-[#2D2A26]"
                      placeholder="请输入您的姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#2D2A26] mb-2">手机号 / 微信 *</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-5 py-3 rounded-xl border border-[#E5E1D8] focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 transition-all outline-none bg-[#FAF9F6] text-[#2D2A26]"
                      placeholder="请输入您的联系方式"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#2D2A26] mb-2">公司名称</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-5 py-3 rounded-xl border border-[#E5E1D8] focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 transition-all outline-none bg-[#FAF9F6] text-[#2D2A26]"
                      placeholder="请输入您的公司名称"
                    />
                  </div>
                  <div>
                    <label className="flex items-center justify-between text-sm font-bold text-[#2D2A26] mb-2">
                      <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-[#D97706]" /> 专属邀请码</span>
                      <span className="text-xs text-[#9E9B96] font-normal">选填</span>
                    </label>
                    <input
                      type="text"
                      value={formData.inviteCode}
                      onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value.toUpperCase() })}
                      maxLength={6}
                      className="w-full px-5 py-3 rounded-xl border-2 border-[#D97706]/30 focus:border-[#D97706] focus:ring-4 focus:ring-[#D97706]/10 transition-all outline-none bg-[#FAF9F6] text-[#D97706] font-mono font-bold tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:font-normal placeholder:text-[#9E9B96]"
                      placeholder="请填入主办方授权邀请码（选填）"
                    />
                  </div>

                  {formStatus === 'error' && (
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                  )}

                  <button
                    type="submit"
                    disabled={formStatus === 'loading'}
                    className="w-full bg-[#D97706] text-white py-4 rounded-xl font-bold uppercase tracking-wide hover:bg-[#B45309] transition-colors flex items-center justify-center disabled:opacity-70"
                  >
                    {formStatus === 'loading' ? (
                      <Loader2 className="animate-spin mr-2" size={20} />
                    ) : null}
                    提交咨询登记
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* 极简化导航栏 */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 lg:px-16 xl:px-32 py-4 md:py-6 gap-4"
        style={{
          background: scrollY > 50 ? "rgba(255,255,255,0.92)" : "transparent",
          backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
          borderBottom: scrollY > 50 ? "1px solid #E5E1D8" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <div className="flex items-center gap-4 lg:gap-8 flex-shrink-0">
          <div className="w-10 h-10 flex items-center justify-center text-xl font-black bg-[#D97706] text-white rounded-xl">
            A
          </div>
          <span className="text-xl font-bold tracking-normal text-[#2D2A26] uppercase hidden lg:block whitespace-nowrap">
            AI Camp 2026
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 lg:gap-10 text-sm font-medium tracking-wide uppercase text-[#9E9B96] whitespace-nowrap overflow-hidden">
          <a href="#schedule" className="hover:text-[#2D2A26] transition-colors whitespace-nowrap">日程解析</a>
          <a href="#cases" className="hover:text-[#2D2A26] transition-colors whitespace-nowrap">落地案例</a>
          <a href="#tools" className="hover:text-[#2D2A26] transition-colors whitespace-nowrap">工具解密</a>
          <a href="#about" className="hover:text-[#2D2A26] transition-colors whitespace-nowrap">关于峰会</a>
        </div>
        <div className="flex items-center gap-4 lg:gap-8 flex-shrink-0">
          <Link
            href="/portfolio"
            className="hidden md:flex items-center gap-2 text-sm font-bold tracking-wide uppercase text-[#D97706] hover:text-[#B45309] transition-colors whitespace-nowrap cursor-pointer border border-[#D97706]/30 px-4 py-2 rounded-xl hover:bg-[#D97706]/5"
          >
            <Sparkles size={14} /> 作品集
          </Link>
          <button
            onClick={() => {
              setTokenGateTarget("/slides/webinar");
              setTokenGateOpen(true);
            }}
            className="hidden md:flex items-center gap-2 text-sm font-bold tracking-wide uppercase text-[#D97706] hover:text-[#B45309] transition-colors whitespace-nowrap bg-[#D97706]/10 px-4 py-2 rounded-full border border-[#D97706]/20 hover:border-[#D97706]/40"
          >
            <Radio size={12} className="animate-pulse text-red-500" /> 线上直播
          </button>
          <button
            onClick={() => {
              setTokenGateTarget("/slides");
              setTokenGateOpen(true);
            }}
            className="hidden md:flex items-center gap-2 text-sm font-medium tracking-wide uppercase text-[#9E9B96] hover:text-[#2D2A26] transition-colors whitespace-nowrap cursor-pointer"
          >
            <Presentation size={14} /> 课件学习
          </button>
        </div>
      </motion.nav>

      {/* Hero 区域 */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-12 lg:px-32 pt-32 pb-16">
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto mt-[-5vh]"
        >
          <motion.div variants={fadeInUp} className="text-[#9E9B96] font-mono tracking-wide uppercase mb-8">
            — SEASON I · 2026.04.17
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-6xl md:text-[9rem] font-black tracking-normal leading-tight mb-10 text-[#2D2A26]"
          >
            AI<span className="text-[#6B6660]">造浪营</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-2xl md:text-3xl text-[#9E9B96] max-w-4xl leading-snug tracking-normal mb-16"
          >
            订单下滑、利润缩水、团队疲于内卷。<br className="hidden md:block"/>
            问题不在努力不够，而在<span className="text-[#2D2A26] font-bold">武器没升级</span>。<br className="hidden md:block"/>
            两天时间，逐环节锁定 AI 的精确切入点，让每一分钱的成本都找到可量化的回报路径。
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-center gap-8 text-sm text-[#6B6660] font-mono tracking-wide uppercase"
          >
            <span className="flex items-center gap-3">
              <Calendar size={18} className="text-[#D97706]" />
              APRIL 17-18, 2026
            </span>
            <span className="flex items-center gap-3 border-l border-[#E5E1D8] pl-8">
              <MapPin size={18} className="text-[#D97706]" />
              CLOSED DOOR / INVITE ONLY
            </span>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="mt-16 flex justify-center w-full"
          >
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="bg-[#D97706] text-white font-black tracking-widest uppercase py-5 px-16 hover:bg-[#B45309] hover:scale-105 transition-all duration-300 rounded-2xl text-xl flex items-center justify-center gap-3 cursor-pointer shadow-2xl shadow-[#D97706]/30 w-full sm:w-auto"
            >
              <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
              立即报名登记
            </button>
          </motion.div>

        </motion.div>

        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[#9E9B96]"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs uppercase font-mono tracking-wide">SCROLL FOR DETAILS</span>
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* 落地案例展示区 */}
      <section id="cases" className="relative py-32 md:py-40 px-12 md:px-24 lg:px-32 bg-white border-t border-[#E5E1D8]">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-28 text-center"
          >
            <h2 className="text-5xl md:text-7xl font-black text-[#2D2A26] tracking-normal mb-8">
               让数据说话<br/>
               <span className="text-[#9E9B96]">指数级降本增效的铁证</span>
            </h2>
            <p className="text-xl md:text-2xl text-[#6B6660] tracking-normal max-w-4xl mx-auto">
               不是画饼，不是概念。您将亲眼在这套“武器库”实操场景中证实，那些深陷产能泥沼的企业，如何让 AI 将成本直接砍半，让人效实现成倍裂变与扩张。
            </p>
          </motion.div>

          <div className="space-y-36">
            {casesData.map((caseItem, i) => (
              <motion.div
                key={caseItem.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col lg:flex-row items-center gap-16"
              >
                {/* 文字区：交替左右 */}
                <div className={`w-full lg:w-5/12 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="flex flex-wrap gap-3 mb-8">
                    {caseItem.metrics.map(metric => (
                       <span key={metric} className="inline-flex items-center px-4 py-2 border border-[#D97706] text-[#D97706] text-[15px] font-bold uppercase tracking-wide rounded-full bg-[#D97706]/5">
                          {metric}
                       </span>
                    ))}
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-black text-[#2D2A26] tracking-normal mb-8 leading-snug">
                    {caseItem.title}
                  </h3>
                  <p className="text-xl text-[#6B6660] leading-relaxed mb-10">
                    {caseItem.desc}
                  </p>
                </div>
                
                {/* 图片区 */}
                <div className={`w-full lg:w-7/12 grid gap-8 ${caseItem.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {caseItem.images.map((imgSrc, imgIdx) => (
                    <div 
                      key={imgIdx} 
                      onClick={() => setSelectedImage(imgSrc)}
                      className={`overflow-hidden rounded-3xl border border-[#E5E1D8] shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 bg-white ${caseItem.images.length === 1 ? 'aspect-video lg:aspect-[4/3]' : 'aspect-square lg:aspect-[3/4]'} flex items-center justify-center cursor-zoom-in relative group`}
                    >
                       <img src={imgSrc} alt={`${caseItem.title} screenshots`} className="w-full h-full object-cover object-left-top group-hover:scale-105 transition-transform duration-700" />
                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 bg-white/95 text-[#D97706] text-sm font-bold px-5 py-2.5 rounded-full shadow-lg transition-opacity duration-300 transform scale-95 group-hover:scale-100 uppercase tracking-widest flex items-center gap-2">
                             <Sparkles size={16} /> 点击放大查看
                          </span>
                       </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 日程区 */}
      <section id="schedule" className="relative py-32 md:py-40 px-12 md:px-24 lg:px-32 bg-[#FAF9F6] border-t border-[#E5E1D8]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-28"
          >
            <h2 className="text-5xl md:text-7xl font-black text-[#2D2A26] tracking-normal mb-8">
              两天，六大环节，逐个击破。
            </h2>
            <p className="text-xl md:text-2xl text-[#9E9B96] tracking-normal max-w-3xl">
              不卖概念，不讲空话。每个模块都直接对应您企业的获客、销售、运营、行政、客服和研发环节，现场演练可直接复制到您公司的落地方案。
            </p>
          </motion.div>

          <div className="space-y-20">
            {schedule.map((day, di) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: di * 0.2 }}
                className="group border-t-2 border-[#E5E1D8] pt-16"
              >
                <div className="flex flex-col md:flex-row gap-10 md:gap-20">
                  {/* 日期侧标 */}
                  <div className="md:w-1/3 shrink-0">
                    <div className="text-5xl font-black text-[#2D2A26] tracking-normal mb-3">{day.day}</div>
                    <div className="text-[#9E9B96] font-mono uppercase tracking-wide mb-8 text-base">{day.date}</div>
                    <h3 className="text-xl font-bold text-[#9E9B96] tracking-normal leading-relaxed">{day.title}</h3>
                  </div>

                  {/* 详细块列 */}
                  <div className="md:w-2/3 space-y-16">
                    {day.blocks.map((block) => (
                      <div key={block.time} className="hover:bg-white/60 p-8 -mx-4 rounded-2xl transition-colors">
                        <div className="flex items-baseline gap-12 mb-8">
                          <span className="text-[#6B6660] font-mono text-xl">{block.time}</span>
                          <span className="text-[#2D2A26] text-2xl font-bold tracking-normal">{block.label}</span>
                        </div>
                        <ul className="space-y-6 pl-2">
                          {block.items.map((item) => (
                            <li
                              key={item}
                              className="text-lg text-[#6B6660] flex items-start leading-relaxed"
                            >
                              <span className="mr-5 text-[#D97706] mt-1 font-bold">•</span>
                              {item.includes("🔥") ? (
                                <span className="text-[#2D2A26] font-bold">{item}</span>
                              ) : item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* 工具展示区 */}
      <section id="tools" className="relative py-32 md:py-40 px-12 md:px-24 lg:px-32 bg-white border-t border-[#E5E1D8]">
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-28"
          >
            <h2 className="text-5xl md:text-7xl font-black text-[#2D2A26] tracking-normal mb-8">
               您的企业，哪些环节<br className="hidden md:block"/>明天就能接入 AI<br/>
               <span className="text-[#9E9B96]">The Arsenal.</span>
            </h2>
            <p className="text-xl md:text-2xl text-[#9E9B96] tracking-normal max-w-3xl">
               从获客到售后，六大核心职能的 AI 实战工具已就绪。不是看演示，而是您亲手操作，带走能直接落地的方案。
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {toolModules.map((tool, i) => (
              <Link key={tool.title} href="/login">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="border border-[#E5E1D8] p-10 hover:border-[#D97706] cursor-pointer group transition-all bg-white rounded-2xl hover:shadow-lg h-full"
                >
                  <tool.icon size={48} className="text-[#9E9B96] group-hover:text-[#D97706] transition-colors mb-10" />
                  <h3 className="text-3xl font-bold text-[#2D2A26] mb-6 tracking-normal">
                    {tool.title}
                  </h3>
                  <p className="text-lg text-[#9E9B96] leading-loose mb-6">
                    {tool.desc}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-[#D97706] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wide">
                    输入邀请码体验 <ArrowRight size={16} />
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 讲师阵容区 */}
      <section id="speakers" className="relative py-32 md:py-40 px-12 md:px-24 lg:px-32 bg-white border-t border-[#E5E1D8]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-28 text-center"
          >
            <h2 className="text-5xl md:text-7xl font-black text-[#2D2A26] tracking-normal mb-8">
              谁在为您<span className="text-[#9E9B96]">护航</span>
            </h2>
            <p className="text-xl md:text-2xl text-[#9E9B96] tracking-normal max-w-3xl mx-auto">
              不讲空泛理论，每一位导师都有真实的商业战果和技术交付物。
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-16 md:gap-12">
            {/* 谢总 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="w-36 h-36 mx-auto mb-8 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-500">
                <img src="/speaker-xie.jpg" alt="谢总" className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700" />
              </div>
              <h3 className="text-2xl font-black text-[#2D2A26] mb-4">谢总</h3>
              <p className="text-sm text-[#9E9B96] mb-5 tracking-wide">连续创业者 · SCUT 硕士 · 企业运营总监</p>
              <p className="text-[#6B6660] text-sm leading-relaxed max-w-[240px] mx-auto">
                深耕企业数字化转型与组织效能提升
              </p>
            </motion.div>

            {/* Toni */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center group"
            >
              <div className="w-36 h-36 mx-auto mb-8 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-500">
                <img src="/speaker-toni.jpg" alt="Toni" className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700" />
              </div>
              <h3 className="text-2xl font-black text-[#2D2A26] mb-4">Toni</h3>
              <p className="text-sm text-[#9E9B96] mb-5 tracking-wide">AI Builder · 独立开发者 · ToB 落地 20+</p>
              <p className="text-[#6B6660] text-sm leading-relaxed max-w-[240px] mx-auto">
                从 MVP 到生产级的全栈 AI 应用交付
              </p>
            </motion.div>

            {/* Mystery Guest */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center group"
            >
              <div className="w-36 h-36 mx-auto mb-8 rounded-full bg-[#F3F1ED] shadow-lg group-hover:shadow-xl transition-shadow duration-500 flex items-center justify-center relative overflow-hidden">
                {/* Google G Logo */}
                <svg className="w-16 h-16 opacity-20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute text-4xl font-black text-[#D97706]"
                >?</motion.span>
              </div>
              <h3 className="text-2xl font-black text-[#2D2A26] mb-4">Mystery Guest</h3>
              <p className="text-sm text-[#9E9B96] mb-5 tracking-wide">Google 中国 · 技术负责人</p>
              <p className="text-[#6B6660] text-sm leading-relaxed max-w-[240px] mx-auto">
                现场揭晓 · 敬请期待
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 脚尾 CTA */}
      <section id="about" className="relative py-36 md:py-48 px-12 md:px-24 lg:px-32 bg-[#FAF9F6] border-t border-[#E5E1D8]">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* K 型分化图示 */}
            <div className="flex items-center justify-center gap-6 mb-12">
              <div className="flex items-center gap-2 text-green-600">
                <TrendingUp size={28} strokeWidth={3} />
                <span className="text-sm font-mono uppercase tracking-wide">用 AI 的企业</span>
              </div>
              <div className="w-px h-10 bg-[#E5E1D8]"></div>
              <div className="flex items-center gap-2 text-red-500">
                <TrendingDown size={28} strokeWidth={3} />
                <span className="text-sm font-mono uppercase tracking-wide">观望中的企业</span>
              </div>
            </div>

            <h2 className="text-5xl md:text-[5.5rem] font-black text-[#2D2A26] leading-tight tracking-normal mb-10">
              AI 时代的 K 型十字路口<br />
              <span className="text-[#9E9B96]">向上，或向下。没有中间地带。</span>
            </h2>
            <p className="text-2xl text-[#9E9B96] leading-relaxed mb-8 tracking-normal max-w-3xl mx-auto">
              同行已经在用 AI 接单、降本、提效，利润曲线正在急剧分化。您的窗口期，不会永远敞开。
            </p>
            <p className="text-xl text-[#6B6660] leading-relaxed mb-20 tracking-normal max-w-3xl mx-auto">
              这不是又一场认知课，而是为您企业量身定制的 AI 落地路线图。<br/>
              两天后，您带走的不是笔记，是<span className="text-[#2D2A26] font-bold">能立刻执行的行动方案</span>。
            </p>
            <Link
              href="/login"
              className="inline-flex items-center text-xl font-bold uppercase tracking-wide text-white bg-[#D97706] px-14 py-6 hover:bg-[#B45309] transition-colors rounded-2xl gap-3"
            >
              立刻进入 AI 工具控制台
              <ArrowRight size={22} />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-[#E5E1D8] py-16 px-12 md:px-24 lg:px-32 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-sm text-[#9E9B96] font-mono tracking-wide">
          <div className="flex flex-col gap-4 text-center md:text-left text-[#6B6660]">
             <span className="font-bold uppercase text-[#2D2A26] text-lg">AI 造浪营 S1 / 智企实验室闭门会</span>
             <p className="flex items-center gap-2 justify-center md:justify-start">
               如有疑问，欢迎点击右侧悬浮按钮留下信息或直接联系助理
             </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
            <span>© 2026 ALL PROCESSES FINALIZED.</span>
            <span className="text-xs uppercase opacity-80">Empowering Next-Gen Enterprises</span>
          </div>
        </div>
      </footer>

      {/* 悬浮现场报名入口 */}
      <motion.button
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        onClick={() => setIsRegisterOpen(true)}
        className="fixed bottom-8 right-8 z-[100] bg-[#D97706] text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 hover:bg-[#B45309] hover:scale-105 transition-all group"
      >
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <Sparkles size={16} className="text-white group-hover:rotate-12 transition-transform" />
        </div>
        <span className="font-bold tracking-widest uppercase">报名咨询</span>
      </motion.button>
    </div>
  );
}
