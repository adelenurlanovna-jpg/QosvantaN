'use client'

import { useEffect, useRef } from 'react'

interface Thread {
  y0: number; cy1x: number; cy1y: number; cy2x: number; cy2y: number; y1: number
  speed: number; alpha: number; width: number; colorIdx: number; phaseOffset: number
}

const THREADS: Thread[] = [
  { y0: 0.08, cy1x: 0.25, cy1y: 0.32, cy2x: 0.75, cy2y: 0.05, y1: 0.18, speed: 0.25, alpha: 0.45, width: 1.2, colorIdx: 0, phaseOffset: 0.0 },
  { y0: 0.28, cy1x: 0.30, cy1y: 0.06, cy2x: 0.70, cy2y: 0.50, y1: 0.40, speed: 0.18, alpha: 0.35, width: 0.9, colorIdx: 1, phaseOffset: 1.3 },
  { y0: 0.50, cy1x: 0.25, cy1y: 0.72, cy2x: 0.75, cy2y: 0.28, y1: 0.62, speed: 0.20, alpha: 0.30, width: 0.7, colorIdx: 2, phaseOffset: 2.5 },
  { y0: 0.68, cy1x: 0.40, cy1y: 0.44, cy2x: 0.60, cy2y: 0.84, y1: 0.78, speed: 0.28, alpha: 0.40, width: 1.0, colorIdx: 0, phaseOffset: 0.7 },
  { y0: 0.85, cy1x: 0.20, cy1y: 0.65, cy2x: 0.80, cy2y: 0.95, y1: 0.90, speed: 0.16, alpha: 0.25, width: 0.6, colorIdx: 3, phaseOffset: 1.9 },
  { y0: 0.20, cy1x: 0.50, cy1y: 0.65, cy2x: 0.50, cy2y: 0.12, y1: 0.35, speed: 0.14, alpha: 0.22, width: 0.5, colorIdx: 1, phaseOffset: 3.1 },
  { y0: 0.55, cy1x: 0.15, cy1y: 0.35, cy2x: 0.85, cy2y: 0.70, y1: 0.48, speed: 0.22, alpha: 0.32, width: 0.8, colorIdx: 2, phaseOffset: 0.4 },
  { y0: 0.38, cy1x: 0.45, cy1y: 0.80, cy2x: 0.55, cy2y: 0.20, y1: 0.25, speed: 0.15, alpha: 0.22, width: 0.5, colorIdx: 3, phaseOffset: 2.2 },
]

// blue, indigo, violet, cyan
const COLORS: [number, number, number][] = [
  [59, 130, 246],
  [99, 102, 241],
  [124, 58, 237],
  [6, 182, 212],
]

export default function RoutingLines({ dark = false }: { dark?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let t = 0
    let W = 0, H = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      t += 0.004

      THREADS.forEach((th) => {
        const phase = t * th.speed + th.phaseOffset
        const wY = Math.sin(phase) * 0.065
        const wY2 = Math.cos(phase * 0.72 + 0.5) * 0.045
        const wC1 = Math.sin(phase * 0.58 + 1.0) * 0.05
        const wC2 = Math.cos(phase * 0.48 + 2.0) * 0.05

        const x0 = -30, x3 = W + 30
        const x1 = W * th.cy1x, x2 = W * th.cy2x
        const y0 = (th.y0 + wY) * H
        const y3 = (th.y1 + wY2) * H
        const y1 = (th.cy1y + wC1) * H
        const y2 = (th.cy2y + wC2) * H

        const [r, g, b] = COLORS[th.colorIdx]
        const alphaMultiplier = dark ? 1.4 : 1.0

        // Outer glow
        ctx.save()
        ctx.shadowColor = `rgba(${r},${g},${b},${0.4 * alphaMultiplier})`
        ctx.shadowBlur = 16
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3)
        ctx.strokeStyle = `rgba(${r},${g},${b},${th.alpha * 0.5 * alphaMultiplier})`
        ctx.lineWidth = th.width * 3
        ctx.lineCap = 'round'
        ctx.stroke()
        ctx.restore()

        // Inner glow
        ctx.save()
        ctx.shadowColor = `rgba(${r},${g},${b},0.25)`
        ctx.shadowBlur = 5
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3)
        ctx.strokeStyle = `rgba(${r},${g},${b},${th.alpha * 0.8 * alphaMultiplier})`
        ctx.lineWidth = th.width * 1.3
        ctx.lineCap = 'round'
        ctx.stroke()
        ctx.restore()

        // Core line
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3)
        ctx.strokeStyle = `rgba(${r},${g},${b},${th.alpha * alphaMultiplier})`
        ctx.lineWidth = th.width
        ctx.lineCap = 'round'
        ctx.stroke()
      })

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [dark])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
