import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ChevronRight } from 'lucide-react'
import FluidBackground from '../components/FluidBackground'

const features = [
  {
    title: '基于 IDE 的生产级定制开发',
    description: '我们不卖玩具式的通用SaaS，也不是简单的低代码拼接。AILA技术团队直接深入企业业务内核，采用现代 IDE 级全栈编程（React/Node/Python），为您输出高性能、可扩展、生产级可商用的完整AI业务系统。',
  },
  {
    title: '百位级专家 Agent 集群，重构决策',
    description: '在企业的关键链路中部署超过百位的专业智能体——从实时监听销售转化痛点的"旁听分析师"，到精准提炼市场风向的"情报分析专家"；不再依赖单一聊天框，而是无缝运转的自动化决策蜂群。',
  },
  {
    title: '企业数字资产的 RAG 知识库灌注',
    description: '用最前沿的大模型技术（RAG），打通您企业过去十年沉淀的非结构化资产（邮件、SOP、图纸、历史工单）。让新员工第一天即可拥有一位无所不知、极其精准的数字导师。',
  },
  {
    title: '无痛接入企业办公中枢 (CLI 级原生)',
    description: '无论是飞书、钉钉还是企业微信。我们的服务提供 CLI 级别的底层对接集成方案，让员工不需要跳转繁复的新后台，直接在熟悉的聊天框或企业原生工作台中调用 AI 能力。0学习成本，直接提效。',
  },
]

export default function ServicesPage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 流体动画背景，深冷色调专家感 */}
      <FluidBackground colors={['rgba(56, 189, 248, 0.08)', 'rgba(52, 211, 153, 0.08)', 'rgba(30, 58, 138, 0.15)']} />
      
      <div style={{ position: 'relative', zIndex: 10, paddingTop: '150px', paddingBottom: '100px', maxWidth: '1152px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 className="font-heading" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', color: '#fff', marginBottom: '24px', lineHeight: 0.9 }}>
            重构核心壁垒
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto', fontSize: '18px', lineHeight: 1.7 }}>
            我们不是系统集成商，不是软件转销商。我们用专业工程思维为您构建生产级 AI 基础设施，重塑业务链。
          </p>
        </div>

        <div style={{ display: 'grid', gap: '32px' }}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="liquid-glass flex flex-col md:flex-row gap-8 items-start md:items-center"
              style={{ borderRadius: '24px', padding: '48px', position: 'relative', background: 'rgba(255,255,255,0.03)' }}
            >
              <div style={{ flexShrink: 0, width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(217,119,6,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <span className="font-heading" style={{ color: '#D97706', fontSize: '24px' }}>0{index + 1}</span>
              </div>
              
              <div style={{ flex: 1 }}>
                <h2 className="font-heading" style={{ fontSize: '32px', color: '#fff', marginBottom: '16px' }}>{feature.title}</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: 1.8 }}>
                  {feature.description}
                </p>
              </div>
              
              <div style={{ paddingLeft: '24px', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D97706', fontSize: '14px', fontWeight: 'bold' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px' }}/> 高价值输出
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D97706', fontSize: '14px', fontWeight: 'bold' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px' }}/> 企业级标配
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
         <div style={{ display: 'flex', justifyContent: 'center', marginTop: '64px' }}>
            <a href="/pricing" style={{ textDecoration: 'none' }}>
              <button className="liquid-glass-strong" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 40px', borderRadius: '9999px', border: 'none', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                 查看深度定制部署方案 <ChevronRight style={{ width: '20px', height: '20px' }}/>
              </button>
            </a>
         </div>
      </div>
    </div>
  )
}
