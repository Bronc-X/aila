"use client";

import { motion } from "framer-motion";
import { Activity, Target, Lock, TrendingUp, Compass, Search, Flame, Shield } from "lucide-react";
import dynamic from 'next/dynamic';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false, loading: () => <div className="w-full h-full bg-neutral-900 animate-pulse rounded"></div> });

export default function Quant() {
  const getChartOptions = () => {
    const data = [];
    let base = 1;
    for (let i = 0; i < 200; i++) {
      if (i < 140) {
        base += (Math.random() - 0.48) * 0.08;
      } else if (i < 170) {
        base += Math.random() * 0.6 + 0.1;
      } else {
        base += (Math.random() - 0.3) * 0.4;
      }
      data.push(Math.max(0.2, base));
    }
    
    return {
      backgroundColor: 'transparent',
      animation: true,
      animationDuration: 3000,
      grid: { top: 20, right: 20, bottom: 20, left: 20 },
      xAxis: { type: 'category', show: false },
      yAxis: { type: 'value', show: false },
      series: [{
        data: data,
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#d4af37', width: 2, shadowColor: '#d4af37', shadowBlur: 10 },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(212,175,55,0.3)' }, { offset: 1, color: 'rgba(212,175,55,0)' }]
          }
        }
      }]
    };
  };

  return (
    <>
      {/* -------------------- QUANT PAGE 1: 边际影响力策略定义 -------------------- */}
      <section className="snap-section relative z-10 flex flex-col items-center justify-center min-h-screen p-8 bg-[#050505] border-t border-neutral-800/50">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
              <span className="text-xs font-mono text-neutral-400">边际影响力量化策略 (Marginal Effect Alpha)</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4">
              QuantMAx.
            </h2>
            <h3 className="text-xl font-mono text-[#d4af37] tracking-widest">在庄家布局的极早期入局</h3>
            
            <p className="text-sm text-neutral-400 leading-relaxed font-mono mt-8">
              A 股存在一个被绝大多数散户和传统量化忽视的模式：当一只股票从"无人关注"变成"热榜前列"的过程中，存在一个极短的加速窗口期——我们称之为"边际影响力奇点"。这个窗口通常意味着有主力资金正在建仓，但盘面上还没有明显的放量痕迹。
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed font-mono mt-4">
              QuantMAx 的核心策略就是用 Agent 自动扫描东方财富和雪球的实时热榜排名变化速率。当一只票的热度排名在短时间内发生剧烈跃升（从第 200 名三天内冲到前 50）而价格尚未同步反应时，系统判定边际影响力信号触发，自动计算 Alpha 打分并在庄家拉盘之前完成早期吸筹。
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative aspect-video rounded-xl border border-neutral-800 bg-[#0a0a0a] shadow-2xl overflow-hidden p-6 flex flex-col"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/5 via-transparent to-transparent" />
            
            <div className="flex justify-between items-center mb-6 relative z-10 border-b border-neutral-800 pb-4">
               <div className="flex items-center gap-3 text-[#d4af37]">
                 <TrendingUp className="w-5 h-5" />
                 <span className="font-mono text-sm tracking-widest font-bold">极化后净值曲线（策略不公开）</span>
               </div>
               <div className="flex gap-2">
                 <div className="w-2 h-2 rounded-full bg-red-500/20" />
                 <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                 <div className="w-2 h-2 rounded-full bg-green-500/20 animate-pulse" />
               </div>
            </div>

            <div className="flex-1 w-full relative z-10">
               <ReactECharts option={getChartOptions()} style={{ height: '100%', width: '100%' }} />
            </div>
            
            <div className="mt-4 pt-4 border-t border-neutral-800 w-full bg-black rounded font-mono text-[10px] text-[#d4af37]/80 leading-relaxed max-h-[80px] overflow-hidden">
               <div className="flex items-center gap-2 mb-1">
                 <Activity className="w-3 h-3" />
                 <span>QuantMAx Alpha Engine</span>
               </div>
               <p>[09:25] CRON: 拉取东财/雪球 Top50 热榜快照...</p>
               <p>[09:31] SIGNAL: 000XXX 热榜排名 72h 跃升 +160 位，价格滞后。边际信号触发。</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* -------------------- QUANT PAGE 2: 三刀策略引擎 + 风控 -------------------- */}
      <section className="snap-section relative z-10 flex flex-col items-center justify-center min-h-screen p-8 bg-neutral-900/60 backdrop-blur-md border-t border-neutral-800/50">
        <motion.div 
           className="max-w-6xl mx-auto w-full"
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: false, amount: 0.3 }}
           transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
             <div className="space-y-8">
                <h3 className="text-3xl text-white font-bold tracking-tight mb-6">闭源三层决策引擎</h3>
                
                <div className="relative pl-8 border-l-2 border-[#d4af37]/30 space-y-8">
                   <div className="absolute top-0 -left-[5px] w-2.5 h-2.5 rounded-full bg-[#d4af37]" />
                   <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Flame className="w-5 h-5 text-[#d4af37]" />
                        <h4 className="text-white font-bold">Alpha 打分层</h4>
                      </div>
                      <p className="text-neutral-400 font-mono text-sm leading-relaxed">
                         对每支标的在当前分钟的上涨潜力进行打分。融合了模型预测得分（HistGradientBoosting / LGBM）、热榜排名权重与主题前瞻加速因子。融合方式属于闭源核心。
                      </p>
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-[#d4af37]" />
                        <h4 className="text-white font-bold">过滤裁决层</h4>
                      </div>
                      <p className="text-neutral-400 font-mono text-sm leading-relaxed">
                         四道硬性过滤门禁：热榜 Top50 以内（保障流动性）、涨停板过滤 9.5%（规避一字板陷阱）、单分钟成交额 ≥ 200万（避免滑点放大）、Alpha 得分 &gt; 0（排除噪声）。
                      </p>
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-[#d4af37]" />
                        <h4 className="text-white font-bold">组合执行层</h4>
                      </div>
                      <p className="text-neutral-400 font-mono text-sm leading-relaxed">
                         通过过滤的标的按 Alpha 得分排序，取 Top 5 等权持仓。每 5 分钟重新计算一次。最大持有 60 分钟自动平仓。账户回撤触及 8% 立刻全仓清场。
                      </p>
                   </div>
                   <div className="absolute bottom-0 -left-[5px] w-2.5 h-2.5 rounded-full border border-neutral-700 bg-black" />
                </div>
             </div>
             
             <div className="bg-black/50 border border-neutral-800 rounded-2xl p-8">
                <h4 className="text-white font-bold text-lg mb-6">核心参数表（真实配置）</h4>
                <div className="space-y-3 font-mono text-sm">
                   {[
                     ["topk", "5", "最大同时持仓数"],
                     ["hot_topn", "50", "仅交易热榜前 N 名"],
                     ["min_amount_1m", "200万", "单分钟最小成交额"],
                     ["hold_minutes", "60", "最大持有时间（分钟）"],
                     ["rebalance", "5 min", "再平衡周期"],
                     ["max_drawdown", "8%", "账户回撤强制清仓线"],
                   ].map(([key, val, desc]) => (
                     <div key={key} className="flex items-center justify-between border-b border-neutral-800/50 pb-2">
                       <span className="text-[#d4af37]">{key}</span>
                       <span className="text-white font-bold">{val}</span>
                       <span className="text-neutral-600 text-xs hidden md:block">{desc}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* -------------------- QUANT PAGE 3: SaaS 商业模式 -------------------- */}
      <section className="snap-section relative z-10 flex flex-col items-center justify-center min-h-screen p-8 bg-[#050505] border-t border-neutral-800/50">
        <motion.div 
           className="max-w-5xl mx-auto w-full text-center space-y-12"
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: false, amount: 0.3 }}
           transition={{ duration: 1 }}
        >
          <Compass className="w-16 h-16 text-[#d4af37] mx-auto opacity-80" />
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-widest mb-6">
            三通道 SaaS 变现
          </h2>
          <p className="text-base text-neutral-400 font-mono leading-relaxed">
            我们不自己承担实盘风险去赌方向。我们卖的是策略信号的使用权。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
             <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 hover:border-[#d4af37] transition-colors">
                <span className="text-[#d4af37] font-mono text-xl block mb-4">QuantMAx Cloud</span>
                <h4 className="text-white font-bold text-lg mb-2">全托管信号订阅</h4>
                <p className="text-neutral-500 font-mono text-sm leading-relaxed">客户无需本地部署任何代码。登录云端后台配置参数，实时接收 Alpha 信号推送。客户只按月缴纳订阅费。我方掌握全部策略代码和数据生命权。</p>
             </div>
             <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 hover:border-[#d4af37] transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#d4af37]/10 rounded-bl-full" />
                <span className="text-[#d4af37] font-mono text-xl block mb-4">QuantMAx API</span>
                <h4 className="text-white font-bold text-lg mb-2">信号流接入</h4>
                <p className="text-neutral-500 font-mono text-sm leading-relaxed">已有交易系统的机构团队，仅订阅 API 信号流。通过 POST /v1/alpha 直接将 Top5 持仓权重推送至其老旧交易工作站。低延迟集成，不交出源码。</p>
             </div>
             <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 hover:border-[#d4af37] transition-colors">
                <span className="text-[#d4af37] font-mono text-xl block mb-4">Strategy SDK</span>
                <h4 className="text-white font-bold text-lg mb-2">框架授权</h4>
                <p className="text-neutral-500 font-mono text-sm leading-relaxed">大型机构购买开源底层框架（回测引擎 + 数据清洗 + QLib 导出），在自有服务器内拼装私有策略。我方收取高昂的框架授权年费。</p>
             </div>
          </div>
          
          <div className="mt-12 bg-neutral-900/30 border border-[#d4af37]/20 rounded-lg p-6 font-mono text-sm text-neutral-400 text-left max-w-2xl mx-auto">
            <Lock className="w-5 h-5 text-[#d4af37] inline mr-2" />
            <strong className="text-white">策略保护声明：</strong>本作品集展示的曲线经过极化处理，不反映真实收益倍率。闭源核心 <code className="text-[#d4af37]">quant_core/core_strategy.py</code> 永不开源。Alpha 打分的融合算法（乘法/加法/阈值权重）是我方绝密资产。可安排现场实盘演示，但绝不对外展示策略代码。
          </div>
        </motion.div>
      </section>
    </>
  );
}
