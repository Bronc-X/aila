"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface TokenGateProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TokenGate({ isOpen, onClose }: TokenGateProps) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) return;
    setLoading(true);
    setError("");

    setTimeout(() => {
      setLoading(false);
      if (token !== "2049") {
        setError("TOKEN 验证失败 / ACCESS DENIED");
        return;
      }
      onClose();
      router.push("/slides");
    }, 600);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-6"
          style={{ background: "rgba(250, 249, 246, 0.97)" }}
        >
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 md:top-12 md:right-12 w-12 h-12 flex items-center justify-center rounded-xl border border-[#E5E1D8] text-[#9E9B96] hover:text-[#2D2A26] hover:border-[#2D2A26] transition-colors"
          >
            <X size={20} />
          </button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="w-full max-w-xl text-center"
          >
            <div className="w-16 h-16 mx-auto mb-10 flex items-center justify-center rounded-2xl bg-[#FFF7ED] border border-[#FDDCAB]">
              <ShieldCheck size={28} className="text-[#D97706]" />
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-[#2D2A26] tracking-normal mb-5">
              讲演通行验证
            </h2>
            <p className="text-lg text-[#9E9B96] tracking-normal mb-16">
              该模块仅限授权讲师使用，请输入讲演 Token。
            </p>

            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="relative">
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value.toUpperCase())}
                  placeholder="ENTER TOKEN"
                  className="w-full bg-transparent border-0 border-b-2 border-[#E5E1D8] pb-4 text-4xl md:text-5xl font-mono text-[#2D2A26] placeholder-[#C5C0B8] focus:ring-0 focus:outline-none focus:border-[#D97706] transition-colors text-center tracking-[0.3em]"
                  maxLength={8}
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-lg text-red-500 font-mono tracking-wide">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !token.trim()}
                className="mx-auto flex items-center justify-center gap-6 py-5 px-14 border-2 border-[#E5E1D8] hover:border-[#D97706] hover:bg-white transition-all disabled:opacity-30 group text-xl font-bold uppercase tracking-wide text-[#6B6660] hover:text-[#D97706] rounded-2xl"
              >
                {loading ? "VERIFYING..." : "AUTHENTICATE"}
                {!loading && <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
