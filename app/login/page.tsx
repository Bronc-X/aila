"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { postJson } from "@/lib/api-client";

// ── 行业选项（12个）──
const industries = [
  { value: "ecommerce", label: "电商出海", emoji: "🛒" },
  { value: "manufacturing", label: "高端制造", emoji: "🏭" },
  { value: "fmcg", label: "零售·快消", emoji: "🛍️" },
  { value: "service", label: "泛服务业", emoji: "🤝" },
  { value: "software", label: "软件SaaS", emoji: "💻" },
  { value: "education", label: "教育培训", emoji: "📚" },
  { value: "healthcare", label: "医疗健康", emoji: "🏥" },
  { value: "agriculture", label: "农业科技", emoji: "🌾" },
  { value: "finance", label: "金融保险", emoji: "💰" },
  { value: "logistics", label: "物流供应链", emoji: "🚚" },
  { value: "realestate", label: "房地产", emoji: "🏢" },
  { value: "other", label: "其他行业", emoji: "🔮" },
];

// ── 公司规模 ──
const companySizes = [
  { value: "1-10", label: "1-10人" },
  { value: "11-50", label: "11-50人" },
  { value: "51-200", label: "51-200人" },
  { value: "200-500", label: "200-500人" },
  { value: "500+", label: "500+" },
];

// ── 核心痛点 ──
const painPoints = [
  { value: "acquisition_cost", label: "获客成本高", emoji: "💸" },
  { value: "conversion_low", label: "转化率低", emoji: "📉" },
  { value: "customer_churn", label: "客户流失严重", emoji: "🚪" },
  { value: "low_efficiency", label: "人效不足", emoji: "⏳" },
  { value: "data_scattered", label: "数据分散", emoji: "🗂️" },
  { value: "collaboration", label: "内部协作差", emoji: "🔗" },
  { value: "brand_weak", label: "品牌影响力弱", emoji: "📢" },
  { value: "supply_chain", label: "供应链效率低", emoji: "⚙️" },
  { value: "service_slow", label: "客服响应慢", emoji: "🐌" },
  { value: "compliance", label: "合规风险", emoji: "⚖️" },
  { value: "hiring", label: "招人难", emoji: "🧑‍💼" },
  { value: "profit_decline", label: "利润下滑", emoji: "📊" },
];

// ── AI 使用经验 ──
const aiExperience = [
  { value: "none", label: "完全没用过", desc: "团队还没有正式使用相关工具" },
  { value: "tried", label: "试过 ChatGPT 等", desc: "用过通用聊天工具，尚未形成流程" },
  { value: "simple", label: "已部署简单应用", desc: "部分环节已经开始使用工具辅助" },
  { value: "deep", label: "已深度整合", desc: "工具已经进入核心业务流程" },
];

