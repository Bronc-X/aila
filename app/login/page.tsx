"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [inviteCode, setInviteCode] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"code" | "info">("code");
  const router = useRouter();

  const industries = [
    { value: "ecommerce", label: "电商出海" },
    { value: "manufacturing", label: "高端制造" },
    { value: "fmcg", label: "零售·快消" },
    { value: "service", label: "泛服务业" },
    { value: "software", label: "软件SaaS" },
    { value: "other", label: "其他矩阵" },
  ];

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setLoading(true);
    setError("");

    setTimeout(() => {
      setLoading(false);
      if (inviteCode !== "2026") {
        setError("授权凭证无效 / AUTHORIZATION FAILED");
        return;
      }
      setStep("info");
    }, 800);
  }

  async function handleInfoSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !company.trim() || !industry) return;
    setLoading(true);
    setError("");

    setTimeout(() => {
      setLoading(false);
      router.push("/tools");
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center px-12 md:px-24 lg:px-32 py-20 relative overflow-hidden font-sans">
       <Link href="/" className="absolute top-12 left-12 md:left-16 lg:left-24 text-[#9E9B96] font-mono text-sm tracking-wide hover:text-[#D97706] transition-colors flex items-center gap-2 uppercase">
          <ArrowLeft size={16} /> 返回首页
       </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="mb-24">
          <h1 className="text-4xl md:text-6xl font-black text-[#2D2A26] tracking-normal leading-tight mb-6">
            {step === "code" ? "权限核验。" : "定义您的身份。"}
          </h1>
          <p className="text-xl text-[#9E9B96] tracking-normal">
            {step === "code"
              ? "闭门实测接口 / 仅限持有凭证受邀名单。"
              : "输入参数 / 获取针对贵公司模型方案的最佳预训练数据。"}
          </p>
        </div>

        {step === "code" ? (
          <form onSubmit={handleCodeSubmit} className="space-y-20">
            <div className="relative group">
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="PROTOTYPE-CODE"
                className="w-full bg-transparent border-0 border-b-2 border-[#E5E1D8] pb-4 text-4xl md:text-5xl font-mono text-[#2D2A26] placeholder-[#C5C0B8] focus:ring-0 focus:outline-none focus:border-[#D97706] transition-colors text-center tracking-[0.2em] md:tracking-[0.5em]"
                maxLength={8}
                autoFocus
              />
            </div>

            {error && (
              <p className="text-lg text-red-500 font-mono tracking-wide text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !inviteCode.trim()}
              className="w-full sm:w-auto mx-auto flex items-center justify-center gap-8 py-5 px-14 border-2 border-[#E5E1D8] hover:border-[#D97706] hover:bg-white transition-all disabled:opacity-30 group text-xl font-bold uppercase tracking-wide text-[#6B6660] hover:text-[#D97706] rounded-2xl"
            >
               {loading ? "VERIFYING..." : "ENTER AUTH"}
               {!loading && <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />}
            </button>
          </form>
        ) : (
          <form onSubmit={handleInfoSubmit} className="space-y-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-16"
            >
              <div className="grid md:grid-cols-2 gap-14">
                 <div>
                    <label className="block text-sm font-mono tracking-wide text-[#9E9B96] mb-5 uppercase">Commander</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="真实姓名"
                      className="w-full bg-transparent border-0 border-b-2 border-[#E5E1D8] pb-4 text-2xl text-[#2D2A26] placeholder-[#C5C0B8] focus:ring-0 focus:outline-none focus:border-[#D97706] transition-colors"
                      autoFocus
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-mono tracking-wide text-[#9E9B96] mb-5 uppercase">Vessel</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="公司全称"
                      className="w-full bg-transparent border-0 border-b-2 border-[#E5E1D8] pb-4 text-2xl text-[#2D2A26] placeholder-[#C5C0B8] focus:ring-0 focus:outline-none focus:border-[#D97706] transition-colors"
                    />
                 </div>
              </div>
              
              <div>
                <label className="block text-sm font-mono tracking-wide text-[#9E9B96] mb-8 uppercase">Operating Domain</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  {industries.map((ind) => (
                    <button
                      key={ind.value}
                      type="button"
                      onClick={() => setIndustry(ind.value)}
                      className={`py-5 px-12 text-xl tracking-normal font-black transition-all rounded-2xl ${
                        industry === ind.value
                          ? "bg-[#D97706] text-white border-2 border-[#D97706] scale-[1.02] shadow-lg"
                          : "border-2 border-[#E5E1D8] text-[#6B6660] hover:border-[#D97706] hover:text-[#D97706]"
                      }`}
                    >
                      {ind.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {error && (
              <p className="text-lg text-red-500 font-mono tracking-wide">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !name.trim() || !company.trim() || !industry}
              className="w-full flex items-center justify-center gap-8 py-6 bg-[#D97706] text-white hover:bg-[#B45309] transition-colors disabled:opacity-30 disabled:cursor-not-allowed group text-2xl font-black uppercase tracking-normal rounded-2xl"
            >
              {loading ? "INITIALIZING..." : "LAUNCH CONTROL MODULE"}
              {!loading && <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />}
            </button>
          </form>
        )}
      </motion.div>

      <div className="absolute bottom-10 left-12 md:left-16 lg:left-24 text-[#C5C0B8] font-mono text-xs uppercase tracking-[0.3em]">
        SESSION VER / 2026.04
      </div>
    </div>
  );
}
