import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ChevronRight } from 'lucide-react'
import HlsVideo from '../components/HlsVideo'

const steps = [
  {
    num: '01',
    title: '战略诊断 (Day 1)',
    desc: '抛弃漫长的尽职调查。我们的首席架构师将直接进入您的核心业务数据室，用半天时间锁定当前"人力耗散最大"或"利润杠杆最高"的单一破局点。',
    tag: '定位切入点',
  },
  {
    num: '02',
    title: '架构设计与能力拼装 (Day 2-4)',
    desc: '基于诊断结果，设计您的专属 Agent 矩阵架构。确定需要连接哪些内部系统（如 ERP、CRM），需要萃取哪些专家经验录入 RAG 知识库。',
    tag: '蓝图确认',
  },
  {
    num: '03',
    title: 'IDE 级非标极速开发 (Week 2-3)',
    desc: '这绝非 SaaS 开账号。我们将启动专业编程环境，为您定制开发前端交互界面，并在后端打通各类大模型 API 与企业私有数据库，构筑真正的数字资产隔离墙。',
    tag: '闭门开发',
  },
  {
    num: '04',
    title: '系统级接入与内训落地 (Week 4)',
    desc: '将交付的系统以 CLI/小程序形式潜入您当前使用的办公软件（飞书/钉钉等）。随后进行全员闭门内训，消除员工对新工具的抗拒心理，实现 0 到 1 的认知跨越。',
    tag: '落地交付',
  },
]

export default function ProcessPage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 流程页使用暗度较深的 Mux 视频背景 */}
      <HlsVideo
        src="https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.6)', /* 较深遮罩让内容更清晰 */
          zIndex: 1,
        }}
      />

      <div style={{ position: 'relative', zIndex: 10, paddingTop: '150px', paddingBottom: '100px', maxWidth: '1152px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 className="font-heading" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', color: '#fff', marginBottom: '24px', lineHeight: 0.9 }}>
            以天计，不以月计。
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto', fontSize: '18px', lineHeight: 1.7 }}>
            摒弃传统 IT 采购模式半年起步的实施周期。我们的交付框架专为超越同行的超高速落地而生。
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          {/* 连接轴 (桌面端显示) */}
          <div style={{ display: 'none' }} className="md:block absolute top-[48px] bottom-[48px] left-[48px] w-[2px] bg-[rgba(255,255,255,0.1)] z-0" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="liquid-glass md:flex-row md:items-start md:ml-[24px]"
                style={{ borderRadius: '24px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', zIndex: 10, background: 'rgba(255,255,255,0.03)' }}
              >
                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '16px' }}>
                   <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <span className="font-heading" style={{ fontSize: '28px', color: '#D97706' }}>{step.num}</span>
                   </div>
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <h2 className="font-heading" style={{ fontSize: '28px', color: '#fff' }}>{step.title}</h2>
                    <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '4px', color: 'rgba(255,255,255,0.8)' }}>{step.tag}</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: 1.8 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
         <div style={{ display: 'flex', justifyContent: 'center', marginTop: '64px' }}>
            <a href="/pricing" style={{ textDecoration: 'none' }}>
              <button className="liquid-glass-strong" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 40px', borderRadius: '9999px', border: 'none', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                 启动战略诊断预约 <ChevronRight style={{ width: '20px', height: '20px' }}/>
              </button>
            </a>
         </div>
      </div>
    </div>
  )
}
