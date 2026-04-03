import { ArrowUpRight } from 'lucide-react'
import BlurText from './BlurText'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    >
      {/* 恢复你最早心心念念的 Cloudfront "花花" mp4 原版背景视频 */}
      <video
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: '20%',
          width: '100%',
          height: 'auto',
          objectFit: 'contain',
          zIndex: 0,
        }}
      />

      {/* 按照你原版的遮罩渐变 */}
      <div
        style={{
          position: 'absolute',
          inset: '0',
          background: 'rgba(0,0,0,0.05)',
          zIndex: 0
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '300px',
          background: 'linear-gradient(to bottom, transparent, black)',
          zIndex: 1,
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '1152px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
          marginTop: '64px',
        }}
      >
        <div
          className="liquid-glass"
          style={{
            borderRadius: '9999px',
            padding: '4px 14px',
            fontSize: '12px',
            fontWeight: 500,
            color: '#fff',
            fontFamily: "'Barlow', sans-serif",
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '32px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#fff',
              display: 'inline-block',
              boxShadow: '0 0 8px rgba(255,255,255,0.8)',
            }}
          />
          高价值·高回报企业 AI 服务
        </div>

        <div
          className="font-heading"
          style={{
            fontSize: 'clamp(4rem, 9vw, 7.5rem)',
            color: '#fff',
            letterSpacing: '-2px',
            lineHeight: 0.9,
            marginBottom: '40px',
            maxWidth: '1000px',
          }}
        >
          <BlurText text="用AI重构" />
          <br />
          <BlurText
            text="企业核心竞争力。"
            delay={0.2}
            style={{ color: 'rgba(255,255,255,0.7)' }}
          />
        </div>

        <p
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            color: 'rgba(255,255,255,0.8)',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            maxWidth: '720px',
            marginBottom: '48px',
            lineHeight: 1.6,
          }}
        >
          IDE级编程构建应用 · 百位专家Agent集群 · 企业数字资产知识库 · 零感系统接入。
          <br /><br />我们不是卖软件，而是用生产级全栈方案直接帮您重构利润链条与效能体系。
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <Link to="/pricing" style={{ textDecoration: 'none' }}>
            <button
              className="liquid-glass-strong"
              style={{
                borderRadius: '9999px',
                padding: '16px 32px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 600,
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px',
              }}
            >
              立刻抢占席位
              <ArrowUpRight style={{ width: '18px', height: '18px' }} />
            </button>
          </Link>
          <Link to="/cases" style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderRadius: '9999px',
                padding: '16px 32px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 500,
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                fontSize: '15px',
                transition: 'background 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            >
              验证真实效率
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
