'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import {
  Rocket, Code2, Palette, TrendingUp, Shield, CheckCircle2,
  ArrowRight, ChevronDown, MessageCircle, Award,
  Calendar, FileCheck2, Sparkles, ExternalLink, Play, Layers,
  MonitorSmartphone, BarChart3, CreditCard, Timer, Wrench,
  Briefcase, Target, Mail, MapPin, Phone,
  Languages, Dumbbell, Zap, Database, Globe, Cpu, Lock,
  Smartphone, Server, GitBranch, Layout, Send, ChevronRight,
  Hexagon, Triangle, Diamond, RefreshCw, Headphones, ServerCog, X,
  HardDrive, ShieldCheck, Eye, Megaphone, PenTool, ShoppingCart,
  Globe2, Users, FileCode, Gauge, Crown, Scale,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import InteractiveBackground from '@/components/interactive-bg'
import { LanguageProvider, useLanguage, type Language } from '@/lib/i18n'

/* ─── Page Router State ─── */
type PageId = 'home' | 'servicios' | 'proyectos' | 'precios' | 'faq' | 'contacto'

type ContactPrefill = { project_type?: string; budget?: string } | null

/* ─── Back to Top Button ─── */
function BackToTop() {
  const { t } = useLanguage()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/60 hover:text-white transition-all backdrop-blur-md min-w-[44px] min-h-[44px]"
          aria-label={t.common.backToTop}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

/* ─── Scroll Progress Bar ─── */
function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handler = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return <div className="scroll-progress" style={{ width: `${progress}%` }} />
}

/* ─── Counter Animation ─── */
function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    const duration = 2000
    const startTime = performance.now()
    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, target])
  return <span ref={ref}>{prefix}{count}{suffix}</span>
}

/* ─── Stagger Container ─── */
function StaggerContainer({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: delay } } }}
      className={className}>
      {children}
    </motion.div>
  )
}

function StaggerItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={{
      hidden: { opacity: 0, y: 24, scale: 0.97 },
      visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
    }} className={className}>{children}</motion.div>
  )
}

function StaggerItemLeft({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={{
      hidden: { opacity: 0, x: -40 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
    }} className={className}>{children}</motion.div>
  )
}

function StaggerItemRight({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={{
      hidden: { opacity: 0, x: 40 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
    }} className={className}>{children}</motion.div>
  )
}

function StaggerItemScale({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={{
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring', stiffness: 200, damping: 20 } },
    }} className={className}>{children}</motion.div>
  )
}

/* ─── Parallax Section ─── */
function ParallaxSection({ children, className = '', speed = 0.1 }: { children: React.ReactNode; className?: string; speed?: number }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * -100])
  return <motion.section ref={ref} style={{ y }} className={className}>{children}</motion.section>
}

/* ─── Section Reveal ─── */
function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }} className={className}>{children}</motion.section>
  )
}

/* ─── Text Reveal ─── */
function TextReveal({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const words = text.split(' ')
  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span key={i}
          initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.4, delay: i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="inline-block mr-[0.3em]">{word}</motion.span>
      ))}
    </span>
  )
}

/* ─── Typewriter Effect ─── */
function TypewriterText({ texts, className = '' }: { texts: string[]; className?: string }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  useEffect(() => {
    const currentFullText = texts[currentTextIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentFullText.slice(0, displayText.length + 1))
        if (displayText === currentFullText) setTimeout(() => setIsDeleting(true), 2000)
      } else {
        setDisplayText(currentFullText.slice(0, displayText.length - 1))
        if (displayText === '') { setIsDeleting(false); setCurrentTextIndex((prev) => (prev + 1) % texts.length) }
      }
    }, isDeleting ? 30 : 80)
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentTextIndex, texts])
  return <span className={className}>{displayText}<span className="animate-blink">|</span></span>
}

/* ─── 3D Tilt Card (desktop only) ─── */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isDesktop] = useState(() => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 30 })
  const springY = useSpring(y, { stiffness: 300, damping: 30 })
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current || !isDesktop) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(((e.clientX - centerX) / (rect.width / 2)) * 6)
    y.set(((e.clientY - centerY) / (rect.height / 2)) * -6)
  }, [x, y, isDesktop])
  const handleMouseLeave = useCallback(() => { x.set(0); y.set(0) }, [x, y])
  if (!isDesktop) return <div className={className}>{children}</div>
  return (
    <motion.div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      style={{ rotateX: springY, rotateY: springX, transformPerspective: 1000 }} className={className}>
      {children}
    </motion.div>
  )
}

/* ─── Magnetic Button (desktop only) ─── */
function MagneticButton({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isDesktop] = useState(() => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 20 })
  const springY = useSpring(y, { stiffness: 200, damping: 20 })
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current || !isDesktop) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.2)
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.2)
  }, [x, y, isDesktop])
  const handleMouseLeave = useCallback(() => { x.set(0); y.set(0) }, [x, y])
  if (!isDesktop) return <div className={className}>{children}</div>
  return (
    <motion.div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }} className={className}>{children}</motion.div>
  )
}

