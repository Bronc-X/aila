import { useRef, useEffect } from 'react'
import Hls from 'hls.js'

interface HlsVideoProps {
  src: string
  className?: string
  style?: React.CSSProperties
  muted?: boolean
  loop?: boolean
  autoPlay?: boolean
}

export default function HlsVideo({
  src,
  className = '',
  style = {},
  muted = true,
  loop = true,
  autoPlay = true,
}: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      })
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) {
          video.play().catch(() => {
            // 自动播放被浏览器阻止，静默处理
          })
        }
      })

      return () => {
        hls.destroy()
      }
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari 原生支持 HLS
      video.src = src
      if (autoPlay) {
        video.play().catch(() => {})
      }
    }
  }, [src, autoPlay])

  return (
    <video
      ref={videoRef}
      className={className}
      style={style}
      muted={muted}
      loop={loop}
      autoPlay={autoPlay}
      playsInline
    />
  )
}