export default function LoginPage() {
  const [inviteCode, setInviteCode] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [selectedPains, setSelectedPains] = useState<string[]>([]);
  const [aiExp, setAiExp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"code" | "info">("code");
  const [nextPath, setNextPath] = useState("/tools");
  const router = useRouter();

  useEffect(() => {
    const next = new URLSearchParams(window.location.search).get("next");
    if (next && next.startsWith("/")) {
      setNextPath(next);
    }
  }, []);

  const togglePain = (val: string) => {
    setSelectedPains((prev) => {
      if (prev.includes(val)) return prev.filter((p) => p !== val);
      if (prev.length >= 3) return prev;
      return [...prev, val];
    });
  };

  async function handleInfoSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !company.trim() || !industry) return;
    setLoading(true);
    setError("");

    // 存储用户信息到 localStorage
    const profile = {
      name,
      company,
      industry,
      industryLabel: industries.find((i) => i.value === industry)?.label || "",
      companySize,
      painPoints: selectedPains,
      painPointLabels: selectedPains.map(
        (p) => painPoints.find((pp) => pp.value === p)?.label || ""
      ),
      aiExperience: aiExp,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("aila-user-profile", JSON.stringify(profile));

    let shouldDelayNavigation = false;

    try {
      await postJson("/api/profile", {
        name: profile.name,
        company: profile.company,
        industry: profile.industry,
        industry_label: profile.industryLabel,
        company_size: profile.companySize,
        pain_points: profile.painPoints,
        pain_point_labels: profile.painPointLabels,
        ai_experience: profile.aiExperience,
      });
    } catch (e) {
      shouldDelayNavigation = true;
      setError("资料已保存在本机，云端同步失败，但不影响进入工具。");
      console.warn("Profile sync failed:", e);
    }

    setLoading(false);
    if (shouldDelayNavigation) {
      window.setTimeout(() => router.push(nextPath), 800);
      return;
    }

    router.push(nextPath);
  }

  const canSubmitInfo = name.trim() && company.trim() && industry;
  const handleCodeStepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setLoading(true);
    setError("");

    try {
      const result = await postJson<{
        success: boolean;
        grantedScope: "tools" | "slides";
        scopes: Array<"tools" | "slides">;
      }>("/api/auth/login", {
        inviteCode: inviteCode.trim(),
        nextPath,
      });

      if (nextPath.startsWith("/slides")) {
        router.push(nextPath);
        return;
      }

      if (!result.scopes.includes("tools")) {
        router.push("/slides");
        return;
      }

      setStep("info");
    } catch (e) {
      setError(e instanceof Error ? e.message : "邀请码校验失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center px-6 md:px-12 lg:px-24 py-12 relative overflow-hidden font-sans">
      <Link
        href="/"
        className="absolute top-8 left-6 md:left-12 lg:left-24 text-[#9E9B96] font-mono text-sm tracking-wide hover:text-[#22d665] transition-colors flex items-center gap-2 uppercase"
      >
        <ArrowLeft size={16} /> 返回首页
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-3xl mx-auto"
      >
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#2D2A26] tracking-normal leading-tight mb-4">
            {step === "code" ? "输入演示邀请码。" : "先补充你的业务背景。"}
          </h1>
          <p className="text-lg text-[#9E9B96] tracking-normal">
            {step === "code"
              ? "工具演示区采用邀请制，请输入你收到的访问码。"
              : "这些信息会帮助工具页按行业和痛点给出更贴近现场的示例。"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === "code" ? (
            <motion.form
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -50 }}
              onSubmit={handleCodeStepSubmit}
              className="space-y-12"
            >
              <div className="relative group">
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="PROTOTYPE-CODE"
                  className="w-full bg-transparent border-0 border-b-2 border-[#E5E1D8] pb-4 text-4xl md:text-5xl font-mono text-[#2D2A26] placeholder-[#C5C0B8] focus:ring-0 focus:outline-none focus:border-[#22d665] transition-colors text-center tracking-[0.2em] md:tracking-[0.5em]"
                  maxLength={8}
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-lg text-red-500 font-mono tracking-wide text-center">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !inviteCode.trim()}
                className="w-full sm:w-auto mx-auto flex items-center justify-center gap-8 py-5 px-14 border-2 border-[#E5E1D8] hover:border-[#22d665] hover:bg-white transition-all disabled:opacity-30 group text-xl font-bold uppercase tracking-wide text-[#6B6660] hover:text-[#22d665] rounded-2xl"
              >
                {loading ? "VERIFYING..." : "进入演示区"}
                {!loading && (
                  <ArrowRight
                    size={24}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="info"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleInfoSubmit}
              className="space-y-10"
            >
              {/* ── 基本信息 ── */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold tracking-wide text-[#9E9B96] mb-3 uppercase">
                    Commander · 您的姓名
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="真实姓名"
                    className="w-full bg-transparent border-0 border-b-2 border-[#E5E1D8] pb-3 text-xl text-[#2D2A26] placeholder-[#C5C0B8] focus:ring-0 focus:outline-none focus:border-[#22d665] transition-colors"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wide text-[#9E9B96] mb-3 uppercase">
                    Vessel · 公司名称
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="公司全称"
                    className="w-full bg-transparent border-0 border-b-2 border-[#E5E1D8] pb-3 text-xl text-[#2D2A26] placeholder-[#C5C0B8] focus:ring-0 focus:outline-none focus:border-[#22d665] transition-colors"
                  />
                </div>
              </div>

              {/* ── 行业选择 ── */}
              <div>
                <label className="block text-xs font-bold tracking-wide text-[#9E9B96] mb-4 uppercase">
                  Operating Domain · 所属行业 <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {industries.map((ind) => (
                    <button
                      key={ind.value}
                      type="button"
                      onClick={() => setIndustry(ind.value)}
                      className={`py-3 px-2 text-sm font-bold tracking-normal transition-all rounded-xl flex flex-col items-center gap-1.5 ${
                        industry === ind.value
                          ? "bg-[#22d665] text-white border-2 border-[#22d665] scale-[1.03] shadow-lg shadow-[#22d665]/20"
                          : "border-2 border-[#E5E1D8] text-[#6B6660] hover:border-[#22d665] hover:text-[#22d665]"
                      }`}
                    >
                      <span className="text-lg">{ind.emoji}</span>
                      {ind.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── 公司规模 ── */}
              <div>
                <label className="block text-xs font-bold tracking-wide text-[#9E9B96] mb-4 uppercase">
                  Scale · 公司规模
                </label>
                <div className="flex flex-wrap gap-3">
                  {companySizes.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setCompanySize(s.value)}
                      className={`py-2.5 px-5 text-sm font-bold transition-all rounded-xl border-2 ${
                        companySize === s.value
                          ? "border-[#22d665] bg-[#22d665]/10 text-[#22d665]"
                          : "border-[#E5E1D8] text-[#6B6660] hover:border-[#22d665]"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── 核心痛点（多选，最多3个） ── */}
              <div>
                <label className="block text-xs font-bold tracking-wide text-[#9E9B96] mb-2 uppercase">
                  Pain Points · 最想解决的痛点{" "}
                  <span className="text-[#22d665] normal-case">
                    （可选 {selectedPains.length}/3）
                  </span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {painPoints.map((p) => {
                    const selected = selectedPains.includes(p.value);
                    const disabled = !selected && selectedPains.length >= 3;
                    return (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => togglePain(p.value)}
                        disabled={disabled}
                        className={`py-2.5 px-3 text-xs font-bold transition-all rounded-xl border-2 flex items-center gap-1.5 ${
                          selected
                            ? "border-[#22d665] bg-[#22d665]/10 text-[#22d665]"
                            : disabled
                            ? "border-[#E5E1D8] text-[#C5C0B8] opacity-40 cursor-not-allowed"
                            : "border-[#E5E1D8] text-[#6B6660] hover:border-[#22d665]"
                        }`}
                      >
                        <span>{p.emoji}</span>
                        {p.label}
                        {selected && <Check size={12} className="ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── AI 使用经验 ── */}
              <div>
                <label className="block text-xs font-bold tracking-wide text-[#9E9B96] mb-4 uppercase">
                  Readiness · 工具使用经验
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {aiExperience.map((exp) => (
                    <button
                      key={exp.value}
                      type="button"
                      onClick={() => setAiExp(exp.value)}
                      className={`py-3 px-4 text-left transition-all rounded-xl border-2 ${
                        aiExp === exp.value
                          ? "border-[#22d665] bg-[#22d665]/10"
                          : "border-[#E5E1D8] hover:border-[#22d665]"
                      }`}
                    >
                      <div
                        className={`text-sm font-bold ${
                          aiExp === exp.value ? "text-[#22d665]" : "text-[#2D2A26]"
                        }`}
                      >
                        {exp.label}
                      </div>
                      <div className="text-[11px] text-[#9E9B96] mt-0.5">{exp.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-lg text-red-500 font-mono tracking-wide">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !canSubmitInfo}
                className="w-full flex items-center justify-center gap-4 py-5 bg-[#22d665] text-white hover:bg-[#15803d] transition-colors disabled:opacity-30 disabled:cursor-not-allowed group text-xl font-black uppercase tracking-normal rounded-2xl"
              >
                {loading ? "INITIALIZING..." : "进入工具控制台"}
                {!loading && (
                  <ArrowRight
                    size={28}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="absolute bottom-8 left-6 md:left-12 lg:left-24 text-[#C5C0B8] font-mono text-xs uppercase tracking-[0.3em]">
        SESSION VER / 2026.04
      </div>
    </div>
  );
}
