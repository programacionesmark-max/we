'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Node {
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
  size: number
  opacity: number
  pulsePhase: number
  pulseSpeed: number
}

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Node[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const scrollRef = useRef(0)
  const animFrameRef = useRef<number>(0)

  const createNodes = useCallback((width: number, height: number): Node[] => {
    const spacing = 80
    const cols = Math.ceil(width / spacing) + 2
    const rows = Math.ceil(height / spacing) + 2
    const nodes: Node[] = []

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * spacing + (row % 2 ? spacing / 2 : 0)
        const y = row * spacing
        nodes.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
          size: 1.2 + Math.random() * 1.2,
          opacity: 0.15 + Math.random() * 0.25,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.3 + Math.random() * 0.7,
        })
      }
    }
    return nodes
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = document.documentElement.scrollHeight
      nodesRef.current = createNodes(canvas.width, canvas.height)
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(document.documentElement)
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY + window.scrollY }
    }
    const handleScroll = () => { scrollRef.current = window.scrollY }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)

    const CONNECTION_DIST = 120
    const MOUSE_RADIUS = 200
    const MOUSE_FORCE = 0.8
    const RETURN_FORCE = 0.03
    const DAMPING = 0.92

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const viewTop = scrollRef.current
      const viewH = window.innerHeight
      const viewBottom = viewTop + viewH
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Cursor glow
      const cursorGlow = ctx.createRadialGradient(mx, my, 0, mx, my, 250)
      cursorGlow.addColorStop(0, 'rgba(255, 255, 255, 0.06)')
      cursorGlow.addColorStop(0.3, 'rgba(255, 255, 255, 0.03)')
      cursorGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = cursorGlow
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Secondary ambient glows
      const g1x = canvas.width * 0.2 + Math.sin(time * 0.0001) * 80
      const g1y = canvas.height * 0.3 + Math.cos(time * 0.00015) * 60
      const g1 = ctx.createRadialGradient(g1x, g1y, 0, g1x, g1y, 400)
      g1.addColorStop(0, 'rgba(255, 255, 255, 0.02)')
      g1.addColorStop(1, 'transparent')
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const g2x = canvas.width * 0.75 + Math.cos(time * 0.00012) * 100
      const g2y = canvas.height * 0.6 + Math.sin(time * 0.0002) * 70
      const g2 = ctx.createRadialGradient(g2x, g2y, 0, g2x, g2y, 350)
      g2.addColorStop(0, 'rgba(255, 255, 255, 0.018)')
      g2.addColorStop(1, 'transparent')
      ctx.fillStyle = g2
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update nodes
      const nodes = nodesRef.current
      for (const node of nodes) {
        // Mouse interaction
        const dx = node.x - mx
        const dy = node.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE
          const angle = Math.atan2(dy, dx)
          node.vx += Math.cos(angle) * force
          node.vy += Math.sin(angle) * force
        }

        // Return to base position
        node.vx += (node.baseX - node.x) * RETURN_FORCE
        node.vy += (node.baseY - node.y) * RETURN_FORCE

        // Damping
        node.vx *= DAMPING
        node.vy *= DAMPING

        // Apply velocity
        node.x += node.vx
        node.y += node.vy
      }

      // Draw connection lines (only for visible nodes)
      const visibleNodes: Node[] = []
      for (const node of nodes) {
        if (node.y > viewTop - CONNECTION_DIST && node.y < viewBottom + CONNECTION_DIST) {
          visibleNodes.push(node)
        }
      }

      for (let i = 0; i < visibleNodes.length; i++) {
        for (let j = i + 1; j < visibleNodes.length; j++) {
          const dx = visibleNodes[i].x - visibleNodes[j].x
          const dy = visibleNodes[i].y - visibleNodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.08

            // Check if line is near cursor for glow effect
            const midX = (visibleNodes[i].x + visibleNodes[j].x) / 2
            const midY = (visibleNodes[i].y + visibleNodes[j].y) / 2
            const cursorDist = Math.sqrt((midX - mx) ** 2 + (midY - my) ** 2)
            const cursorInfluence = cursorDist < MOUSE_RADIUS
              ? (1 - cursorDist / MOUSE_RADIUS) * 0.2
              : 0

            ctx.save()
            ctx.globalAlpha = alpha + cursorInfluence
            ctx.strokeStyle = `rgba(255, 255, 255, 1)`
            ctx.lineWidth = cursorInfluence > 0.05 ? 0.8 : 0.4
            ctx.beginPath()
            ctx.moveTo(visibleNodes[i].x, visibleNodes[i].y)
            ctx.lineTo(visibleNodes[j].x, visibleNodes[j].y)
            ctx.stroke()
            ctx.restore()
          }
        }
      }

      // Draw nodes
      for (const node of visibleNodes) {
        const pulse = 0.7 + 0.3 * Math.sin(time * 0.001 * node.pulseSpeed + node.pulsePhase)

        // Cursor proximity boost
        const cursorDist = Math.sqrt((node.x - mx) ** 2 + (node.y - my) ** 2)
        const cursorBoost = cursorDist < MOUSE_RADIUS
          ? (1 - cursorDist / MOUSE_RADIUS)
          : 0

        // Velocity-based intensity
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy)
        const speedBoost = Math.min(speed * 0.5, 0.4)

        const finalOpacity = node.opacity * pulse + cursorBoost * 0.6 + speedBoost
        const finalSize = node.size + cursorBoost * 3 + speedBoost * 2

        ctx.save()
        ctx.globalAlpha = finalOpacity
        ctx.fillStyle = 'rgba(255, 255, 255, 1)'
        ctx.beginPath()
        ctx.arc(node.x, node.y, finalSize, 0, Math.PI * 2)
        ctx.fill()

        // Extra glow ring when near cursor
        if (cursorBoost > 0.2) {
          ctx.globalAlpha = cursorBoost * 0.15
          ctx.strokeStyle = 'rgba(255, 255, 255, 1)'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(node.x, node.y, finalSize + 4 + cursorBoost * 8, 0, Math.PI * 2)
          ctx.stroke()
        }

        ctx.restore()
      }

      // Draw cursor crosshair lines
      if (mx > 0 && my > viewTop && my < viewBottom) {
        ctx.save()
        ctx.globalAlpha = 0.04
        ctx.strokeStyle = 'rgba(255, 255, 255, 1)'
        ctx.lineWidth = 0.5

        // Horizontal line
        ctx.beginPath()
        ctx.moveTo(0, my)
        ctx.lineTo(canvas.width, my)
        ctx.stroke()

        // Vertical line
        ctx.beginPath()
        ctx.moveTo(mx, viewTop)
        ctx.lineTo(mx, viewBottom)
        ctx.stroke()

        ctx.restore()
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      ro.disconnect()
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [createNodes])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
