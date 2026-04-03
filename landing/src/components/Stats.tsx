import { motion } from 'framer-motion'
import HlsVideo from './HlsVideo'
import { Link } from 'react-router-dom'

const stats = [
  { value: '60x', label: '营销内容矩阵产出效率' },
  { value: '56x', label: '竞品研报与分析速度' },
  { value: '40x', label: '重度会议纪要提取效率' },
  { value: '8x', label: '全天候数字客服产能释放' },
]

export default function Stats() {
  return (
    <section style={{ position: 'relative', padding: '128px 24px' }}>
      {/* 背景 HLS 视频 */}
      <HlsVideo
        src="https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          filter: 'saturate(0)',
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

      {/* Stats Card */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1024px', margin: '0 auto', textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="font-heading" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff', lineHeight: 0.9 }}>
             同样的任务，<br/><span style={{ color: '#D97706' }}>效率差了多少。</span>
          </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="liquid-glass"
        style={{
          position: 'relative',
          zIndex: 10,
          borderRadius: '24px',
          padding: '64px',
          maxWidth: '1024px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            textAlign: 'center',
          }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div
                className="font-heading"
                style={{
                  fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                  color: '#D97706',
                  marginBottom: '12px',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 500,
                  fontSize: '15px',
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', marginTop: '48px' }}>
         <Link to="/cases" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', textDecoration: 'underline' }}>查看各行业量化落地数据</Link>
      </div>
    </section>
  )
}