/* ─── Text Scramble ─── */
function TextScramble({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [displayText, setDisplayText] = useState(text)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  useEffect(() => {
    if (!inView) return
    let iteration = 0
    const interval = setInterval(() => {
      setDisplayText(prev => text.split('').map((char, index) => {
        if (char === ' ') return ' '
        if (index < iteration) return text[index]
        return chars[Math.floor(Math.random() * chars.length)]
      }).join(''))
      iteration += 1 / 2
      if (iteration >= text.length) clearInterval(interval)
    }, 30)
    return () => clearInterval(interval)
  }, [inView, text])
  return <span ref={ref} className={className}>{displayText}</span>
}

/* ─── Floating Shapes (reusable animated decorations) ─── */
function FloatingShapes() {
  return (
    <>
      {/* Large rotating squares */}
      <motion.div animate={{ y: [-20, 20, -20], rotate: [0, 180, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[12%] left-[6%] w-16 h-16 border border-white/[0.06] rounded-xl pointer-events-none" />
      <motion.div animate={{ y: [15, -15, 15], rotate: [360, 180, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[22%] right-[10%] w-12 h-12 border border-white/[0.05] rounded-full pointer-events-none" />
      {/* Small dots */}
      <motion.div animate={{ y: [-10, 25, -10], x: [-5, 5, -5] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[30%] left-[15%] w-2 h-2 bg-white/[0.15] rounded-full pointer-events-none" />
      <motion.div animate={{ y: [10, -20, 10], x: [5, -5, 5] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[20%] right-[10%] w-1.5 h-1.5 bg-white/[0.12] rounded-full pointer-events-none" />
      {/* Diamonds */}
      <motion.div animate={{ y: [-15, 15, -15], rotate: [0, 90, 180, 270, 360] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[45%] left-[5%] w-8 h-8 border border-white/[0.04] rotate-45 pointer-events-none" />
      <motion.div animate={{ y: [20, -10, 20], rotate: [0, -90, -180, -270, -360] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[60%] right-[8%] w-6 h-6 border border-white/[0.05] rotate-45 pointer-events-none" />
      {/* Hexagons via SVG */}
      <motion.div animate={{ y: [-8, 12, -8], x: [3, -3, 3] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[35%] right-[20%] pointer-events-none">
        <Hexagon className="w-10 h-10 text-white/[0.04]" />
      </motion.div>
      {/* Triangles */}
      <motion.div animate={{ y: [12, -8, 12], rotate: [0, 120, 240, 360] }} transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-[40%] right-[25%] pointer-events-none">
        <Triangle className="w-8 h-8 text-white/[0.04]" />
      </motion.div>
      {/* Horizontal lines */}
      <motion.div animate={{ scaleX: [1, 1.3, 1], opacity: [0.03, 0.08, 0.03] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[50%] left-[10%] w-32 h-px bg-white/[0.04] pointer-events-none" />
      <motion.div animate={{ scaleX: [1, 0.7, 1], opacity: [0.04, 0.1, 0.04] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[70%] right-[15%] w-24 h-px bg-white/[0.05] pointer-events-none" />
      {/* Plus signs */}
      <motion.div animate={{ rotate: [0, 90, 180, 270, 360], scale: [1, 1.2, 1] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[75%] left-[25%] pointer-events-none text-white/[0.04] text-2xl font-light">+</motion.div>
      <motion.div animate={{ rotate: [360, 270, 180, 90, 0], scale: [1, 0.8, 1] }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[15%] right-[30%] pointer-events-none text-white/[0.05] text-xl font-light">+</motion.div>
      {/* Pulsing circles */}
      <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.03, 0.08, 0.03] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[55%] left-[40%] w-20 h-20 rounded-full border border-white/[0.03] pointer-events-none" />
      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.02, 0.06, 0.02] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[15%] left-[50%] w-32 h-32 rounded-full border border-white/[0.02] pointer-events-none" />
    </>
  )
}

/* ═══════════════════════════════════════════
   NAVBAR (multi-page)
   ═══════════════════════════════════════════ */
function Navbar({ currentPage, setPage }: { currentPage: PageId; setPage: (p: PageId) => void }) {
  const { t, lang, setLang } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const links: { label: string; page: PageId }[] = [
    { label: t.nav.home, page: 'home' },
    { label: t.nav.servicios, page: 'servicios' },
    { label: t.nav.proyectos, page: 'proyectos' },
    { label: t.nav.precios, page: 'precios' },
    { label: t.nav.faq, page: 'faq' },
    { label: t.nav.contacto, page: 'contacto' },
  ]

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navigate = (page: PageId) => {
    setPage(page)
    setMobileOpen(false)
  }

  const langButtons = (['es', 'en', 'nl'] as Language[]).map((l) => (
    <button
      key={l}
      onClick={() => setLang(l)}
      className={`w-8 h-8 rounded-full text-[11px] font-bold transition-all duration-200 min-w-[32px] min-h-[32px] flex items-center justify-center ${lang === l ? 'bg-white text-black' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
    >
      {l.toUpperCase()}
    </button>
  ))

  return (
    <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-white-strong shadow-lg shadow-black/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => navigate('home')} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
              <span className="text-sm font-bold text-white">W</span>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">WEBNOX</span>
          </button>
          <div className="hidden md:flex items-center gap-6">
            {links.map((link, i) => (
              <motion.button key={link.page} onClick={() => navigate(link.page)}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                className={`text-[13px] transition-colors duration-300 relative group tracking-wide uppercase ${currentPage === link.page ? 'text-white' : 'text-white/50 hover:text-white'}`}
                aria-current={currentPage === link.page ? 'page' : undefined}>
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-px bg-white/60 transition-all duration-300 ${currentPage === link.page ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </motion.button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1">{langButtons}</div>
            <MagneticButton>
              <Button size="sm" className="bg-white text-black hover:bg-white/90 border-0 font-medium"
                onClick={() => navigate('contacto')}>
                {t.nav.startProject} <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </MagneticButton>
          </div>
          <button className="md:hidden text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-white-strong border-t border-white/5">
            <div className="px-4 py-4 space-y-1">
              {links.map((link) => (
                <button key={link.page} onClick={() => navigate(link.page)}
                  className={`block text-base py-3 px-3 min-h-[44px] w-full text-left rounded-lg transition-colors ${currentPage === link.page ? 'text-white bg-white/[0.06] font-medium' : 'text-white/60 hover:text-white hover:bg-white/[0.03]'}`}>
                  {link.label}
                </button>
              ))}
              <div className="pt-3 border-t border-white/5 flex items-center gap-3">
                <div className="flex items-center gap-2">{langButtons}</div>
                <Button size="sm" className="flex-1 bg-white text-black border-0 font-medium min-h-[44px]"
                  onClick={() => navigate('contacto')}>{t.nav.startProject}</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

/* ═══════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════ */
function HomePage({ setPage }: { setPage: (p: PageId) => void; }) {
  const { t } = useLanguage()
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 sm:pt-16 overflow-hidden">
        <div className="hidden md:block"><FloatingShapes /></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <Badge variant="outline" className="mb-4 sm:mb-6 border-white/15 text-white/70 bg-white/5 px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs tracking-widest uppercase">
              <Sparkles className="w-3 h-3 mr-1.5" />{t.hero.badge}
            </Badge>
          </motion.div>
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}
            className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-4 sm:mb-6">
            <TextReveal text={t.hero.title1} />
            <br />
            <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}
              className="shimmer-text">{t.hero.title2}</motion.span>
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0 }}
            className="text-sm sm:text-base md:text-lg text-white/55 max-w-2xl mx-auto mb-4 leading-relaxed px-2">
            {t.hero.description}
          </motion.div>
          <motion.div key={t.hero.typewriter[0]} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.3 }}
            className="text-base sm:text-lg md:text-xl text-white/80 max-w-xl mx-auto mb-6 sm:mb-10 h-8">
            <TypewriterText texts={t.hero.typewriter} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-10 w-full sm:w-auto px-4 sm:px-0">
            <MagneticButton className="w-full sm:w-auto">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 border-0 px-6 sm:px-8 h-12 min-h-[44px] text-sm font-medium tracking-wide w-full sm:w-auto"
                onClick={() => setPage('contacto')}>
                {t.nav.startProject} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </MagneticButton>
            <MagneticButton className="w-full sm:w-auto">
              <a href="https://wa.me/31615893105?text=Hola%20Webnox%2C%20me%20gustar%C3%ADa%20agendar%20una%20llamada%20para%20hablar%20sobre%20mi%20proyecto" target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="outline" size="lg" className="border-white/15 text-white/70 hover:text-white hover:bg-white/5 px-6 sm:px-8 h-12 min-h-[44px] text-sm w-full">
                  <Calendar className="w-4 h-4 mr-2" />{t.nav.scheduleCall}
                </Button>
              </a>
            </MagneticButton>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.7 }}
            className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 glass-white rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm text-white/50 cursor-pointer hover:text-white/80 transition-colors group min-h-[44px]"
            onClick={() => setPage('contacto')}>
            <FileCheck2 className="w-4 h-4 text-white/40" />
            <span>{t.hero.notSure}</span>
            <span className="text-white/80 font-medium group-hover:underline">{t.hero.freeAudit}</span>
            <ArrowRight className="w-3 h-3 text-white/40 group-hover:translate-x-1 transition-transform" />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 1.9 }}
            className="mt-12 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-3xl mx-auto">
            {t.hero.stats.map((stat, i) => (
              <motion.div key={i} className="text-center"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 + i * 0.1, type: 'spring', stiffness: 200, damping: 20 }}>
                <div className="text-xl sm:text-3xl font-bold text-white/90">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[10px] sm:text-xs text-white/35 mt-1.5 tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
          className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-white/25">
            <span className="text-[10px] tracking-[0.2em] uppercase">{t.hero.scroll}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.div>
        </motion.div>
      </section>

      {/* SOCIAL PROOF - Real clients only */}
      <RevealSection className="py-10 sm:py-14 border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] sm:text-[11px] text-white/30 mb-6 sm:mb-8 tracking-[0.2em] uppercase">{t.socialProof.title}</p>
          <div className="flex items-center justify-center gap-8 sm:gap-16">
            <a href="https://markestein.es" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-white/25 hover:text-white/60 transition-colors group">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-lg font-semibold tracking-wider group-hover:tracking-widest transition-all">Markestein</span>
            </a>
            <a href="https://acontrabarra.es" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-white/25 hover:text-white/60 transition-colors group">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-lg font-semibold tracking-wider group-hover:tracking-widest transition-all">AContraBarra</span>
            </a>
          </div>
        </div>
      </RevealSection>

      {/* TESTIMONIALS */}
      <RevealSection className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="outline" className="mb-4 border-white/10 text-white/50 bg-white/5 text-[11px] tracking-widest uppercase">
              <MessageCircle className="w-3 h-3 mr-1.5" />{t.testimonials.badge}
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-bold mb-4 text-white"><TextReveal text={t.testimonials.title} /></h2>
          </div>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
            {t.testimonials.items.map((testimonial, i) => (
              <StaggerItem key={i}>
                <TiltCard className="h-full">
                  <Card className="white-card h-full border-white/[0.06] animated-gradient-border">
                    <CardContent className="p-5 sm:p-6">
                      <p className="text-white/50 text-sm leading-relaxed mb-5">"{testimonial.text}"</p>
                      <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                        <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-white/40 text-xs font-bold shrink-0">{testimonial.name.charAt(0)}</div>
                        <div>
                          <p className="text-xs font-medium text-white/80">{testimonial.name}</p>
                          <a href={testimonial.role === 'markestein.es' ? 'https://markestein.es' : testimonial.role === 'acontrabarra.es' ? 'https://acontrabarra.es' : undefined} target="_blank" rel="noopener noreferrer" className="text-[10px] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">
                            {testimonial.role} <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </RevealSection>

      {/* QUICK SERVICES OVERVIEW */}
      <RevealSection className="py-16 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-white/10 text-white/50 bg-white/5 text-[11px] tracking-widest uppercase">
              <Layers className="w-3 h-3 mr-1.5" />{t.servicesOverview.badge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white"><TextReveal text={t.servicesOverview.title} /></h2>
            <p className="text-white/40 max-w-xl mx-auto text-sm">{t.servicesOverview.subtitle}</p>
          </div>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[
              { icon: <Code2 className="w-5 h-5" />, title: t.servicesOverview.items[0].title, desc: t.servicesOverview.items[0].desc },
              { icon: <Palette className="w-5 h-5" />, title: t.servicesOverview.items[1].title, desc: t.servicesOverview.items[1].desc },
              { icon: <TrendingUp className="w-5 h-5" />, title: t.servicesOverview.items[2].title, desc: t.servicesOverview.items[2].desc },
              { icon: <Shield className="w-5 h-5" />, title: t.servicesOverview.items[3].title, desc: t.servicesOverview.items[3].desc },
              { icon: <MonitorSmartphone className="w-5 h-5" />, title: t.servicesOverview.items[4].title, desc: t.servicesOverview.items[4].desc },
              { icon: <BarChart3 className="w-5 h-5" />, title: t.servicesOverview.items[5].title, desc: t.servicesOverview.items[5].desc },
            ].map((service) => (
              <StaggerItem key={service.title}>
                <TiltCard className="h-full">
                  <Card className="white-card h-full group cursor-pointer border-white/[0.06] animated-gradient-border" onClick={() => setPage('servicios')}>
                    <CardHeader>
                      <motion.div className="w-10 h-10 rounded-xl bg-white/[0.06] group-hover:bg-white/[0.12] flex items-center justify-center text-white/60 group-hover:text-white/90 transition-all duration-300 mb-2"
                        whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}>
                        {service.icon}
                      </motion.div>
                      <CardTitle className="text-base font-semibold text-white/90 group-hover:text-white transition-colors">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/40 text-sm leading-relaxed">{service.desc}</p>
                      <div className="flex items-center gap-1 mt-3 text-[11px] text-white/30 group-hover:text-white/60 transition-colors">
                        <span>{t.servicesOverview.learnMore}</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
            className="text-center mt-10">
            <Button variant="outline" className="border-white/10 text-white/50 hover:text-white hover:bg-white/5"
              onClick={() => setPage('servicios')}>
              {t.servicesOverview.viewAll} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </div>
      </RevealSection>

      {/* HOME CTA */}
      <RevealSection className="py-14 sm:py-20 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div animate={{ scale: [1, 1.05, 1], rotate: [0, 3, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-6 sm:mb-8">
            <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-white/30" />
          </motion.div>
          <h2 className="text-2xl sm:text-5xl font-bold mb-4 sm:mb-6 text-white"><TextReveal text={t.homeCta.title} /></h2>
          <p className="text-white/40 text-sm sm:text-base mb-8 sm:mb-10 max-w-lg mx-auto px-2">{t.homeCta.description}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <MagneticButton className="w-full sm:w-auto">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 border-0 px-6 sm:px-8 h-12 min-h-[44px] text-sm font-medium w-full sm:w-auto"
                onClick={() => setPage('contacto')}>
                {t.nav.startProject} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </MagneticButton>
            <MagneticButton className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="border-white/15 text-white/60 hover:text-white hover:bg-white/5 px-6 sm:px-8 h-12 min-h-[44px] text-sm w-full sm:w-auto"
                onClick={() => setPage('precios')}>
                <CreditCard className="w-4 h-4 mr-2" />{t.homeCta.viewPrices}
              </Button>
            </MagneticButton>
          </div>
        </div>
      </RevealSection>
    </>
  )
}

/* ═══════════════════════════════════════════
   SERVICIOS PAGE
   ═══════════════════════════════════════════ */
function ServiciosPage({ setPage }: { setPage?: (p: PageId) => void }) {
  const { t } = useLanguage()
  const services = [
    { icon: <Code2 className="w-5 h-5" />, title: t.servicios.services[0].title, description: t.servicios.services[0].description, details: t.servicios.services[0].details },
    { icon: <Palette className="w-5 h-5" />, title: t.servicios.services[1].title, description: t.servicios.services[1].description, details: t.servicios.services[1].details },
    { icon: <TrendingUp className="w-5 h-5" />, title: t.servicios.services[2].title, description: t.servicios.services[2].description, details: t.servicios.services[2].details },
    { icon: <Shield className="w-5 h-5" />, title: t.servicios.services[3].title, description: t.servicios.services[3].description, details: t.servicios.services[3].details },
    { icon: <MonitorSmartphone className="w-5 h-5" />, title: t.servicios.services[4].title, description: t.servicios.services[4].description, details: t.servicios.services[4].details },
    { icon: <BarChart3 className="w-5 h-5" />, title: t.servicios.services[5].title, description: t.servicios.services[5].description, details: t.servicios.services[5].details },
  ]

  return (
    <div className="pt-20 sm:pt-24 pb-16 sm:pb-20">
      {/* Decorations */}
      <motion.div animate={{ y: [-12, 12, -12], rotate: [0, 90, 180, 270, 360] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[30%] right-[5%] w-10 h-10 border border-white/[0.04] rotate-45 pointer-events-none" />
      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.03, 0.08, 0.03] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[60%] left-[8%] w-24 h-24 rounded-full border border-white/[0.03] pointer-events-none" />
      <motion.div animate={{ y: [8, -8, 8] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[20%] right-[15%] pointer-events-none text-white/[0.04] text-2xl font-light">+</motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection className="mb-12 sm:mb-20">
          <Badge variant="outline" className="mb-4 border-white/10 text-white/50 bg-white/5 text-[11px] tracking-widest uppercase">
            <Layers className="w-3 h-3 mr-1.5" />{t.servicios.badge}
          </Badge>
          <h1 className="text-2xl sm:text-5xl font-bold mb-4 text-white"><TextReveal text={t.servicios.title} /></h1>
          <p className="text-white/40 max-w-xl text-sm leading-relaxed">{t.servicios.subtitle}</p>
        </RevealSection>

        <StaggerContainer className="space-y-6 sm:space-y-8">
          {services.map((service, i) => (
            <StaggerItemLeft key={service.title}>
              <TiltCard className="h-full">
                <Card className="white-card h-full border-white/[0.06] animated-gradient-border">
                  <div className="p-4 sm:p-8">
                    <div className="flex items-start gap-3 sm:gap-4 mb-4">
                      <motion.div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/[0.06] flex items-center justify-center text-white/60 shrink-0"
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1, transition: { duration: 0.4 } }}>
                        {service.icon}
                      </motion.div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-white/90 mb-2">{service.title}</h3>
                        <p className="text-white/40 text-sm leading-relaxed">{service.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-6 pt-6 border-t border-white/[0.06]">
                      {service.details.map((detail) => (
                        <div key={detail} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white/20 shrink-0" />
                          <span className="text-xs text-white/35">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </TiltCard>
            </StaggerItemLeft>
          ))}
        </StaggerContainer>

        {/* CTA Section */}
        <RevealSection className="mt-14 sm:mt-20 text-center">
          <div className="glass-white rounded-2xl p-6 sm:p-12">
            <h2 className="text-xl sm:text-3xl font-bold mb-4 text-white"><TextReveal text={t.servicios.ctaTitle} /></h2>
            <p className="text-white/40 text-sm mb-6 sm:mb-8 max-w-lg mx-auto px-2">{t.servicios.ctaSubtitle}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <MagneticButton className="w-full sm:w-auto">
                <Button size="lg" className="bg-white text-black hover:bg-white/90 border-0 px-6 sm:px-8 h-12 min-h-[44px] text-sm font-medium w-full sm:w-auto"
                  onClick={() => setPage?.('contacto')}>
                  {t.servicios.requestProposal} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </MagneticButton>
              <MagneticButton className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="border-white/15 text-white/60 hover:text-white hover:bg-white/5 px-6 sm:px-8 h-12 min-h-[44px] text-sm w-full sm:w-auto"
                  onClick={() => setPage?.('precios')}>
                  <CreditCard className="w-4 h-4 mr-2" />{t.homeCta.viewPrices}
                </Button>
              </MagneticButton>
            </div>
          </div>
        </RevealSection>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   PROYECTOS PAGE
   ═══════════════════════════════════════════ */
function ProyectosPage() {
  const { t } = useLanguage()
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const projects = [
    {
      title: t.proyectos.projects[0].title, subtitle: t.proyectos.projects[0].subtitle, category: t.proyectos.projects[0].category,
      description: t.proyectos.projects[0].description,
      tech: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'], url: 'https://markestein.es', icon: <Languages className="w-5 h-5" />,
      deliverables: t.proyectos.projects[0].deliverables,
      image: '/images/markestein.png',
      accent: 'from-blue-500/20 to-cyan-500/10',
    },
    {
      title: t.proyectos.projects[1].title, subtitle: t.proyectos.projects[1].subtitle, category: t.proyectos.projects[1].category,
      description: t.proyectos.projects[1].description,
      tech: ['React', 'Node.js', 'Stripe', 'Tailwind CSS'], url: 'https://acontrabarra.es', icon: <Dumbbell className="w-5 h-5" />,
      deliverables: t.proyectos.projects[1].deliverables,
      image: '/images/acontrabarra.png',
      accent: 'from-amber-500/20 to-rose-500/10',
    },
  ]

  return (
    <div className="pt-20 sm:pt-24 pb-16 sm:pb-20">
      <motion.div animate={{ y: [-10, 10, -10], rotate: [0, 180, 360] }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[25%] left-[5%] w-14 h-14 border border-white/[0.05] rounded-xl pointer-events-none" />
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.1, 0.04] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[30%] right-[10%] w-28 h-28 rounded-full border border-white/[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection className="mb-12 sm:mb-20">
          <Badge variant="outline" className="mb-4 border-white/10 text-white/50 bg-white/5 text-[11px] tracking-widest uppercase">
            <Briefcase className="w-3 h-3 mr-1.5" />{t.proyectos.badge}
          </Badge>
          <h1 className="text-2xl sm:text-5xl font-bold mb-4 text-white"><TextReveal text={t.proyectos.title} /></h1>
          <p className="text-white/40 max-w-lg text-sm leading-relaxed">{t.proyectos.subtitle}</p>
        </RevealSection>

        {/* Project Showcase - Immersive Layout */}
        <div className="space-y-10 sm:space-y-16">
          {projects.map((project, index) => (
            <RevealSection key={project.title}>
              <div
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/[0.08] group"
                onMouseEnter={() => setHoveredProject(index)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* Background gradient accent */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                <div className={`relative grid grid-cols-1 ${index % 2 === 0 ? 'lg:grid-cols-2' : 'lg:grid-cols-2 lg:direction-rtl'} gap-0`}>
                  {/* Image Side */}
                  <div className={`relative h-64 sm:h-80 lg:h-[420px] overflow-hidden ${index % 2 !== 0 ? 'lg:order-2' : ''}`}>
                    <img
                      src={project.image}
                      alt={`${project.title} website screenshot`}
                      className="w-full h-full object-cover object-top scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.06_0.005_280/0.95)] via-[oklch(0.06_0.005_280/0.5)] to-transparent lg:from-[oklch(0.06_0.005_280/0.8)] lg:via-transparent lg:to-transparent" />
                    {index % 2 !== 0 && (
                      <div className="absolute inset-0 bg-gradient-to-l from-[oklch(0.06_0.005_280/0.8)] via-transparent to-transparent lg:block hidden" />
                    )}
                    {/* Live badge on image */}
                    <div className="absolute top-4 left-4 sm:top-5 sm:left-5">
                      <Badge className="bg-green-500/20 text-green-400 border border-green-500/20 text-[10px] flex items-center gap-1.5 backdrop-blur-md px-3 py-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />Live
                      </Badge>
                    </div>
                    {/* Project number */}
                    <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 lg:hidden">
                      <span className="text-6xl sm:text-7xl font-black text-white/[0.06] leading-none">0{index + 1}</span>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className={`relative p-5 sm:p-8 lg:p-10 flex flex-col justify-center ${index % 2 !== 0 ? 'lg:order-1' : ''}`}>
                    {/* Large project number - desktop only */}
                    <span className="hidden lg:block absolute top-6 right-8 text-8xl font-black text-white/[0.03] leading-none">0{index + 1}</span>

                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/60"
                        animate={hoveredProject === index ? { rotate: [0, -10, 10, 0], scale: 1.05 } : { rotate: 0, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {project.icon}
                      </motion.div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white/90 group-hover:text-white transition-colors">{project.title}</h3>
                        <span className="text-xs text-white/30 tracking-wide">{project.subtitle} · {project.category}</span>
                      </div>
                    </div>

                    <p className="text-white/45 text-sm leading-relaxed mb-6 max-w-lg">{project.description}</p>

                    {/* Deliverables */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                      {project.deliverables.map((d) => (
                        <div key={d} className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-white/30 shrink-0" />
                          <span className="text-xs text-white/40">{d}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tech + CTA */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-5 border-t border-white/[0.06]">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech.map((tech) => (
                          <span key={tech} className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.06] text-white/40 tracking-wide">{tech}</span>
                        ))}
                      </div>
                      <a href={project.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-white/90 text-xs font-medium min-h-[44px] px-5 py-2.5 rounded-lg transition-colors shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />{t.proyectos.visitWeb}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>

        {/* Tech Stack Section */}
        <RevealSection className="mt-16 sm:mt-24">
          <div className="text-center mb-10 sm:mb-14">
            <Badge variant="outline" className="mb-4 border-white/10 text-white/50 bg-white/5 text-[11px] tracking-widest uppercase">
              <Cpu className="w-3 h-3 mr-1.5" />Stack
            </Badge>
            <h2 className="text-xl sm:text-3xl font-bold mb-3 text-white"><TextReveal text={t.proyectos.techStackTitle} /></h2>
            <p className="text-white/40 max-w-xl mx-auto text-sm">{t.proyectos.techStackSubtitle}</p>
          </div>
          <StaggerContainer className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              { icon: <Code2 className="w-5 h-5" />, name: t.proyectos.techItems[0].name, desc: t.proyectos.techItems[0].desc },
              { icon: <Palette className="w-5 h-5" />, name: t.proyectos.techItems[1].name, desc: t.proyectos.techItems[1].desc },
              { icon: <Database className="w-5 h-5" />, name: t.proyectos.techItems[2].name, desc: t.proyectos.techItems[2].desc },
              { icon: <Server className="w-5 h-5" />, name: t.proyectos.techItems[3].name, desc: t.proyectos.techItems[3].desc },
              { icon: <Layout className="w-5 h-5" />, name: t.proyectos.techItems[4].name, desc: t.proyectos.techItems[4].desc },
              { icon: <GitBranch className="w-5 h-5" />, name: t.proyectos.techItems[5].name, desc: t.proyectos.techItems[5].desc },
            ].map((tech) => (
              <StaggerItemScale key={tech.name}>
                <div className="glass-white rounded-xl p-3 sm:p-4 text-center group hover:bg-white/[0.04] transition-colors">
                  <motion.div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/[0.06] flex items-center justify-center mx-auto mb-2 sm:mb-3 text-white/40 group-hover:text-white/70 transition-colors"
                    whileHover={{ scale: 1.1, transition: { type: 'spring', stiffness: 300, damping: 15 } }}>
                    {tech.icon}
                  </motion.div>
                  <p className="text-xs sm:text-sm font-medium text-white/70">{tech.name}</p>
                  <p className="text-[9px] sm:text-[10px] text-white/25">{tech.desc}</p>
                </div>
              </StaggerItemScale>
            ))}
          </StaggerContainer>
        </RevealSection>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   PRECIOS PAGE
   ═══════════════════════════════════════════ */

interface PlanDetail {
  icon: React.ReactNode
  title: string
  items: string[]
}

interface Plan {
  name: string
  price: string
  priceNum: string
  description: string
  features: string[]
  delivery: string
  maintenance: string
  popular: boolean
  longDescription: string
  idealFor: string
  whatYouGet: PlanDetail[]
  howItWorks: string[]
  faq: { q: string; a: string }[]
}

function PlanDetailDialog({ plan, open, onOpenChange, setPage, setPrefill }: {
  plan: Plan | null; open: boolean; onOpenChange: (o: boolean) => void;
  setPage: (p: PageId) => void; setPrefill: (p: ContactPrefill) => void
}) {
  const { t } = useLanguage()
  if (!plan) return null
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[oklch(0.08_0.008_280)] border-white/10 text-white/80 max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[oklch(0.08_0.008_280)] border-b border-white/[0.06] px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/[0.08] flex items-center justify-center text-white/60">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white">{t.precios.plan} {plan.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl sm:text-2xl font-bold text-white">{plan.price}€</span>
                <span className="text-[10px] sm:text-xs text-white/30">{t.precios.oneTimePayment}</span>
              </div>
            </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-white/40 hover:text-white/80 transition-colors min-w-[32px] min-h-[32px]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
          {/* Description */}
          <div>
            <p className="text-sm text-white/50 leading-relaxed">{plan.longDescription}</p>
          </div>

          {/* Ideal For */}
          <div className="glass-white rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-white/40" />
              <h3 className="text-sm font-semibold text-white/80">{t.precios.forWhom}</h3>
            </div>
            <p className="text-sm text-white/50">{plan.idealFor}</p>
          </div>

          {/* Timeline */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 glass-white rounded-xl p-3 sm:p-4 text-center">
              <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-white/30 mx-auto mb-1 sm:mb-2" />
              <p className="text-[10px] sm:text-xs text-white/30 mb-0.5 sm:mb-1">{t.precios.deliveryTime}</p>
              <p className="text-xs sm:text-sm font-semibold text-white/80">{plan.delivery}</p>
            </div>
            <div className="flex-1 glass-white rounded-xl p-3 sm:p-4 text-center">
              <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-white/30 mx-auto mb-1 sm:mb-2" />
              <p className="text-[10px] sm:text-xs text-white/30 mb-0.5 sm:mb-1">{t.precios.supportIncluded}</p>
              <p className="text-xs sm:text-sm font-semibold text-white/80">{plan.maintenance}</p>
            </div>
            <div className="flex-1 glass-white rounded-xl p-3 sm:p-4 text-center">
              <FileCode className="w-4 h-4 sm:w-5 sm:h-5 text-white/30 mx-auto mb-1 sm:mb-2" />
              <p className="text-[10px] sm:text-xs text-white/30 mb-0.5 sm:mb-1">{t.precios.sourceCode}</p>
              <p className="text-xs sm:text-sm font-semibold text-white/80">{t.precios.yours}</p>
            </div>
          </div>

          {/* Detailed What You Get */}
          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white/30" />{t.precios.allIncluded}
            </h3>
            <div className="space-y-5">
              {plan.whatYouGet.map((section, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/40">{section.icon}</div>
                    <h4 className="text-sm font-medium text-white/70">{section.title}</h4>
                  </div>
                  <div className="pl-9 space-y-1.5">
                    {section.items.map((item, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-white/25 mt-2 shrink-0" />
                        <span className="text-xs text-white/45 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-white/30" />{t.precios.howItWorks}
            </h3>
            <div className="space-y-3">
              {plan.howItWorks.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center text-[10px] text-white/40 font-bold shrink-0 mt-0.5">{i + 1}</div>
                  <span className="text-xs text-white/45 leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plan FAQ */}
          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-white/30" />{t.precios.planFaq}
            </h3>
            <div className="space-y-3">
              {plan.faq.map((item, i) => (
                <div key={i} className="glass-white rounded-lg p-4">
                  <p className="text-xs font-medium text-white/70 mb-1">{item.q}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-2">
            <Button className="w-full bg-white text-black hover:bg-white/90 border-0 h-12 text-sm font-medium"
              onClick={() => { setPrefill({ project_type: `${t.precios.plan} ${plan.name}`, budget: plan.priceNum }); setPage('contacto'); onOpenChange(false) }}>
              {t.precios.startWithPlan} {plan.name} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-[10px] text-white/20 text-center mt-2">{t.precios.noCommitment}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function PreciosPage({ setPage, setPrefill }: { setPage: (p: PageId) => void; setPrefill: (p: ContactPrefill) => void }) {
  const { t } = useLanguage()
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [billingMode, setBillingMode] = useState<'one-time' | 'subscription'>('one-time')

  const plans: Plan[] = [
    {
      name: t.precios.plans.landing.name, price: t.precios.plans.landing.price, priceNum: t.precios.plans.landing.priceNum, popular: false,
      description: t.precios.plans.landing.description,
      longDescription: t.precios.plans.landing.longDescription,
      idealFor: t.precios.plans.landing.idealFor,
      delivery: t.precios.plans.landing.delivery, maintenance: t.precios.plans.landing.maintenance,
      features: t.precios.plans.landing.features,
      whatYouGet: [
        { icon: <PenTool className="w-3.5 h-3.5" />, title: t.precios.plans.landing.whatYouGet[0].title, items: t.precios.plans.landing.whatYouGet[0].items },
        { icon: <Code2 className="w-3.5 h-3.5" />, title: t.precios.plans.landing.whatYouGet[1].title, items: t.precios.plans.landing.whatYouGet[1].items },
        { icon: <Gauge className="w-3.5 h-3.5" />, title: t.precios.plans.landing.whatYouGet[2].title, items: t.precios.plans.landing.whatYouGet[2].items },
        { icon: <Rocket className="w-3.5 h-3.5" />, title: t.precios.plans.landing.whatYouGet[3].title, items: t.precios.plans.landing.whatYouGet[3].items },
      ],
      howItWorks: t.precios.plans.landing.howItWorks,
      faq: t.precios.plans.landing.faq,
    },
    {
      name: t.precios.plans.web.name, price: t.precios.plans.web.price, priceNum: t.precios.plans.web.priceNum, popular: true,
      description: t.precios.plans.web.description,
      longDescription: t.precios.plans.web.longDescription,
      idealFor: t.precios.plans.web.idealFor,
      delivery: t.precios.plans.web.delivery, maintenance: t.precios.plans.web.maintenance,
      features: t.precios.plans.web.features,
      whatYouGet: [
        { icon: <PenTool className="w-3.5 h-3.5" />, title: t.precios.plans.web.whatYouGet[0].title, items: t.precios.plans.web.whatYouGet[0].items },
        { icon: <Code2 className="w-3.5 h-3.5" />, title: t.precios.plans.web.whatYouGet[1].title, items: t.precios.plans.web.whatYouGet[1].items },
        { icon: <BarChart3 className="w-3.5 h-3.5" />, title: t.precios.plans.web.whatYouGet[2].title, items: t.precios.plans.web.whatYouGet[2].items },
        { icon: <Shield className="w-3.5 h-3.5" />, title: t.precios.plans.web.whatYouGet[3].title, items: t.precios.plans.web.whatYouGet[3].items },
        { icon: <Rocket className="w-3.5 h-3.5" />, title: t.precios.plans.web.whatYouGet[4].title, items: t.precios.plans.web.whatYouGet[4].items },
      ],
      howItWorks: t.precios.plans.web.howItWorks,
      faq: t.precios.plans.web.faq,
    },
    {
      name: t.precios.plans.premium.name, price: t.precios.plans.premium.price, priceNum: t.precios.plans.premium.priceNum, popular: false,
      description: t.precios.plans.premium.description,
      longDescription: t.precios.plans.premium.longDescription,
      idealFor: t.precios.plans.premium.idealFor,
      delivery: t.precios.plans.premium.delivery, maintenance: t.precios.plans.premium.maintenance,
      features: t.precios.plans.premium.features,
      whatYouGet: [
        { icon: <PenTool className="w-3.5 h-3.5" />, title: t.precios.plans.premium.whatYouGet[0].title, items: t.precios.plans.premium.whatYouGet[0].items },
        { icon: <ShoppingCart className="w-3.5 h-3.5" />, title: t.precios.plans.premium.whatYouGet[1].title, items: t.precios.plans.premium.whatYouGet[1].items },
        { icon: <Users className="w-3.5 h-3.5" />, title: t.precios.plans.premium.whatYouGet[2].title, items: t.precios.plans.premium.whatYouGet[2].items },
        { icon: <Globe2 className="w-3.5 h-3.5" />, title: t.precios.plans.premium.whatYouGet[3].title, items: t.precios.plans.premium.whatYouGet[3].items },
        { icon: <Zap className="w-3.5 h-3.5" />, title: t.precios.plans.premium.whatYouGet[4].title, items: t.precios.plans.premium.whatYouGet[4].items },
        { icon: <ShieldCheck className="w-3.5 h-3.5" />, title: t.precios.plans.premium.whatYouGet[5].title, items: t.precios.plans.premium.whatYouGet[5].items },
        { icon: <Rocket className="w-3.5 h-3.5" />, title: t.precios.plans.premium.whatYouGet[6].title, items: t.precios.plans.premium.whatYouGet[6].items },
      ],
      howItWorks: t.precios.plans.premium.howItWorks,
      faq: t.precios.plans.premium.faq,
    },
  ]

  const subscriptions = [
    {
      name: t.precios.subscriptions.esencial.name,
      price: t.precios.subscriptions.esencial.price,
      period: t.precios.perMonth,
      description: t.precios.subscriptions.esencial.description,
      icon: <Shield className="w-5 h-5" />,
      features: t.precios.subscriptions.esencial.features,
      popular: false,
    },
    {
      name: t.precios.subscriptions.crecimiento.name,
      price: t.precios.subscriptions.crecimiento.price,
      period: t.precios.perMonth,
      description: t.precios.subscriptions.crecimiento.description,
      icon: <TrendingUp className="w-5 h-5" />,
      features: t.precios.subscriptions.crecimiento.features,
      popular: true,
    },
    {
      name: t.precios.subscriptions.premiumPlus.name,
      price: t.precios.subscriptions.premiumPlus.price,
      period: t.precios.perMonth,
      description: t.precios.subscriptions.premiumPlus.description,
      icon: <Crown className="w-4 h-4" />,
      features: t.precios.subscriptions.premiumPlus.features,
      popular: false,
    },
  ]

  const handlePlanClick = (plan: Plan) => {
    setSelectedPlan(plan)
    setDialogOpen(true)
  }

  return (
    <div className="pt-20 sm:pt-24 pb-16 sm:pb-20">
      <motion.div animate={{ y: [-15, 15, -15], rotate: [0, 90, 180, 270, 360] }} transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[20%] right-[6%] w-8 h-8 border border-white/[0.04] rotate-45 pointer-events-none" />
      <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.02, 0.06, 0.02] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[25%] left-[12%] w-36 h-36 rounded-full border border-white/[0.02] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection className="mb-10 sm:mb-16">
          <Badge variant="outline" className="mb-4 border-white/10 text-white/50 bg-white/5 text-[11px] tracking-widest uppercase">
            <CreditCard className="w-3 h-3 mr-1.5" />{t.precios.badge}
          </Badge>
          <h1 className="text-2xl sm:text-5xl font-bold mb-4 text-white"><TextReveal text={t.precios.title} /></h1>
          <p className="text-white/40 max-w-xl text-sm">{t.precios.subtitle}</p>
        </RevealSection>

        {/* Billing Mode Toggle */}
        <div className="flex items-center justify-center mb-8 sm:mb-12">
          <div className="glass-white rounded-full p-1 flex items-center gap-1">
            <button
              onClick={() => setBillingMode('one-time')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-medium transition-all duration-300 min-h-[40px] ${billingMode === 'one-time' ? 'bg-white text-black' : 'text-white/50 hover:text-white/80'}`}>
              {t.precios.oneTime}
            </button>
            <button
              onClick={() => setBillingMode('subscription')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-1.5 min-h-[40px] ${billingMode === 'subscription' ? 'bg-white text-black' : 'text-white/50 hover:text-white/80'}`}>
              <RefreshCw className="w-3 h-3" />{t.precios.subscription}
            </button>
          </div>
        </div>

        {/* One-Time Plans */}
        {billingMode === 'one-time' && (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {plans.map((plan) => (
              <StaggerItemScale key={plan.name} className={plan.popular ? 'md:-mt-4' : ''}>
                <TiltCard className="h-full">
                  <Card className={`pricing-card h-full relative border-white/[0.06] cursor-pointer ${plan.popular ? 'bg-white/[0.06] border-white/[0.12]' : 'bg-white/[0.02]'}`}
                    onClick={() => handlePlanClick(plan)}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-white text-black border-0 px-3 text-[10px] tracking-wider font-medium">
                          <Award className="w-3 h-3 mr-1" />{t.precios.mostChosen}
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-white/90">{plan.name}</CardTitle>
                      <CardDescription className="text-xs text-white/35">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-white/30">{t.precios.from}</span>
                        <span className="text-3xl font-bold text-white/90">{plan.price}</span>
                        <span className="text-white/30">€</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1.5 text-[10px] text-white/35 bg-white/[0.04] rounded-full px-2.5 py-1">
                          <Timer className="w-3 h-3 text-white/25" />{plan.delivery}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-white/35 bg-white/[0.04] rounded-full px-2.5 py-1">
                          <Wrench className="w-3 h-3 text-white/25" />{plan.maintenance}
                        </div>
                      </div>
                      <div className="space-y-2 pt-1">
                        {plan.features.slice(0, 5).map((f) => (
                          <div key={f} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-white/25 mt-0.5 shrink-0" />
                            <span className="text-xs text-white/50">{f}</span>
                          </div>
                        ))}
                        {plan.features.length > 5 && (
                          <p className="text-[10px] text-white/25 pl-5">+{plan.features.length - 5} {t.precios.more}</p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                      <div className="w-full flex items-center justify-center gap-1.5 text-xs text-white/40 group hover:text-white/70 transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t.precios.viewDetails}</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </CardFooter>
                  </Card>
                </TiltCard>
              </StaggerItemScale>
            ))}
          </StaggerContainer>
        )}

        {/* Subscription Plans */}
        {billingMode === 'subscription' && (
          <>
            <RevealSection className="mb-10 text-center">
              <div className="inline-flex items-center gap-2 glass-white rounded-full px-5 py-2.5 text-xs text-white/40">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.precios.subscriptionInfo}</span>
              </div>
            </RevealSection>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
              {subscriptions.map((sub) => (
                <StaggerItemScale key={sub.name} className={sub.popular ? 'md:-mt-4' : ''}>
                  <TiltCard className="h-full">
                    <Card className={`pricing-card h-full relative border-white/[0.06] ${sub.popular ? 'bg-white/[0.06] border-white/[0.12]' : 'bg-white/[0.02]'}`}>
                      {sub.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-white text-black border-0 px-3 text-[10px] tracking-wider font-medium">
                            <Award className="w-3 h-3 mr-1" />{t.precios.recommended}
                          </Badge>
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3 mb-1">
                          <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-white/50">{sub.icon}</div>
                          <CardTitle className="text-lg text-white/90">{sub.name}</CardTitle>
                        </div>
                        <CardDescription className="text-xs text-white/35">{sub.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-3xl font-bold text-white/90">{sub.price}</span>
                          <span className="text-white/30 text-sm">{sub.period}</span>
                        </div>
                        <div className="space-y-2 pt-1">
                          {sub.features.map((f) => (
                            <div key={f} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-white/25 mt-0.5 shrink-0" />
                              <span className="text-xs text-white/50">{f}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <MagneticButton className="w-full">
                          <Button className={`w-full text-xs font-medium ${sub.popular ? 'bg-white text-black hover:bg-white/90 border-0' : 'border-white/10 text-white/60 hover:text-white hover:bg-white/5'}`}
                            variant={sub.popular ? 'default' : 'outline'}
                            onClick={() => { setPrefill({ project_type: `${t.precios.subscription} ${sub.name}`, budget: `${sub.price}${t.precios.perMonth}` }); setPage('contacto') }}>
                            {t.precios.startSubscription} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                          </Button>
                        </MagneticButton>
                      </CardFooter>
                    </Card>
                  </TiltCard>
                </StaggerItemScale>
              ))}
            </StaggerContainer>
            <p className="text-center text-xs text-white/25 mt-8">
              {t.precios.noPermanence} <button onClick={() => { setPrefill({ project_type: t.precios.customProject }); setPage('contacto') }} className="text-white/50 hover:text-white/80 underline underline-offset-2">{t.precios.needDifferent}</button>
            </p>
          </>
        )}

        <p className="text-center text-xs text-white/25 mt-8">
          {t.precios.needDifferent} <button onClick={() => { setPrefill({ project_type: t.precios.customProject }); setPage('contacto') }} className="text-white/50 hover:text-white/80 underline underline-offset-2">{t.precios.letsTalk}</button>
        </p>

        {/* Plan Detail Dialog */}
        <PlanDetailDialog plan={selectedPlan} open={dialogOpen} onOpenChange={setDialogOpen} setPage={setPage} setPrefill={setPrefill} />

        {/* Process Section */}
        <RevealSection className="mt-16 sm:mt-24">
          <div className="text-center mb-10 sm:mb-16">
            <Badge variant="outline" className="mb-4 border-white/10 text-white/50 bg-white/5 text-[11px] tracking-widest uppercase">
              <Target className="w-3 h-3 mr-1.5" />{t.precios.processBadge}
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-bold mb-4 text-white"><TextReveal text={t.precios.processTitle} /></h2>
            <p className="text-white/40 max-w-lg mx-auto text-sm">{t.precios.processSubtitle}</p>
          </div>
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { num: '01', icon: <MessageCircle className="w-5 h-5" />, title: t.precios.processSteps[0].title, desc: t.precios.processSteps[0].desc },
              { num: '02', icon: <Palette className="w-5 h-5" />, title: t.precios.processSteps[1].title, desc: t.precios.processSteps[1].desc },
              { num: '03', icon: <Code2 className="w-5 h-5" />, title: t.precios.processSteps[2].title, desc: t.precios.processSteps[2].desc },
              { num: '04', icon: <Rocket className="w-5 h-5" />, title: t.precios.processSteps[3].title, desc: t.precios.processSteps[3].desc },
            ].map((step, i) => (
              <StaggerItemScale key={step.num}>
                <div className="relative text-center group">
                  {i < 3 && (
                    <div className="hidden lg:block absolute top-7 left-[calc(50%+28px)] w-[calc(100%-56px)] h-px">
                      <motion.div className="h-full bg-gradient-to-r from-white/20 to-white/5"
                        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.15 }} style={{ transformOrigin: 'left' }} />
                    </div>
                  )}
                  <motion.div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] group-hover:border-white/[0.18] group-hover:bg-white/[0.08] flex items-center justify-center mx-auto mb-4 transition-all duration-300 text-white/40 group-hover:text-white/80"
                    whileHover={{ scale: 1.1, transition: { type: 'spring', stiffness: 300, damping: 15 } }}>
                    {step.icon}
                  </motion.div>
                  <span className="text-[10px] text-white/20 tracking-[0.2em] uppercase block mb-2">{step.num}</span>
                  <h3 className="text-base font-semibold text-white/90 mb-2"><TextScramble text={step.title} /></h3>
                  <p className="text-xs text-white/35 leading-relaxed">{step.desc}</p>
                </div>
              </StaggerItemScale>
            ))}
          </StaggerContainer>
        </RevealSection>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   FAQ PAGE
   ═══════════════════════════════════════════ */
function FAQPage({ setPage }: { setPage?: (p: PageId) => void }) {
  const { t } = useLanguage()
  const faqs = [
    { icon: <Timer className="w-4 h-4" />, question: t.faq.items[0].question, answer: t.faq.items[0].answer },
    { icon: <CreditCard className="w-4 h-4" />, question: t.faq.items[1].question, answer: t.faq.items[1].answer },
    { icon: <Wrench className="w-4 h-4" />, question: t.faq.items[2].question, answer: t.faq.items[2].answer },
    { icon: <Code2 className="w-4 h-4" />, question: t.faq.items[3].question, answer: t.faq.items[3].answer },
    { icon: <MessageCircle className="w-4 h-4" />, question: t.faq.items[4].question, answer: t.faq.items[4].answer },
    { icon: <Shield className="w-4 h-4" />, question: t.faq.items[5].question, answer: t.faq.items[5].answer },
    { icon: <Globe className="w-4 h-4" />, question: t.faq.items[6].question, answer: t.faq.items[6].answer },
    { icon: <BarChart3 className="w-4 h-4" />, question: t.faq.items[7].question, answer: t.faq.items[7].answer },
    { icon: <Lock className="w-4 h-4" />, question: t.faq.items[8].question, answer: t.faq.items[8].answer },
    { icon: <Smartphone className="w-4 h-4" />, question: t.faq.items[9].question, answer: t.faq.items[9].answer },
  ]

  return (
    <div className="pt-20 sm:pt-24 pb-16 sm:pb-20">
      <motion.div animate={{ y: [10, -10, 10], x: [-3, 3, -3] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[40%] left-[8%] pointer-events-none text-white/[0.04] text-3xl font-light">+</motion.div>
      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.03, 0.08, 0.03] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[30%] right-[8%] w-20 h-20 rounded-full border border-white/[0.03] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection className="mb-10 sm:mb-16">
          <Badge variant="outline" className="mb-4 border-white/10 text-white/50 bg-white/5 text-[11px] tracking-widest uppercase">
            <MessageCircle className="w-3 h-3 mr-1.5" />{t.faq.badge}
          </Badge>
          <h1 className="text-2xl sm:text-5xl font-bold mb-4 text-white"><TextReveal text={t.faq.title} /></h1>
          <p className="text-white/40 max-w-lg text-sm">{t.faq.subtitle}</p>
        </RevealSection>
        <Accordion type="single" collapsible className="space-y-2 sm:space-y-2.5">
          {faqs.map((faq, index) => (
            <motion.div key={index}
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.5 }}>
              <AccordionItem value={`faq-${index}`}
                className="glass-white rounded-xl px-3 sm:px-5 border-white/[0.06] data-[state=open]:border-white/[0.12] faq-item transition-all">
                <AccordionTrigger className="hover:no-underline py-3 sm:py-4 min-h-[44px]">
                  <div className="flex items-center gap-2 sm:gap-3 text-left">
                    <motion.div className="faq-icon w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0 text-white/30"
                      whileHover={{ scale: 1.2, rotate: 10 }}>
                      {faq.icon}
                    </motion.div>
                    <span className="text-xs sm:text-sm font-medium text-white/80">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-white/40 text-xs sm:text-sm leading-relaxed pb-3 sm:pb-4 pl-9 sm:pl-10">{faq.answer}</AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>

        {/* FAQ CTA */}
        <RevealSection className="mt-12 sm:mt-16 text-center">
          <div className="glass-white rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-bold mb-3 text-white">{t.faq.notFound}</h3>
            <p className="text-white/40 text-xs sm:text-sm mb-4 sm:mb-6">{t.faq.writeUs}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4 sm:px-0">
              <Button className="bg-white text-black hover:bg-white/90 border-0 text-sm min-h-[44px] w-full sm:w-auto"
                onClick={() => setPage?.('contacto')}>
                <Mail className="w-4 h-4 mr-2" />{t.faq.contact}
              </Button>
              <Button variant="outline" className="border-white/10 text-white/50 hover:text-white hover:bg-white/5 text-sm min-h-[44px] w-full sm:w-auto"
                onClick={() => setPage?.('precios')}>
                <CreditCard className="w-4 h-4 mr-2" />{t.homeCta.viewPrices}
              </Button>
            </div>
          </div>
        </RevealSection>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   CONTACTO PAGE (Formspree - pure HTML form)
   ═══════════════════════════════════════════ */
function ContactoPage({ prefill, setPage }: { prefill: ContactPrefill; setPage: (p: PageId) => void }) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [projectType, setProjectType] = useState(prefill?.project_type || '')
  const [budget, setBudget] = useState(prefill?.budget || '')
  const [message, setMessage] = useState('')
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (prefill?.project_type) setProjectType(prefill.project_type)
    if (prefill?.budget) setBudget(prefill.budget)
  }, [prefill])

  // Validate fields
  const validate = useCallback(() => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = t.contacto.validationRequired
    if (!email.trim()) e.email = t.contacto.validationRequired
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t.contacto.validationEmail
    if (!message.trim()) e.message = t.contacto.validationRequired
    else if (message.trim().length < 10) e.message = t.contacto.validationMinLength
    setErrors(e)
    return Object.keys(e).length === 0
  }, [name, email, message, t])

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    validate()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTouched({ name: true, email: true, message: true })
    if (!validate()) return
    setSending(true)
    try {
      const res = await fetch('https://formspree.io/f/xgvnpjpp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, project_type: projectType, budget, message }),
      })
      if (res.ok) {
        setSent(true)
        toast({ title: t.contacto.sent, description: t.contacto.sentDescription })
      } else {
        toast({ title: t.contacto.errorAlert, variant: 'destructive' })
      }
    } catch {
      toast({ title: t.contacto.connectionError, variant: 'destructive' })
    } finally {
      setSending(false)
    }
  }

  const inputClass = (field: string) => `w-full bg-white/[0.05] border rounded-lg px-4 h-11 min-h-[44px] text-sm text-white/90 placeholder:text-white/25 focus:outline-none focus:ring-1 transition-colors ${touched[field] && errors[field] ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20' : 'border-white/[0.1] focus:border-white/30 focus:ring-white/10'}`
  const labelClass = "block text-xs text-white/50 mb-1.5 font-medium"

  return (
    <div className="pt-20 sm:pt-24 pb-16 sm:pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection className="mb-10 sm:mb-12">
          <Badge variant="outline" className="mb-4 border-white/10 text-white/50 bg-white/5 text-[11px] tracking-widest uppercase">
            <Mail className="w-3 h-3 mr-1.5" />{t.contacto.badge}
          </Badge>
          <h1 className="text-2xl sm:text-5xl font-bold mb-4 text-white"><TextReveal text={t.contacto.title} /></h1>
          <p className="text-white/40 max-w-lg text-sm leading-relaxed">{t.contacto.subtitle}</p>
        </RevealSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {!sent ? (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="glass-white rounded-xl p-4 sm:p-8 space-y-4 sm:space-y-5"
                style={{ position: 'relative', zIndex: 1 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>{t.contacto.name} {t.contacto.required}</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => { setName(e.target.value); if (touched.name) validate() }}
                      onBlur={() => handleBlur('name')}
                      className={inputClass('name')}
                      placeholder={t.contacto.namePlaceholder}
                      autoComplete="name"
                    />
                    {touched.name && errors.name && <p className="text-[10px] text-red-400/70 mt-1 pl-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={labelClass}>{t.contacto.email} {t.contacto.required}</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (touched.email) validate() }}
                      onBlur={() => handleBlur('email')}
                      className={inputClass('email')}
                      placeholder={t.contacto.emailPlaceholder}
                      autoComplete="email"
                    />
                    {touched.email && errors.email && <p className="text-[10px] text-red-400/70 mt-1 pl-1">{errors.email}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-type" className={labelClass}>{t.contacto.projectType}</label>
                    <input
                      id="contact-type"
                      name="project_type"
                      type="text"
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className={inputClass('projectType')}
                      placeholder={t.contacto.projectTypePlaceholder}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-budget" className={labelClass}>{t.contacto.budget}</label>
                    <input
                      id="contact-budget"
                      name="budget"
                      type="text"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className={inputClass('budget')}
                      placeholder={t.contacto.budgetPlaceholder}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-message" className={labelClass}>{t.contacto.message} {t.contacto.required}</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    value={message}
                    onChange={(e) => { setMessage(e.target.value); if (touched.message) validate() }}
                    onBlur={() => handleBlur('message')}
                    rows={5}
                    className={`w-full bg-white/[0.05] border rounded-lg px-4 py-3 text-sm text-white/90 placeholder:text-white/25 focus:outline-none focus:ring-1 transition-colors resize-none ${touched.message && errors.message ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20' : 'border-white/[0.1] focus:border-white/30 focus:ring-white/10'}`}
                    placeholder={t.contacto.messagePlaceholder}
                  />
                  {touched.message && errors.message && <p className="text-[10px] text-red-400/70 mt-1 pl-1">{errors.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-white text-black hover:bg-white/90 h-12 min-h-[44px] text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />{t.contacto.sending}</>
                  ) : (
                    <><Send className="w-4 h-4" />{t.contacto.send}</>
                  )}
                </button>
                <p className="text-[10px] text-white/20 text-center">{t.contacto.responseTime}</p>
              </form>
            ) : (
              <div className="glass-white rounded-xl p-8 sm:p-12 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white/90 mb-2">{t.contacto.sent}</h3>
                <p className="text-white/40 text-xs sm:text-sm mb-4 sm:mb-6">{t.contacto.sentDescription}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => { setSent(false); setName(''); setEmail(''); setProjectType(''); setBudget(''); setMessage('') }}
                    className="border border-white/10 text-white/50 hover:text-white hover:bg-white/5 px-6 h-11 min-h-[44px] rounded-lg text-sm transition-colors w-full sm:w-auto"
                  >
                    {t.contacto.sendAnother}
                  </button>
                  <button
                    onClick={() => setPage('precios')}
                    className="bg-white text-black hover:bg-white/90 px-6 h-11 min-h-[44px] rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <CreditCard className="w-4 h-4" />{t.homeCta.viewPrices}
                  </button>
                </div>
                <div className="mt-4">
                  <a
                    href="https://wa.me/31615893105?text=Hola%20Webnox%2C%20acabo%20de%20enviar%20un%20formulario%20y%20quiero%20agilizar%20la%20respuesta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-white/90 px-6 h-11 min-h-[44px] rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
                  >
                    <MessageCircle className="w-4 h-4" />{t.contacto.whatsappUs}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-4 sm:space-y-5">
            <div className="glass-white rounded-xl p-4 sm:p-5 space-y-3 sm:space-y-4">
              <h3 className="text-sm font-semibold text-white/80">{t.contacto.contactInfo}</h3>
              <div className="space-y-3">
                <a href="mailto:programaciones.mark@gmail.com" className="flex items-center gap-3 text-sm text-white/50 hover:text-white/70 transition-colors min-h-[32px]">
                  <Mail className="w-4 h-4 text-white/30 shrink-0" />
                  <span className="break-all">programaciones.mark@gmail.com</span>
                </a>
                <a href="https://wa.me/31615893105?text=Hola%20Webnox" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-white/50 hover:text-white/70 transition-colors min-h-[32px]">
                  <Phone className="w-4 h-4 text-white/30 shrink-0" />
                  +31 6 15893105
                </a>
                <div className="flex items-center gap-3 text-sm text-white/50">
                  <MapPin className="w-4 h-4 text-white/30 shrink-0" />
                  {t.contacto.location}
                </div>
              </div>
            </div>
            <div className="glass-white rounded-xl p-4 sm:p-5 space-y-3">
              <h3 className="text-sm font-semibold text-white/80">{t.contacto.whatNext}</h3>
              <div className="space-y-2">
                {t.contacto.steps.map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center text-[10px] text-white/40 font-bold shrink-0">{i + 1}</div>
                    <span className="text-xs text-white/40">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => document.getElementById('contact-message')?.focus()}
              className="glass-white rounded-xl p-4 sm:p-5 w-full text-left group hover:bg-white/[0.04] transition-colors min-h-[44px]"
            >
              <h3 className="text-sm font-semibold text-white/80 mb-2 sm:mb-3">{t.contacto.freeAudit}</h3>
              <p className="text-xs text-white/35 leading-relaxed mb-2 sm:mb-3">{t.contacto.auditDesc}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] text-white/25">
                  <Timer className="w-3 h-3" /> {t.contacto.auditDelivery}
                </div>
                <span className="text-[10px] text-white/40 group-hover:text-white/70 transition-colors flex items-center gap-1">
                  {t.contacto.requestAudit} <ChevronRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   LEGAL DIALOGS (comprehensive Spanish/Dutch legislation)
   ═══════════════════════════════════════════ */
function LegalDialogs({ setPage }: { setPage: (p: PageId) => void }) {
  const { t } = useLanguage()
  const [legalOpen, setLegalOpen] = useState<string | null>(null)

  const legalSections = [
    {
      id: 'terminos',
      title: t.legal.terms,
      icon: <FileCheck2 className="w-4 h-4" />,
      content: (
        <div className="space-y-5">
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">1. Objeto del contrato</h4>
            <p className="text-xs text-white/50 leading-relaxed">Webnox Studio ofrece servicios de diseño y desarrollo web a medida. Cada proyecto se define en una propuesta personalizada que incluye alcance, precio, plazos y entregables. La aceptación de la propuesta constituye el contrato vinculante entre las partes.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">2. Presupuestos y precios</h4>
            <p className="text-xs text-white/50 leading-relaxed">Los precios publicados en la web son orientativos. El precio final se confirma en la propuesta personalizada tras la llamada de discovery. Todos los precios son en euros (€) e incluyen IVA según la legislación española (Ley 37/1992 de IVA) u holandesa (Wet op de omzetbelasting 1968) según aplique.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">3. Condiciones de pago</h4>
            <p className="text-xs text-white/50 leading-relaxed">Pago único: 50% al inicio, 30% al aprobar diseño, 20% al entregar en producción. Para proyectos Premium, los plazos pueden adaptarse al flujo de caja del cliente. Suscripciones mensuales: cobro por adelantado el día 1 de cada periodo. Formas de pago aceptadas: transferencia bancaria (SEPA), tarjeta de crédito/débito (Stripe). En caso de impago, se aplicarán los intereses de demora establecidos en la Ley 3/2004 de lucha contra la morosidad (España) o el artículo 6:119a BW (Países Bajos).</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">4. Propiedad intelectual e industrial</h4>
            <p className="text-xs text-white/50 leading-relaxed">El código fuente se entrega al cliente al finalizar el proyecto y abonar el importe total, conforme al Real Decreto Legislativo 1/1996 (Ley de Propiedad Intelectual, España) y la Auteurswet 1912 (Países Bajos). El diseño en Figma también se entrega. Las licencias de terceros (librerías, plugins, imágenes de stock) se rigen por sus propias licencias. Webnox retiene el derecho de mostrar el proyecto en su portfolio salvo acuerdo en contrario.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">5. Revisiones y cambios</h4>
            <p className="text-xs text-white/50 leading-relaxed">Cada plan incluye un número determinado de rondas de revisiones. Revisiones adicionales tienen coste extra, que se comunica antes de realizarlas. Los cambios fuera del alcance definido en la propuesta se presupuestan por separado.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">6. Cancelación y resolución</h4>
            <p className="text-xs text-white/50 leading-relaxed">Si el cliente cancela antes de empezar el desarrollo, se devuelve el 50% del anticipo. Si se cancela durante el desarrollo, se factura el trabajo realizado. Ambas partes pueden resolver el contrato por incumplimiento de la otra parte con preaviso de 15 días naturales, conforme a la Ley de Contratos de Adhesión y la Directiva 93/13/CEE.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">7. Suscripciones</h4>
            <p className="text-xs text-white/50 leading-relaxed">Las suscripciones mensuales se renuevan automáticamente. El cliente puede cancelar con 30 días de preaviso por escrito (email a programaciones.mark@gmail.com). No hay permanencia mínima. Conforme a la Directiva (UE) 2019/770 sobre contenidos y servicios digitales, el cliente tiene derecho de reembolso si el servicio no cumple lo descrito.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">8. Soporte post-entrega</h4>
            <p className="text-xs text-white/50 leading-relaxed">El soporte incluido cubre corrección de bugs y pequeños ajustes. No incluye nuevas funcionalidades ni rediseños. El soporte se presta en días laborables (lunes a viernes) según el horario de Europa Central (CET/CEST).</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">9. Legislación aplicable y jurisdicción</h4>
            <p className="text-xs text-white/50 leading-relaxed">Estos términos se rigen por la legislación española o holandesa, según el domicilio del cliente. Para disputas, las partes se someten a los juzgados de Madrid (España) o Amsterdam (Países Bajos). Antes de litigar, se intentará resolución amistosa. Conforme al Reglamento (UE) 524/2013, puedes acudir a la plataforma de resolución de litigios en línea: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-white/60 underline hover:text-white/80">ec.europa.eu/consumers/odr</a>.</p>
          </div>
        </div>
      )
    },
    {
      id: 'privacidad',
      title: t.legal.privacy,
      icon: <Shield className="w-4 h-4" />,
      content: (
        <div className="space-y-5">
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">1. Responsable del tratamiento</h4>
            <p className="text-xs text-white/50 leading-relaxed">Webnox Studio, con domicilio en Países Bajos (Holanda). Datos de contacto: programaciones.mark@gmail.com. Delegado de Protección de Datos (DPD): disponible en la misma dirección de correo.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">2. Datos que recogemos</h4>
            <ul className="text-xs text-white/50 leading-relaxed space-y-1 list-disc pl-4">
              <li><strong className="text-white/70">Datos de contacto:</strong> Nombre, email, teléfono (solo si nos los facilitas voluntariamente a través del formulario).</li>
              <li><strong className="text-white/70">Datos de navegación:</strong> Dirección IP, tipo de navegador, páginas visitadas, tiempo de permanencia (mediante Google Analytics 4, datos anónimos y agregados).</li>
              <li><strong className="text-white/70">Datos de proyecto:</strong> Información sobre el tipo de proyecto y presupuesto estimado que nos facilitas en el formulario.</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">3. Finalidad del tratamiento</h4>
            <p className="text-xs text-white/50 leading-relaxed">Gestionar las consultas y solicitudes recibidas a través del formulario de contacto. Enviar comunicaciones comerciales solo si el usuario lo solicita explícitamente. Mejorar la experiencia de navegación mediante analítica anónima.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">4. Base legal (RGPD - Reglamento UE 2016/679)</h4>
            <ul className="text-xs text-white/50 leading-relaxed space-y-1 list-disc pl-4">
              <li><strong className="text-white/70">Consentimiento (Art. 6.1.a RGPD):</strong> Al enviar el formulario, consientes el tratamiento de tus datos para la finalidad indicada.</li>
              <li><strong className="text-white/70">Interés legítimo (Art. 6.1.f RGPD):</strong> Analítica web para mejorar nuestros servicios.</li>
              <li><strong className="text-white/70">Obligación legal (Art. 6.1.c RGPD):</strong> Conservación de datos fiscales y contables según la legislación aplicable.</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">5. Destinatarios y transferencias internacionales</h4>
            <p className="text-xs text-white/50 leading-relaxed">No se ceden datos a terceros, salvo obligación legal. Los datos del formulario se procesan mediante Formspree (EE.UU.) bajo acuerdo de procesamiento conforme al Art. 46 RGPD. La analítica se procesa mediante Google Analytics 4, bajo las garantías del EU-U.S. Data Privacy Framework.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">6. Derechos del interesado</h4>
            <p className="text-xs text-white/50 leading-relaxed">Puedes ejercer tus derechos de acceso, rectificación, supresión, limitación del tratamiento, portabilidad y oposición (Arts. 15-22 RGPD; Ley Orgánica 3/2018, España; Uitvoeringswet AVG, Países Bajos) escribiendo a programaciones.mark@gmail.com. También tienes derecho a reclamar ante la Autoriteit Persoonsgegevens (autoriteitpersoonsgegevens.nl) o la Agencia Española de Protección de Datos (aepd.es).</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">7. Conservación de datos</h4>
            <p className="text-xs text-white/50 leading-relaxed">Los datos de contacto se conservarán durante 2 años desde la última comunicación (plazo de prescripción de acciones personales, Art. 1934 Código Civil español). Los datos de facturación se conservan 6 años conforme a la normativa fiscal. Los datos de analítica se anonimizan tras 26 meses.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">8. Seguridad</h4>
            <p className="text-xs text-white/50 leading-relaxed">Aplicamos medidas técnicas y organizativas conforme al Art. 32 RGPD: cifrado HTTPS/TLS, acceso restringido a datos, backups cifrados y auditorías periódicas de seguridad.</p>
          </div>
        </div>
      )
    },
    {
      id: 'cookies',
      title: t.legal.cookies,
      icon: <Eye className="w-4 h-4" />,
      content: (
        <div className="space-y-5">
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">1. ¿Qué son las cookies?</h4>
            <p className="text-xs text-white/50 leading-relaxed">Pequeños archivos de texto que se almacenan en tu dispositivo al visitar nuestra web. Conforme a la Directiva 2009/136/CE (ePrivacy), la Ley 34/2002 (LSSI-CE, España) y la Telecommunicatiewet (Países Bajos), te informamos sobre su uso.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">2. Cookies que usamos</h4>
            <div className="space-y-3">
              <div className="glass-white rounded-lg p-3">
                <p className="text-xs font-medium text-white/70 mb-1">Cookies técnicas (necesarias)</p>
                <p className="text-[10px] text-white/40">Session cookies para el funcionamiento básico. No requieren consentimiento (Art. 22.2 LSSI-CE). Se eliminan al cerrar el navegador.</p>
              </div>
              <div className="glass-white rounded-lg p-3">
                <p className="text-xs font-medium text-white/70 mb-1">Cookies analíticas</p>
                <p className="text-[10px] text-white/40">Google Analytics 4 (_ga, _ga_*): miden visitas, páginas vistas y tiempo de permanencia. Datos anónimos y agregados. IP anonimizada conforme al RGPD. Requieren consentimiento.</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">3. Consentimiento</h4>
            <p className="text-xs text-white/50 leading-relaxed">Al navegar por nuestra web, aceptas el uso de cookies según esta política. Puedes retirar tu consentimiento en cualquier momento configurando tu navegador o contactándonos.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">4. Gestión y eliminación</h4>
            <p className="text-xs text-white/50 leading-relaxed">Puedes configurar tu navegador para bloquear o eliminar cookies:</p>
            <ul className="text-xs text-white/40 list-disc pl-4 space-y-1 mt-2">
              <li>Chrome: Configuración → Privacidad y seguridad → Cookies</li>
              <li>Firefox: Opciones → Privacidad y seguridad</li>
              <li>Safari: Preferencias → Privacidad</li>
              <li>Edge: Configuración → Privacidad, búsqueda y servicios</li>
            </ul>
            <p className="text-xs text-white/40 mt-2">Bloquear cookies puede afectar la experiencia de navegación. También puedes gestionar tus preferencias en <a href="https://youronlinechoices.eu" target="_blank" rel="noopener noreferrer" className="text-white/60 underline hover:text-white/80">youronlinechoices.eu</a>.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">5. Actualización</h4>
            <p className="text-xs text-white/50 leading-relaxed">Esta política puede actualizarse. Cualquier cambio significativo se comunicará en esta página. Última actualización: enero 2025.</p>
          </div>
        </div>
      )
    },
    {
      id: 'aviso-legal',
      title: t.legal.legalNotice,
      icon: <Scale className="w-4 h-4" />,
      content: (
        <div className="space-y-5">
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">1. Datos identificativos</h4>
            <p className="text-xs text-white/50 leading-relaxed">En cumplimiento del deber de información recogido en el Art. 10 de la Ley 34/2002 (LSSI-CE, España) y el Artikel 6:196a BW (Países Bajos):</p>
            <ul className="text-xs text-white/50 list-disc pl-4 space-y-1 mt-2">
              <li><strong className="text-white/70">Denominación:</strong> Webnox Studio</li>
              <li><strong className="text-white/70">Domicilio:</strong> Países Bajos (Holanda)</li>
              <li><strong className="text-white/70">Email:</strong> programaciones.mark@gmail.com</li>
              <li><strong className="text-white/70">Actividad:</strong> Diseño y desarrollo web a medida</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">2. Objeto</h4>
            <p className="text-xs text-white/50 leading-relaxed">Esta web tiene carácter informativo y comercial sobre los servicios de diseño y desarrollo web que presta Webnox Studio. El acceso y uso de esta web atribuye la condición de usuario e implica la aceptación plena de todas las condiciones incluidas en este Aviso Legal.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">3. Propiedad intelectual e industrial</h4>
            <p className="text-xs text-white/50 leading-relaxed">Todos los contenidos de esta web (textos, imágenes, diseños, código fuente, logos, etc.) son propiedad de Webnox Studio o de sus legítimos titulares, conforme al Real Decreto Legislativo 1/1996 (LPI, España), la Auteurswet 1912 (Países Bajos) y la Directiva 2001/29/CE. Queda prohibida su reproducción, distribución o transformación sin autorización escrita.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">4. Exclusión de responsabilidad</h4>
            <p className="text-xs text-white/50 leading-relaxed">Webnox Studio no se hace responsable de los daños y perjuicios que puedan derivarse del uso de esta web o de los contenidos que en ella se publican, conforme al Art. 1902 del Código Civil español y el Artikel 6:162 BW (Países Bajos). Los enlaces a webs de terceros se ofrecen con fines informativos y no implican endorsement.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">5. Protección de datos</h4>
            <p className="text-xs text-white/50 leading-relaxed">El tratamiento de datos personales se rige por nuestra Política de Privacidad, conforme al Reglamento (UE) 2016/679 (RGPD), la Ley Orgánica 3/2018 (España) y la Uitvoeringswet AVG (Países Bajos).</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">6. Legislación aplicable</h4>
            <p className="text-xs text-white/50 leading-relaxed">Las presentes condiciones se rigen por la legislación española o holandesa, según corresponda. Para cualquier litigio, las partes se someten a los juzgados y tribunales del domicilio del responsable, salvo que la ley disponga otra cosa. Conforme al Reglamento (UE) 524/2013, puedes acudir a la plataforma europea de resolución de litigios en línea: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-white/60 underline hover:text-white/80">ec.europa.eu/consumers/odr</a>.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">7. Modificaciones</h4>
            <p className="text-xs text-white/50 leading-relaxed">Webnox Studio se reserva el derecho de modificar las condiciones de esta web en cualquier momento, publicando los cambios en esta misma página.</p>
          </div>
        </div>
      )
    },
    {
      id: 'dudas-legales',
      title: t.legal.legalDoubts,
      icon: <Scale className="w-4 h-4" />,
      content: (
        <div className="space-y-5">
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">Resumen de cumplimiento normativo</h4>
            <p className="text-xs text-white/50 leading-relaxed mb-3">En Webnox cumplimos con la legislación europea, española y holandesa aplicable a servicios digitales. Aquí tienes un resumen:</p>
            <div className="space-y-2">
              <div className="glass-white rounded-lg p-3 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-white/70">RGPD (Reglamento UE 2016/679)</p>
                  <p className="text-[10px] text-white/40">Protección de datos personales. Derechos de acceso, rectificación, supresión, portabilidad, limitación y oposición. Aplicable en toda la UE.</p>
                </div>
              </div>
              <div className="glass-white rounded-lg p-3 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-white/70">Ley Orgánica 3/2018 (España)</p>
                  <p className="text-[10px] text-white/40">Ley española de protección de datos. Complementa el RGPD y establece las condiciones para el tratamiento de datos en España.</p>
                </div>
              </div>
              <div className="glass-white rounded-lg p-3 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-white/70">Ley 34/2002 LSSI-CE (España)</p>
                  <p className="text-[10px] text-white/40">Ley de Servicios de la Sociedad de la Información y Comercio Electrónico. Regula las obligaciones de información, cookies y comunicaciones comerciales.</p>
                </div>
              </div>
              <div className="glass-white rounded-lg p-3 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-white/70">Uitvoeringswet AVG (Países Bajos)</p>
                  <p className="text-[10px] text-white/40">Ley holandesa de implementación del RGPD. Complementa el reglamento europeo para el contexto neerlandés.</p>
                </div>
              </div>
              <div className="glass-white rounded-lg p-3 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-white/70">Telecommunicatiewet (Países Bajos)</p>
                  <p className="text-[10px] text-white/40">Ley holandesa de telecomunicaciones. Regula el uso de cookies y comunicaciones electrónicas.</p>
                </div>
              </div>
              <div className="glass-white rounded-lg p-3 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-white/70">Directiva (UE) 2019/770</p>
                  <p className="text-[10px] text-white/40">Sobre contenidos y servicios digitales. Garantiza los derechos del consumidor en contratos digitales.</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-2">Autoridades de supervisión</h4>
            <div className="space-y-2">
              <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="glass-white rounded-lg p-3 flex items-center gap-3 hover:bg-white/[0.04] transition-colors">
                <Globe className="w-4 h-4 text-white/40 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-white/70">Agencia Española de Protección de Datos (AEPD)</p>
                  <p className="text-[10px] text-white/40">aepd.es — Autoridad de control en España</p>
                </div>
              </a>
              <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="glass-white rounded-lg p-3 flex items-center gap-3 hover:bg-white/[0.04] transition-colors">
                <Globe className="w-4 h-4 text-white/40 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-white/70">Autoriteit Persoonsgegevens (AP)</p>
                  <p className="text-[10px] text-white/40">autoriteitpersoonsgegevens.nl — Autoridad de control en Países Bajos</p>
                </div>
              </a>
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="glass-white rounded-lg p-3 flex items-center gap-3 hover:bg-white/[0.04] transition-colors">
                <Globe className="w-4 h-4 text-white/40 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-white/70">Plataforma ODR de la UE</p>
                  <p className="text-[10px] text-white/40">Resolución de litigios en línea para consumidores europeos</p>
                </div>
              </a>
            </div>
          </div>
          <div className="glass-white rounded-xl p-4">
            <p className="text-xs text-white/50 leading-relaxed">Si tienes cualquier duda sobre el tratamiento de tus datos, tus derechos legales o el cumplimiento normativo de nuestros servicios, escríbenos a <a href="mailto:programaciones.mark@gmail.com" className="text-white/70 underline hover:text-white">programaciones.mark@gmail.com</a>. Te responderemos en un plazo máximo de 30 días conforme al Art. 12 RGPD.</p>
          </div>
          <div className="pt-2">
            <Button className="w-full bg-white text-black hover:bg-white/90 border-0 text-sm font-medium"
              onClick={() => { setLegalOpen(null); setPage('contacto') }}>
              <Mail className="w-4 h-4 mr-2" />{t.legal.contactLegalDoubt}
            </Button>
          </div>
        </div>
      )
    },
  ]

  return (
    <>
      {legalSections.map((section) => (
        <Dialog key={section.id} open={legalOpen === section.id} onOpenChange={(open) => setLegalOpen(open ? section.id : null)}>
          <DialogContent className="bg-[oklch(0.08_0.008_280)] border-white/10 text-white/80 max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto p-0">
            <div className="sticky top-0 z-10 bg-[oklch(0.08_0.008_280)] border-b border-white/[0.06] px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-white/50">{section.icon}</div>
                <DialogTitle className="text-sm sm:text-lg font-bold text-white">{section.title}</DialogTitle>
              </div>
              <button onClick={() => setLegalOpen(null)} className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-white/40 hover:text-white/80 transition-colors min-w-[32px] min-h-[32px]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-4 sm:px-6 py-4 sm:py-6">
              {section.content}
            </div>
          </DialogContent>
        </Dialog>
      ))}

      {/* Legal Section UI - visible on page */}
      <div className="border-t border-white/[0.04] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Scale className="w-4 h-4 text-white/30" />
              <h3 className="text-xs font-semibold text-white/40 tracking-[0.2em] uppercase">{t.legal.title}</h3>
            </div>
            <p className="text-[10px] sm:text-[11px] text-white/25 max-w-sm sm:max-w-lg mx-auto px-4">{t.legal.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {legalSections.map((section) => (
              <button key={section.id}
                onClick={() => setLegalOpen(section.id)}
                className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] px-3 sm:px-4 py-2 rounded-full glass-white text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all duration-300 group min-h-[40px]">
                <span className="text-white/30 group-hover:text-white/50 transition-colors">{section.icon}</span>
                {section.title}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
            <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-[10px] text-white/15 hover:text-white/40 transition-colors flex items-center gap-1 min-h-[28px]">
              <Globe className="w-3 h-3" />AEPD (España)
            </a>
            <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="text-[10px] text-white/15 hover:text-white/40 transition-colors flex items-center gap-1 min-h-[28px]">
              <Globe className="w-3 h-3" />AP (Nederland)
            </a>
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-[10px] text-white/15 hover:text-white/40 transition-colors flex items-center gap-1 min-h-[28px]">
              <Globe className="w-3 h-3" />ODR (EU)
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

/* ─── Cookie Consent Banner ─── */
function CookieBanner() {
  const { t } = useLanguage()
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    return !localStorage.getItem('webnox-cookie-consent')
  })
  const [showSettings, setShowSettings] = useState(false)
  const [analyticsConsent, setAnalyticsConsent] = useState(false)

  const saveConsent = (accepted: boolean, analytics: boolean) => {
    localStorage.setItem('webnox-cookie-consent', JSON.stringify({ accepted, analytics, timestamp: Date.now() }))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-0 left-0 right-0 z-[60] p-3 sm:p-4"
      >
        <div className="max-w-3xl mx-auto glass-white-strong rounded-2xl p-4 sm:p-6 border border-white/10">
          {!showSettings ? (
            <>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                  <Eye className="w-4 h-4 text-white/40" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white/90 mb-1">{t.cookieBanner.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{t.cookieBanner.description}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button onClick={() => saveConsent(true, true)} className="bg-white text-black hover:bg-white/90 px-4 h-10 min-h-[44px] rounded-lg text-xs font-medium transition-colors w-full sm:w-auto">{t.cookieBanner.accept}</button>
                <button onClick={() => saveConsent(true, false)} className="border border-white/10 text-white/50 hover:text-white hover:bg-white/5 px-4 h-10 min-h-[44px] rounded-lg text-xs transition-colors w-full sm:w-auto">{t.cookieBanner.reject}</button>
                <button onClick={() => setShowSettings(true)} className="text-white/30 hover:text-white/60 text-xs underline underline-offset-2 transition-colors min-h-[44px] flex items-center justify-center sm:ml-auto">{t.cookieBanner.settings}</button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-sm font-semibold text-white/90 mb-3">{t.cookieBanner.settingsTitle}</h3>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between glass-white rounded-lg p-3">
                  <div><p className="text-xs font-medium text-white/70">{t.cookieBanner.necessary}</p><p className="text-[10px] text-white/30">{t.cookieBanner.necessaryDesc}</p></div>
                  <input type="checkbox" checked disabled className="w-4 h-4 accent-white" />
                </div>
                <div className="flex items-center justify-between glass-white rounded-lg p-3">
                  <div><p className="text-xs font-medium text-white/70">{t.cookieBanner.analytics}</p><p className="text-[10px] text-white/30">{t.cookieBanner.analyticsDesc}</p></div>
                  <input type="checkbox" checked={analyticsConsent} onChange={(e) => setAnalyticsConsent(e.target.checked)} className="w-4 h-4 accent-white cursor-pointer" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => saveConsent(true, analyticsConsent)} className="bg-white text-black hover:bg-white/90 px-4 h-10 min-h-[44px] rounded-lg text-xs font-medium transition-colors">{t.cookieBanner.save}</button>
                <button onClick={() => setShowSettings(false)} className="border border-white/10 text-white/50 hover:text-white hover:bg-white/5 px-4 h-10 min-h-[44px] rounded-lg text-xs transition-colors">←</button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ─── WhatsApp Floating CTA Button ─── */
function WhatsAppButton() {
  const { t } = useLanguage()
  return (
    <a
      href="https://wa.me/31615893105?text=Hola%20Webnox"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.whatsapp.tooltip}
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] flex items-center justify-center shadow-lg shadow-black/20 transition-all hover:scale-105 min-w-[44px] min-h-[44px] group"
    >
      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#25D366] rounded-full animate-ping opacity-75" />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#25D366] rounded-full" />
    </a>
  )
}

/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */
function Footer({ setPage }: { setPage: (p: PageId) => void }) {
  const { t } = useLanguage()
  return (
    <footer className="border-t border-white/[0.04] mt-auto">
      <LegalDialogs setPage={setPage} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-xs font-bold text-white">W</span>
              </div>
              <span className="text-sm font-bold text-white/80 tracking-tight">WEBNOX</span>
            </div>
            <p className="text-[11px] sm:text-xs text-white/25 leading-relaxed whitespace-pre-line">{t.footer.description}</p>
          </div>
          <div>
            <h4 className="font-medium text-[10px] sm:text-xs text-white/50 mb-2 sm:mb-3 tracking-wider uppercase">{t.footer.navigation}</h4>
            <ul className="space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs text-white/25">
              <li><button onClick={() => { setPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="hover:text-white/60 transition-colors min-h-[28px] block">{t.nav.home}</button></li>
              <li><button onClick={() => { setPage('servicios'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="hover:text-white/60 transition-colors min-h-[28px] block">{t.nav.servicios}</button></li>
              <li><button onClick={() => { setPage('proyectos'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="hover:text-white/60 transition-colors min-h-[28px] block">{t.nav.proyectos}</button></li>
              <li><button onClick={() => { setPage('precios'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="hover:text-white/60 transition-colors min-h-[28px] block">{t.nav.precios}</button></li>
              <li><button onClick={() => { setPage('faq'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="hover:text-white/60 transition-colors min-h-[28px] block">{t.nav.faq}</button></li>
              <li><button onClick={() => { setPage('contacto'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="hover:text-white/60 transition-colors min-h-[28px] block">{t.nav.contacto}</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-[10px] sm:text-xs text-white/50 mb-2 sm:mb-3 tracking-wider uppercase">{t.footer.services}</h4>
            <ul className="space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs text-white/25">
              {t.footer.footerServices.map((service, i) => (
                <li key={i}><button onClick={() => { setPage('servicios'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="hover:text-white/60 transition-colors min-h-[28px] block">{service}</button></li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-medium text-[10px] sm:text-xs text-white/50 mb-2 sm:mb-3 tracking-wider uppercase">{t.footer.contact}</h4>
            <ul className="space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs text-white/25">
              <li><a href="mailto:programaciones.mark@gmail.com" className="hover:text-white/60 transition-colors flex items-center gap-1.5 min-h-[28px]"><Mail className="w-3 h-3" /><span className="break-all">programaciones.mark@gmail.com</span></a></li>
              <li><a href="https://wa.me/31615893105?text=Hola%20Webnox" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors flex items-center gap-1.5 min-h-[28px]"><Phone className="w-3 h-3" />+31 6 15893105</a></li>
              <li><span className="flex items-center gap-1.5 min-h-[28px]"><MapPin className="w-3 h-3" />{t.contacto.location}</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/[0.04] mt-6 sm:mt-8 pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-[10px] text-white/15 tracking-wide">{t.footer.copyright}</p>
          <div className="flex items-center gap-3 text-[10px] text-white/15">
            <Scale className="w-3 h-3 text-white/20" />
            <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="hover:text-white/40 transition-colors">AEPD</a>
            <span className="text-white/10">·</span>
            <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="hover:text-white/40 transition-colors">AP NL</a>
            <span className="text-white/10">·</span>
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="hover:text-white/40 transition-colors">ODR UE</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function Home() {
  return (
    <LanguageProvider>
      <HomeContent />
    </LanguageProvider>
  )
}

function HomeContent() {
  const { t, lang } = useLanguage()
  const [currentPage, setCurrentPage] = useState<PageId>('home')
  const [prefill, setPrefill] = useState<ContactPrefill>(null)

  const handleSetPage = (page: PageId) => {
    setCurrentPage(page)
    if (page !== 'contacto') setPrefill(null)
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage setPage={handleSetPage} />
      case 'servicios': return <ServiciosPage setPage={handleSetPage} />
      case 'proyectos': return <ProyectosPage />
      case 'precios': return <PreciosPage setPage={handleSetPage} setPrefill={setPrefill} />
      case 'faq': return <FAQPage setPage={handleSetPage} />
      case 'contacto': return <ContactoPage prefill={prefill} setPage={handleSetPage} />
      default: return <HomePage setPage={handleSetPage} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: 'Webnox Studio',
            description: t.hero.description,
            url: 'https://webnox.studio',
            email: 'programaciones.mark@gmail.com',
            telephone: '+31615893105',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'NL',
              addressLocality: 'Netherlands',
            },
            priceRange: '€499 - €1,999+',
            areaServed: ['ES', 'NL', 'EU'],
            serviceType: ['Web Development', 'UI/UX Design', 'E-commerce', 'CRO Optimization'],
            sameAs: [
              'https://markestein.es',
              'https://acontrabarra.es',
            ],
          }),
        }}
      />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium focus:outline-none">
        {t.skipToContent}
      </a>
      <InteractiveBackground />
      <ScrollProgress />
      <BackToTop />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar currentPage={currentPage} setPage={handleSetPage} />
        <main id="main-content" className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div key={`${currentPage}-${lang}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
        <CookieBanner />
        <WhatsAppButton />
        <Footer setPage={handleSetPage} />
      </div>
    </div>
  )
}
