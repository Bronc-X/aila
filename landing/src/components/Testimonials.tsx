import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const testimonials = [
  {
    quote:
      '两天时间内完成了整套企业AI工具的部署架构梳理。我们原本以为需要三个月，结果AILA团队的工程能力把时间极速压缩。团队效率直接翻倍，获客成本降低了60%。',
    name: '张明远',
    role: '制造业龙头 · 数字化负责人',
  },
  {
    quote:
      '我们不需要发面经一样的低难度内容。AILA的方案直接嵌入到我们的ERP节点。从批量生成营销素材到智能数据仪表盘，每一个Agent模型都命中了最烧钱的痛点。',
    name: '陈梦琪',
    role: '出海Top品牌 · 运营总监',
  },
  {
    quote:
      '不需要花一年时间重新培训新入职的分析师了。接驳了企业私有知识库的问答助手，能三秒钟提取去年的项目失败教训。这让公司终于拥有了不带偏见的硅基记忆。',
    name: '林修远',
    role: '某知名律所 · 高级合伙人',
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="案例" style={{ padding: '96px 24px', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
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
            他们怎么说
          </div>
          <h2
            className="font-heading"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: '#fff',
              letterSpacing: '-1px',
              lineHeight: 0.9,
            }}
          >
            不需要我们自夸。
          </h2>
        </div>

        {/* 宽屏下的单条轮流展示 / 为了和新主题更搭 */}
        <div style={{ position: 'relative', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{ position: 'absolute', width: '100%', maxWidth: '800px', textAlign: 'center' }}
            >
              <div 
                className="liquid-glass"
                style={{ 
                  borderRadius: '24px', 
                  padding: '48px', 
                  display: 'flex', 
                  flexDirection: 'column',
                  border: '1px solid rgba(217,119,6,0.2)'
                }}
              >
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.9)',
                      fontFamily: "'Noto Serif SC', serif", // 中式衬线突出版画感
                      fontWeight: 400,
                      fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                      fontStyle: 'italic',
                      lineHeight: 1.8,
                      marginBottom: '32px',
                    }}
                  >
                    "{testimonials[currentIndex].quote}"
                  </p>
                  <div>
                    <p
                      style={{
                        color: '#fff',
                        fontFamily: "'Barlow', sans-serif",
                        fontWeight: 600,
                        fontSize: '16px',
                        marginBottom: '4px',
                      }}
                    >
                      {testimonials[currentIndex].name}
                    </p>
                    <p
                      style={{
                        color: '#D97706',
                        fontFamily: "'Barlow', sans-serif",
                        fontWeight: 600,
                        fontSize: '13px',
                      }}
                    >
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 轮播指示器 */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
            {testimonials.map((_, i) => (
               <button
                 key={i}
                 onClick={() => setCurrentIndex(i)}
                 style={{
                   width: i === currentIndex ? '32px' : '12px',
                   height: '4px',
                   borderRadius: '4px',
                   background: i === currentIndex ? '#D97706' : 'rgba(255,255,255,0.2)',
                   border: 'none',
                   cursor: 'pointer',
                   transition: 'all 0.3s ease'
                 }}
                 aria-label={`Go to slide ${i + 1}`}
               />
            ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '64px' }}>
           <Link to="/about" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'underline', fontSize: '14px' }}>加入先行者序列</Link>
        </div>
      </div>
    </section>
  )
}
