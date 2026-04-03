import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const features = [
  {
    title: 'IDE级专业工程：非低代码，全栈闭环',
    description:
      '基于现代开发者工具（IDE）定制开发的生产级系统。打通 API、前端交互与后端数据库。不是买一套复杂的 SaaS，而是为你量身定做的私人武器库。',
    buttonText: '探究开发内参',
    imageUrl: '/images/feature_marketing.png',
    reverse: false,
    link: '/services',
  },
  {
    title: '知识引擎：您的私有数字大脑',
    description:
      '利用 RAG（检索增强生成）技术，将企业过去十年的非结构化资产（邮件、SOP、图纸、历史工单）全部注入专属大脑。新员工第一天就能拥有全知的数字导师。',
    buttonText: '看它如何工作',
    imageUrl: '/images/feature_analytics.png',
    reverse: true,
    link: '/services',
  },
]

export default function FeaturesChess() {
  return (
    <section id="服务" style={{ padding: '96px 24px' }}>
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
          核心底座
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
          高价值服务，拒绝玩具。
        </h2>
      </div>

      {/* Chess Rows */}
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              display: 'flex',
              flexDirection: feature.reverse ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: '48px',
              marginBottom: index < features.length - 1 ? '96px' : 0,
            }}
          >
            {/* 文字区 */}
            <div style={{ flex: 1 }}>
              <h3
                className="font-heading"
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 1.875rem)',
                  color: '#fff',
                  letterSpacing: '-0.5px',
                  lineHeight: 0.95,
                  marginBottom: '24px',
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '14px',
                  lineHeight: 1.7,
                  marginBottom: '24px',
                }}
              >
                {feature.description}
              </p>
              <Link to={feature.link} style={{ textDecoration: 'none' }}>
                <button
                  className="liquid-glass-strong"
                  style={{
                    borderRadius: '9999px',
                    padding: '10px 24px',
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 500,
                    fontSize: '14px',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {feature.buttonText}
                </button>
              </Link>
            </div>

            {/* 图片区 */}
            <div className="liquid-glass" style={{ flex: 1, borderRadius: '16px', overflow: 'hidden' }}>
              <img
                src={feature.imageUrl}
                alt={feature.title}
                style={{ width: '100%', height: 'auto', objectFit: 'cover', aspectRatio: '3/2', display: 'block' }}
                loading="lazy"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
