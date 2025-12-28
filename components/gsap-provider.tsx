"use client"

import type React from "react"

import { useEffect } from "react"

export default function GSAPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Load GSAP from CDN
    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"
    script.async = true
    document.head.appendChild(script)

    const scrollTriggerScript = document.createElement("script")
    scrollTriggerScript.src = "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"
    scrollTriggerScript.async = true
    document.head.appendChild(scrollTriggerScript)

    const textPluginScript = document.createElement("script")
    textPluginScript.src = "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/TextPlugin.min.js"
    textPluginScript.async = true
    document.head.appendChild(textPluginScript)

    return () => {
      document.head.removeChild(script)
      document.head.removeChild(scrollTriggerScript)
      document.head.removeChild(textPluginScript)
    }
  }, [])

  return <>{children}</>
}
