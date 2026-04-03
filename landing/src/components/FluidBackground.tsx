import React from 'react'
import { motion } from 'framer-motion'

interface FluidBackgroundProps {
  colors?: string[]
}

export default function FluidBackground({
  colors = ['rgba(217,119,6,0.15)', 'rgba(234,88,12,0.1)', 'rgba(75,85,99,0.1)'],
}: FluidBackgroundProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      <motion.div
        animate={{
          x: ['-10%', '15%', '-5%', '-10%'],
          y: ['-10%', '5%', '15%', '-10%'],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '50vw',
          height: '50vw',
          background: `radial-gradient(circle, ${colors[0]} 0%, transparent 70%)`,
          filter: 'blur(60px)',
          borderRadius: '50%',
        }}
      />
      <motion.div
        animate={{
          x: ['5%', '-15%', '10%', '5%'],
          y: ['15%', '-5%', '-10%', '15%'],
          scale: [0.9, 1.1, 1, 0.9],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          top: '30%',
          right: '5%',
          width: '45vw',
          height: '45vw',
          background: `radial-gradient(circle, ${colors[1]} 0%, transparent 60%)`,
          filter: 'blur(80px)',
          borderRadius: '50%',
        }}
      />
      <motion.div
        animate={{
          x: ['10%', '-5%', '-20%', '10%'],
          y: ['10%', '20%', '0%', '10%'],
          scale: [1.1, 0.9, 1.2, 1.1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '25%',
          width: '60vw',
          height: '60vw',
          background: `radial-gradient(circle, ${colors[2]} 0%, transparent 70%)`,
          filter: 'blur(100px)',
          borderRadius: '50%',
        }}
      />
      {/* 遮罩，让上下边缘自然过渡到全黑 */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '150px',
          background: 'linear-gradient(to bottom, #000, transparent)',
          zIndex: 1
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '150px',
          background: 'linear-gradient(to top, #000, transparent)',
          zIndex: 1
        }}
      />
    </div>
  )
}
