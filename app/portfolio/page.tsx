"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Lock, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PortfolioGate() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() === "2026") {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#9E9B96] hover:text-[#2D2A26] transition-colors uppercase tracking-wide font-mono">
            <ArrowLeft size={14} /> 返回主页
          </Link>
          
          <div className="w-16 h-16 mx-auto bg-[#D97706]/10 rounded-2xl flex items-center justify-center">
            <Lock className="w-8 h-8 text-[#D97706]" />
          </div>
          
          <h1 className="text-4xl font-black text-[#2D2A26] tracking-tight">
            Toni Studio 作品集
          </h1>
          <p className="text-[#9E9B96] font-mono text-sm">
            输入访问码查看完整作品集
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(false); }}
              placeholder="请输入访问码"
              maxLength={6}
              className={`w-full text-center text-2xl font-mono font-bold tracking-[0.5em] px-6 py-4 rounded-xl border-2 bg-white outline-none transition-colors ${
                error ? 'border-red-400 text-red-500' : 'border-[#E5E1D8] focus:border-[#D97706] text-[#2D2A26]'
              }`}
            />
            {error && <p className="text-red-500 text-sm font-mono">访问码错误，请重试</p>}
            <button
              type="submit"
              className="w-full bg-[#D97706] text-white py-4 rounded-xl font-bold uppercase tracking-wide hover:bg-[#B45309] transition-colors flex items-center justify-center gap-2"
            >
              进入作品集 <ArrowRight size={16} />
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Top bar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E5E1D8] px-6 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center text-sm font-black bg-[#D97706] text-white rounded-lg">
            T
          </div>
          <span className="text-sm font-bold tracking-wide text-[#2D2A26] uppercase">Toni Studio · Portfolio</span>
        </Link>
        <div className="flex items-center gap-4 text-xs font-mono text-[#9E9B96] uppercase tracking-widest">
          <a href="#aila" className="hover:text-[#2D2A26] transition-colors">Aila</a>
          <a href="#antios" className="hover:text-[#2D2A26] transition-colors">Antios</a>
          <a href="#quant" className="hover:text-[#2D2A26] transition-colors">QuantMAx</a>
          <a href="#contact" className="hover:text-[#2D2A26] transition-colors">联系</a>
        </div>
      </nav>

      {/* Embedded portfolio via iframe from the standalone deployment */}
      <iframe
        src="http://localhost:3000"
        className="w-full border-0"
        style={{ height: 'calc(100vh - 57px)' }}
        title="Toni Studio Portfolio"
      />
    </div>
  );
}
