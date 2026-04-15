"use client";

import { motion } from "framer-motion";
import { Mail, GitBranch as Github, MessageSquare } from "lucide-react";
import Image from "next/image";

export default function CTA() {
  return (
    <section className="snap-section relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-3xl mx-auto w-full text-center space-y-12"
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
          连网节点 (Connect)
        </h2>
        
        <p className="text-neutral-400 font-mono">
          开放深度技术架构讨论与高净值商业级 Agent 定制化合作。不设限，无边界。
        </p>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-12">
          
          <a href="mailto:Broncin@163.com" className="group flex items-center space-x-4 p-4 border border-neutral-800 rounded-xl hover:border-white transition-colors bg-neutral-900/50">
            <Mail className="w-8 h-8 text-neutral-400 group-hover:text-white" />
            <span className="font-mono text-white tracking-widest text-sm">Broncin@163.com</span>
          </a>

          <a href="https://github.com/Bronc-X" target="_blank" rel="noopener noreferrer" className="group flex items-center space-x-4 p-4 border border-neutral-800 rounded-xl hover:border-white transition-colors bg-neutral-900/50">
            <Github className="w-8 h-8 text-neutral-400 group-hover:text-white" />
            <span className="font-mono text-white tracking-widest text-sm">github.com/Bronc-X</span>
          </a>

        </div>

        <motion.div 
           initial={{ opacity: 0, filter: "blur(10px)" }}
           whileInView={{ opacity: 1, filter: "blur(0px)" }}
           transition={{ duration: 1.5, delay: 0.5 }}
           className="mt-16 flex flex-col items-center gap-4"
        >
          <div className="relative w-48 h-48 md:w-56 md:h-56 p-2 bg-white rounded-2xl shadow-2xl overflow-hidden group">
              <div className="w-full h-full relative flex items-center justify-center bg-neutral-100 rounded-xl">
                 <MessageSquare className="w-12 h-12 text-neutral-300 absolute" />
                 <img src="/wechat-qr.jpg" alt="WeChat QR" className="relative z-10 w-full h-full object-cover" />
              </div>
          </div>
          <p className="text-xs text-neutral-500 uppercase tracking-widest font-mono">微信名片直连 (WeChat Direct)</p>
        </motion.div>

      </motion.div>
    </section>
  );
}
