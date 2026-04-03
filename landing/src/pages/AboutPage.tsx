import React from 'react'
import FluidBackground from '../components/FluidBackground'

export default function AboutPage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 深色灰黑色系流体背景，显稳重专业 */}
      <FluidBackground colors={['rgba(217, 119, 6, 0.08)', 'rgba(156, 163, 175, 0.1)', 'rgba(31, 41, 55, 0.2)']} />

      <div style={{ position: 'relative', zIndex: 10, paddingTop: '150px', paddingBottom: '100px', maxWidth: '800px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
        <h1 className="font-heading" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', color: '#fff', marginBottom: '24px', lineHeight: 0.9, textAlign: 'center' }}>
          关于 AILA 认知编辑部
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', lineHeight: 1.7, marginBottom: '64px', textAlign: 'center' }}>
          我们相信，算力的尽头是认知的比拼。
        </p>

        <div className="liquid-glass" style={{ borderRadius: '24px', padding: '48px', marginBottom: '48px', background: 'rgba(255,255,255,0.03)' }}>
          <h2 className="font-heading" style={{ fontSize: '32px', color: '#fff', marginBottom: '24px' }}>团队介绍</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: '15px', marginBottom: '24px' }}>
            [团队介绍占位符：此处可补充 AILA 核心团队的背景、技术研发实力、以及对企业级AI交付的愿景。]
          </p>
        </div>
        
        <div className="liquid-glass" style={{ borderRadius: '24px', padding: '48px', background: 'rgba(255,255,255,0.03)' }}>
          <h2 className="font-heading" style={{ fontSize: '32px', color: '#fff', marginBottom: '24px' }}>我们的使命</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: '15px' }}>
            帮助中国极具创新精神的实体企业与数字新锐，跨越 AI 落地的鸿沟。通过提供最前沿的技术架构与极速交付模式，让"超级个体"与"高能团队"在各行各业批量涌现。
          </p>
        </div>
      </div>
    </div>
  )
}
