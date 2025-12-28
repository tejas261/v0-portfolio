"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ChatSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm Tejas. Feel free to ask me anything about my work, skills, or let's just chat!",
    },
  ])

  useEffect(() => {
    const checkGSAP = setInterval(() => {
      if (window.gsap && window.ScrollTrigger) {
        clearInterval(checkGSAP)
        const gsap = window.gsap

        gsap.fromTo(
          chatRef.current,
          { opacity: 0, y: 100, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: chatRef.current,
              start: "top 80%",
            },
          },
        )
      }
    }, 100)

    return () => clearInterval(checkGSAP)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: message }])
    setMessage("")

    // Simulate response (backend integration later)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Thanks for your message! I'll get back to you soon.",
        },
      ])
    }, 1000)
  }

  return (
    <section
      ref={sectionRef}
      className="section relative flex items-center justify-center bg-gradient-to-b from-background to-secondary/30 px-6 py-20"
    >
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">AI-Powered Chat Coming Soon</span>
          </div>
          <h2 className="font-sans text-5xl font-black text-foreground md:text-6xl">{"Let's Connect"}</h2>
        </div>

        <div
          ref={chatRef}
          className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card/80 via-card/60 to-card/80 shadow-2xl backdrop-blur-2xl"
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/3 to-white/5" />

          {/* Messages area */}
          <div className="relative z-10 h-[500px] space-y-6 overflow-y-auto p-8 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {/* Avatar */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold shadow-lg ${
                    msg.role === "assistant" ? "bg-white text-black" : "bg-foreground text-background"
                  }`}
                >
                  {msg.role === "assistant" ? "T" : "U"}
                </div>

                {/* Message bubble */}
                <div
                  className={`group relative max-w-[70%] rounded-2xl px-6 py-4 shadow-lg transition-all hover:scale-[1.02] ${
                    msg.role === "assistant"
                      ? "rounded-tl-none bg-card/90 backdrop-blur-xl"
                      : "rounded-tr-none bg-foreground text-background"
                  }`}
                >
                  <p className={`text-sm leading-relaxed ${msg.role === "assistant" ? "text-foreground" : ""}`}>
                    {msg.content}
                  </p>

                  {/* Timestamp */}
                  <p className={`mt-2 text-xs ${msg.role === "assistant" ? "text-muted-foreground" : "opacity-70"}`}>
                    Just now
                  </p>

                  {/* Glow effect */}
                  <div
                    className={`absolute -inset-1 -z-10 rounded-2xl opacity-0 blur-xl transition-opacity group-hover:opacity-100 ${
                      msg.role === "assistant" ? "bg-white/20" : "bg-white/30"
                    }`}
                  />
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative z-10 border-t border-border/50 bg-card/50 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-full border-border/50 bg-background/50 px-6 py-6 text-base backdrop-blur-sm transition-all focus:border-primary focus:shadow-lg focus:shadow-primary/20"
              />
              <Button
                type="submit"
                size="icon"
                className="h-12 w-12 shrink-0 rounded-full bg-white text-black shadow-lg transition-all hover:scale-110 hover:shadow-xl hover:shadow-white/50"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">© 2025 Tejas M • Built with Next.js, TypeScript & GSAP</p>
        </div>
      </div>

      {/* Ambient glow effects */}
      <div className="pointer-events-none absolute left-1/4 top-20 h-96 w-96 rounded-full bg-white/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-white/5 blur-[120px]" />
    </section>
  )
}
