import { Zap, Palette, BarChart3, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

const cards = [
  {
    icon: Zap,
    title: '以天计，非以月计',
    description: '从概念到上线，重新定义快速的企业AI落地节奏。两天特训，即刻产出。',
  },
  {
    icon: Palette,
    title: '极致打磨',
    description: '每一个细节都被精心考虑。每一个元素都被反复锤炼。从获客到运营全链路设计。',
  },
  {
    icon: BarChart3,
    title: '为转化而生',
    description: '布局由数据驱动。决策由绩效支撑。AI监控每一次交互并实时优化。',
  },
  {
    icon: Shield,
    title: '企业级安全',
    description: '企业级保护标配而来。数据安全、隐私合规，零妥协。',
  },
]

export default function FeaturesGrid() {
  return (
    <section style={{ padding: '96px 24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
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
          为什么选择我们
        </div>
        <h2
          className="font-heading"
          style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            color: '#fff',
            letterSpacing: '-1px',
            lineHeight: 0.9,
          }}
        >
          差异，在于一切。
        </h2>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          maxWidth: '1152px',
          margin: '0 auto',
        }}
      >
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="liquid-glass"
            style={{
              borderRadius: '16px',
              padding: '24px',
              transition: 'background 0.3s',
            }}
          >
            <div
              className="liquid-glass-strong"
              style={{
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <card.icon style={{ width: '20px', height: '20px', color: '#fff' }} />
            </div>
            <h3
              className="font-heading"
              style={{ fontSize: '18px', color: '#fff', marginBottom: '8px' }}
            >
              {card.title}
            </h3>
            <p
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 300,
                fontSize: '14px',
                lineHeight: 1.7,
              }}
            >
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
