'use client'

import { useEffect, useRef } from 'react'

interface Thread {
  y0: number
  cy1x: number; cy1y: number
  cy2x: number; cy2y: number
  y1: number
  speed: number
  alpha: number
  width: number
  colorIdx: number
  phaseOffset: number
}

const THREADS: Thread[] = [
  { y0: 0.10, cy1x: 0.28, cy1y: 0.38, cy2x: 0.72, cy2y: 0.04, y1: 0.20, speed: 0.28, alpha: 0.60, width: 1.5, colorIdx: 0, phaseOffset: 0.0 },
  { y0: 0.30, cy1x: 0.32, cy1y: 0.06, cy2x: 0.68, cy2y: 0.54, y1: 0.44, speed: 0.20, alpha: 0.45, width: 1.0, colorIdx: 1, phaseOffset: 1.2 },
  { y0: 0.50, cy1x: 0.28, cy1y: 0.75, cy2x: 0.72, cy2y: 0.26, y1: 0.64, speed: 0.22, alpha: 0.38, width: 0.8, colorIdx: 2, phaseOffset: 2.4 },
  { y0: 0.66, cy1x: 0.38, cy1y: 0.44, cy2x: 0.62, cy2y: 0.84, y1: 0.80, speed: 0.32, alpha: 0.52, width: 1.3, colorIdx: 0, phaseOffset: 0.6 },
  { y0: 0.84, cy1x: 0.22, cy1y: 0.64, cy2x: 0.78, cy2y: 0.96, y1: 0.90, speed: 0.18, alpha: 0.32, width: 0.7, colorIdx: 3, phaseOffset: 1.8 },
  { y0: 0.18, cy1x: 0.50, cy1y: 0.68, cy2x: 0.50, cy2y: 0.10, y1: 0.34, speed: 0.15, alpha: 0.28, width: 0.6, colorIdx: 1, phaseOffset: 3.0 },
  { y0: 0.56, cy1x: 0.14, cy1y: 0.36, cy2x: 0.86, cy2y: 0.72, y1: 0.52, speed: 0.24, alpha: 0.44, width: 1.1, colorIdx: 2, phaseOffset: 0.3 },
  { y0: 0.40, cy1x: 0.44, cy1y: 0.82, cy2x: 0.56, cy2y: 0.18, y1: 0.24, speed: 0.17, alpha: 0.30, width: 0.65, colorIdx: 3, phaseOffset: 2.1 },
  { y0: 0.72, cy1x: 0.60, cy1y: 0.28, cy2x: 0.40, cy2y: 0.90, y1: 0.58, speed: 0.26, alpha: 0.36, width: 0.9, colorIdx: 0, phaseOffset: 1.5 },
]

// gold palette: mid, light, dark, classic
const COLORS: [number, number, number][] = [
  [201, 168, 76],
  [226, 201, 126],
  [184, 134, 11],
  [212, 175, 55],
]

export default function GoldenLines() {
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
      t += 0.005

      THREADS.forEach((th) => {
        const phase = t * th.speed + th.phaseOffset
        const wY = Math.sin(phase) * 0.07
        const wY2 = Math.cos(phase * 0.73 + 0.5) * 0.05
        const wC1 = Math.sin(phase * 0.6 + 1.0) * 0.055
        const wC2 = Math.cos(phase * 0.5 + 2.0) * 0.055

        const x0 = -40
        const x3 = W + 40
        const x1 = W * th.cy1x
        const x2 = W * th.cy2x
        const y0 = (th.y0 + wY) * H
        const y3 = (th.y1 + wY2) * H
        const y1 = (th.cy1y + wC1) * H
        const y2 = (th.cy2y + wC2) * H

        const [r, g, b] = COLORS[th.colorIdx]

        // outer glow
        ctx.save()
        ctx.shadowColor = `rgba(${r},${g},${b},0.55)`
        ctx.shadowBlur = 18
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3)
        ctx.strokeStyle = `rgba(${r},${g},${b},${th.alpha * 0.55})`
        ctx.lineWidth = th.width * 3.5
        ctx.lineCap = 'round'
        ctx.stroke()
        ctx.restore()

        // inner glow
        ctx.save()
        ctx.shadowColor = `rgba(${r},${g},${b},0.35)`
        ctx.shadowBlur = 6
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3)
        ctx.strokeStyle = `rgba(${r},${g},${b},${th.alpha * 0.85})`
        ctx.lineWidth = th.width * 1.5
        ctx.lineCap = 'round'
        ctx.stroke()
        ctx.restore()

        // crisp core line
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3)
        ctx.strokeStyle = `rgba(${r},${g},${b},${th.alpha})`
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
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
