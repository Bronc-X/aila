import { motion } from 'framer-motion'
import HlsVideo from './HlsVideo'
import { Link } from 'react-router-dom'

export default function CtaFooter() {
  return (
    <section style={{ position: 'relative', padding: '128px 24px' }}>
      {/* 背景 HLS 视频 */}
      <HlsVideo
        src="https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />

      {/* 顶部渐变 */}
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
      {/* 底部渐变 */}
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

      {/* CTA 内容 */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <h2
          className="font-heading"
          style={{
            fontSize: 'clamp(3rem, 7vw, 4.5rem)',
            color: '#fff',
            letterSpacing: '-2px',
            lineHeight: 0.9,
            marginBottom: '24px',
          }}
        >
          留给观望者的窗口期<br/>仅剩不到 18 个月。
        </h2>
        <p
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            color: 'rgba(255,255,255,0.6)',
            fontSize: '14px',
            maxWidth: '540px',
            marginBottom: '40px',
            lineHeight: 1.7,
          }}
        >
          竞争对手的降本后的定价优势即将侵蚀全部利润空间。从报名这一期特训闭门会开始，把属于您的定价权和护城河夺回来。
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/pricing" style={{ textDecoration: 'none' }}>
            <button
              className="liquid-glass-strong"
              style={{
                borderRadius: '9999px',
                padding: '12px 32px',
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 500,
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px',
              }}
            >
              立刻预定席位
            </button>
          </Link>
          <Link to="/about" style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: '#fff',
                color: '#000',
                borderRadius: '9999px',
                padding: '12px 32px',
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px',
              }}
            >
              了解 AILA 编辑部
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Footer */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          marginTop: '128px',
          paddingTop: '32px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '12px',
            fontFamily: "'Barlow', sans-serif",
          }}
        >
          © 2026 AILA造浪营 · 重构核心壁垒
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/about" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', textDecoration: 'none' }}>关于我们</Link>
          <Link to="/pricing" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', textDecoration: 'none' }}>获取方案</Link>
        </div>
      </div>
    </section>
  )
}
