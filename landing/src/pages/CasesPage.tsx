import React from 'react'
import { motion } from 'framer-motion'
import { Building2, FileText, Factory, ShoppingBag, Globe, Target } from 'lucide-react'
import FluidBackground from '../components/FluidBackground'

const cases = [
  {
    company: '亚朵酒店',
    icon: Building2,
    result: '年减30万调度工时 / 750万人工成本',
    title: '非标诉求的 AI 破局',
    desc: '引入 AI 打造智能双闭环系统。AI 直接作为总机的"智能耳目"，监听、理解客户录音/文字并秒级分发至保洁/维修工单系统。意图识别准确率从传统语音助手的60%飙升至现在的95%以上。',
  },
  {
    company: '四维图新',
    icon: FileText,
    result: '审核周期缩短 95%',
    title: 'AI合规审核颠覆传统效率',
    desc: '部署基于 RAG 的合规大模型，将企业内部合规库、法律案例、行业标准全量导入。AI 自动识别文本合规风险并给出建议。释放法务团队聚焦高价值战略规划，年节省外付律所费用¥200万+。',
  },
  {
    company: '宁德时代',
    icon: Factory,
    result: '制造偏差降50% / 原型设计缩短50%',
    title: '工业大模型重构产线精度',
    desc: '部署工业大模型对全工序传感器数据实时学习预测。当温度压力的微小偏移即将引发偏差时，AI提前200ms介入自适应调参。同时用生成式AI加速电芯原型设计。',
  },
  {
    company: '百果园',
    icon: ShoppingBag,
    result: '复购率提升35%',
    title: 'AI驱动的会员精细化运营',
    desc: '部署AI会员运营大脑，基于历史多维画像，为每个会员生成个性化触达方案。沉默会员激活率提升200%，精准推送打开率从3%飙升至18%。',
  },
  {
    company: '头部跨境电商',
    icon: Globe,
    result: '1分钟内 8国语言本地化',
    title: '无界产能重构',
    desc: '只需1套白底图，AI生成契合全球各地审美的场景海报。1分钟完成500 SKU符合当地SEO习惯的8国语言详情翻译，大幅降低开城时间和成本。',
  },
  {
    company: 'Salesforce',
    icon: Target,
    result: '销售获客时间占比从28%提升至65%',
    title: 'Agentforce 销售团队产能释放',
    desc: 'AI Agent 自动旁听会议提炼行动点、起草逼单邮件、预测关闭率。销售原本繁重耗时的系统录入与写跟进阶段被AI全盘接管，赢单率提升15%。',
  },
]

export default function CasesPage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 流体动画背景，红色/琥珀色系 */}
      <FluidBackground colors={['rgba(220, 38, 38, 0.12)', 'rgba(217, 119, 6, 0.1)', 'rgba(153, 27, 27, 0.15)']} />
      
      <div style={{ position: 'relative', zIndex: 10, paddingTop: '150px', paddingBottom: '100px', maxWidth: '1152px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 className="font-heading" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', color: '#fff', marginBottom: '24px', lineHeight: 0.9 }}>
            不谈概念，只看账本。
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto', fontSize: '18px', lineHeight: 1.7 }}>
            这些不是远景预测，而是已经在同业中上演的效率革命。不要等到利润被跨代际对手挤压，才开始重构您的武器库。
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
          {cases.map((c, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="liquid-glass" 
              style={{ borderRadius: '24px', padding: '40px', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.03)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '24px', marginBottom: '24px' }}>
                <div className="liquid-glass-strong" style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <c.icon style={{ color: '#fff', width: '24px', height: '24px' }} />
                </div>
                <div>
                  <h3 className="font-heading" style={{ fontSize: '24px', color: '#fff', letterSpacing: '0.5px' }}>{c.company}</h3>
                  <p style={{ color: '#D97706', fontSize: '13px', fontWeight: 'bold' }}>{c.result}</p>
                </div>
              </div>
              <h4 style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>{c.title}</h4>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 1.8 }}>{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
