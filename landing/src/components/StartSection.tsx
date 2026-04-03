import { ArrowUpRight } from 'lucide-react'
import HlsVideo from './HlsVideo'

export default function StartSection() {
  return (
    <section
      id="流程"
      style={{
        position: 'relative',
        width: '100%',
        padding: '128px 24px',
        minHeight: '700px',
      }}
    >
      {/* 背景 HLS 视频 */}
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

      {/* 顶部渐变遮罩 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          height: '200px',
          background: 'linear-gradient(to bottom, black, transparent)',
        }}
      />
      {/* 底部渐变遮罩 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          height: '200px',
          background: 'linear-gradient(to top, black, transparent)',
        }}
      />

      {/* 内容 */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          minHeight: '500px',
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
            display: 'inline-block',
            marginBottom: '16px',
          }}
        >
          运作流程
        </div>

        <h2
          className="font-heading"
          style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            color: '#fff',
            letterSpacing: '-1px',
            lineHeight: 0.9,
            marginBottom: '24px',
          }}
        >
          你负责构想，我们负责落地。
        </h2>

        <p
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            color: 'rgba(255,255,255,0.6)',
            fontSize: '14px',
            maxWidth: '560px',
            marginBottom: '40px',
            lineHeight: 1.7,
          }}
        >
          分享你的企业愿景。我们的AI接管一切——从痛点分析、方案设计、工具搭建到业务上线。
          以天为单位，不以季度计算。
        </p>

        <button
          className="liquid-glass-strong"
          style={{
            borderRadius: '9999px',
            padding: '12px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 500,
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '15px',
          }}
        >
          开始体验
          <ArrowUpRight style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
    </section>
  )
}
