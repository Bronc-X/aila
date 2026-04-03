import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import FluidBackground from '../components/FluidBackground'

export default function PricingPage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 黄金色系的流体动画背景，体现高价值定价页属性 */}
      <FluidBackground colors={['rgba(217, 119, 6, 0.15)', 'rgba(252, 211, 77, 0.08)', 'rgba(69, 26, 3, 0.2)']} />

      <div style={{ position: 'relative', zIndex: 10, paddingTop: '150px', paddingBottom: '100px', maxWidth: '1152px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 className="font-heading" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', color: '#fff', marginBottom: '24px', lineHeight: 0.9 }}>
            重构核心竞争力的门票
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto', fontSize: '18px', lineHeight: 1.7 }}>
            我们提供经过市场验证的高价值落地通道，确保企业不走弯路。
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '40px', alignItems: 'start' }}>
          {/* Tier 1: 闭门会 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="liquid-glass" 
            style={{ borderRadius: '24px', padding: '48px', position: 'relative', overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}
          >
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '32px', marginBottom: '32px' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', display: 'inline-block', padding: '6px 16px', borderRadius: '9999px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '24px' }}>
                STEP 01
              </div>
              <h2 className="font-heading" style={{ fontSize: '32px', color: '#fff', marginBottom: '16px' }}>企业主闭门实战特训</h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span className="font-heading" style={{ fontSize: '48px', color: '#fff' }}>¥1,980</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>/ 席位</span>
              </div>
              <p style={{ color: '#D97706', fontSize: '14px', fontWeight: 'bold', marginTop: '12px' }}>★ 第一期仅开放 30 席</p>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '32px', fontSize: '15px' }}>
              两天一晚，高压输入。抛弃理论，直接拿着您企业的真实痛点进场，带走可落地的 AI SOP 改造方案。
            </p>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
              {['2026年AI前沿边界全景扫描', '五大行业案例深度拆解', '现场一对一痛点业务诊断', '员工思想改造与落地法则'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                  <CheckCircle2 style={{ color: '#D97706', width: '20px', height: '20px', flexShrink: 0 }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '16px' }}>扫码联系助教抢占特训营席位</p>
              <div style={{ width: '160px', height: '160px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                 {/* 替换为真实二维码图片 */}
                 <div style={{ color: 'rgba(255,255,255,0.2)' }}>QR CODE</div>
              </div>
            </div>
          </motion.div>

          {/* Tier 2: 企业内训部署 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="liquid-glass-strong" 
            style={{ borderRadius: '24px', padding: '48px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(217,119,6,0.3)', background: 'rgba(255,255,255,0.04)' }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(217,119,6,0.2) 0%, transparent 70%)', filter: 'blur(20px)' }} />
            
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '32px', marginBottom: '32px', position: 'relative', zIndex: 10 }}>
              <div style={{ background: '#D97706', display: 'inline-block', padding: '6px 16px', borderRadius: '9999px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '24px', color: '#fff' }}>
                STEP 02 : 深度定制
              </div>
              <h2 className="font-heading" style={{ fontSize: '32px', color: '#fff', marginBottom: '16px' }}>企业数字化深度内训与部署</h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span className="font-heading" style={{ fontSize: '48px', color: '#fff' }}>¥40,000</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', textDecoration: 'line-through' }}>¥60,000</span>
              </div>
              <p style={{ color: '#D97706', fontSize: '14px', fontWeight: 'bold', marginTop: '12px' }}>★ 早期体验价，仅限首批 5 家头部合作企业，之后将恢复至 ¥60,000 原价</p>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '32px', fontSize: '15px', position: 'relative', zIndex: 10 }}>
              不是卖课，也不是卖软件。我们提供直接下沉到您业务一线的 IDE 级定制化开发，和全员内训闭环交付。
            </p>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px', position: 'relative', zIndex: 10 }}>
              {['企业知识库与数字资产梳理注入', '部署百位数专属业务 Agent 集群', '飞书/钉钉等管理工具的 CLI 无痛接入', '全员实操落地内训，确保用得起来'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                  <ArrowRight style={{ color: '#D97706', width: '20px', height: '20px', flexShrink: 0 }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10 }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '16px' }}>扫码预约首席架构师前置沟通</p>
              <div style={{ width: '160px', height: '160px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(217,119,6,0.3)' }}>
                 {/* 替换为真实二维码图片 */}
                 <div style={{ color: 'rgba(255,255,255,0.2)' }}>QR CODE</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
