"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="snap-section relative z-10 flex flex-col items-center justify-center min-h-[60vh] p-8 bg-[#050505]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 1 }}
        className="max-w-4xl mx-auto text-center space-y-6"
      >
        <p className="text-xs font-mono text-neutral-500 tracking-[0.3em] uppercase">
          Agent Architecture × Cross-Domain Engineering
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[0.95]">
          Toni Studio.
        </h1>
        <p className="text-base md:text-lg text-neutral-400 font-mono max-w-2xl mx-auto leading-relaxed">
          一个跨界工程团队。我们同时掌握 iOS 原生开发、企业级全链路 Agent 部署与 A 股分钟级量化策略工程。
          以下是三个独立项目，每一个都在各自的垂直领域建立了不可替代的技术与商业壁垒。
        </p>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="h-px w-48 bg-gradient-to-r from-transparent via-neutral-600 to-transparent mx-auto mt-8"
        />
      </motion.div>
    </section>
  );
}
