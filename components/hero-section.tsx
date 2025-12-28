"use client"

import { useEffect, useRef } from "react"
import { Github, Linkedin, Mail, Phone } from "lucide-react"
import { Raleway } from "next/font/google"

const raleway = Raleway({ subsets: ["latin"] })

declare global {
  interface Window {
    gsap: any
    ScrollTrigger: any
    TextPlugin: any
  }
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLParagraphElement>(null)
  const line2Ref = useRef<HTMLParagraphElement>(null)
  const line3Ref = useRef<HTMLParagraphElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkGSAP = setInterval(() => {
      if (window.gsap && window.ScrollTrigger && window.TextPlugin) {
        clearInterval(checkGSAP)
        const gsap = window.gsap
        gsap.registerPlugin(window.ScrollTrigger, window.TextPlugin)

        gsap.fromTo(
          nameRef.current,
          { opacity: 0, y: -50, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
          },
        )

        const tl = gsap.timeline()

        tl.to(line1Ref.current, {
          duration: 1.5,
          text: "Graduate SDE at Fynd,",
          ease: "none",
          delay: 0.8,
        })
          .to(line2Ref.current, {
            duration: 2,
            text: "crafting full-stack experiences with Next.js, TypeScript,",
            ease: "none",
            delay: 0.3,
          })
          .to(line3Ref.current, {
            duration: 1.8,
            text: "and modern web technologies.",
            ease: "none",
            delay: 0.3,
          })

        gsap.fromTo(
          linksRef.current?.children || [],
          { opacity: 0, y: 30, scale: 0 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            delay: 4,
            ease: "back.out(1.7)",
          },
        )

        gsap.to(sectionRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
          y: 200,
          scale: 1.05,
          opacity: 0.5,
        })
      }
    }, 100)

    return () => clearInterval(checkGSAP)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="section relative flex items-center overflow-hidden"
      style={{
        backgroundImage:
          "url(/placeholder.svg?height=1080&width=1920&query=professional+male+developer+portrait+cinematic+dark+moody+lighting)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />

      <div className="absolute inset-0 bg-background/40" />

      <div className="relative z-10 ml-8 max-w-2xl px-6 md:ml-16 lg:ml-24">
        <h1
          ref={nameRef}
          className="mb-8 font-sans text-7xl font-black tracking-tighter text-foreground drop-shadow-2xl md:text-9xl"
          style={{
            textShadow: "0 0 40px rgba(101, 100, 255, 0.5), 0 0 80px rgba(101, 100, 255, 0.3)",
          }}
        >
          TEJAS M
        </h1>

        <div
          className="mb-12 space-y-2 text-lg leading-relaxed text-foreground md:text-xl"
          style={{ fontFamily: raleway.style.fontFamily }}
        >
          <p ref={line1Ref} className="min-h-[28px]" />
          <p ref={line2Ref} className="min-h-[28px]" />
          <p ref={line3Ref} className="min-h-[28px]" />
        </div>

        <div ref={linksRef} className="flex flex-wrap items-center gap-4">
          <a
            href="https://github.com/tejasm"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-xl border border-primary/30 bg-card/40 px-5 py-3 backdrop-blur-sm transition-all hover:scale-105 hover:border-primary hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/30"
          >
            <Github className="h-5 w-5 transition-transform group-hover:rotate-12" />
            <span className="font-medium">GitHub</span>
          </a>
          <a
            href="https://linkedin.com/in/tejasm"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-xl border border-primary/30 bg-card/40 px-5 py-3 backdrop-blur-sm transition-all hover:scale-105 hover:border-primary hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/30"
          >
            <Linkedin className="h-5 w-5 transition-transform group-hover:rotate-12" />
            <span className="font-medium">LinkedIn</span>
          </a>
          <a
            href="mailto:tejasmt884@gmail.com"
            className="group flex items-center gap-2 rounded-xl border border-primary/30 bg-card/40 px-5 py-3 backdrop-blur-sm transition-all hover:scale-105 hover:border-primary hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/30"
          >
            <Mail className="h-5 w-5 transition-transform group-hover:rotate-12" />
            <span className="font-medium">Email</span>
          </a>
          <a
            href="tel:+917411545570"
            className="group flex items-center gap-2 rounded-xl border border-primary/30 bg-card/40 px-5 py-3 backdrop-blur-sm transition-all hover:scale-105 hover:border-primary hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/30"
          >
            <Phone className="h-5 w-5 transition-transform group-hover:rotate-12" />
            <span className="font-medium">Call</span>
          </a>
        </div>
      </div>

      <div className="pointer-events-none absolute -right-20 top-20 h-96 w-96 rounded-full bg-primary/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 right-40 h-96 w-96 rounded-full bg-accent/20 blur-[100px]" />
    </section>
  )
}
