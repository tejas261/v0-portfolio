"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
  ts: number;
};

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function ChatSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Tejas. Feel free to ask me anything about my work, skills, or let's just chat!",
      ts: Date.now(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const checkGSAP = setInterval(() => {
      if (window.gsap && window.ScrollTrigger) {
        clearInterval(checkGSAP);
        const gsap = window.gsap;

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
          }
        );
      }
    }, 100);

    return () => clearInterval(checkGSAP);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = message;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMsg, ts: Date.now() },
    ]);
    setMessage("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const errText = data?.error || `Error ${res.status}`;
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: errText.includes("Index not built")
              ? "The AI index isn't built yet. Please initialize it by calling POST /api/agent/build with your resume file paths or text."
              : `Sorry, I ran into an issue: ${errText}`,
            ts: Date.now(),
          },
        ]);
        return;
      }

      const data = (await res.json()) as { answer?: string };
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || "I couldn't generate an answer.",
          ts: Date.now(),
        },
      ]);
    } catch (error: any) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Network error: ${error?.message || "unknown"}`,
          ts: Date.now(),
        },
      ]);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="section relative min-h-screen bg-linear-to-b from-background to-secondary/30 px-6 py-20"
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="font-sans text-5xl font-black tracking-tight text-foreground md:text-6xl">
            Let's Connect
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Ask me anything about my work, experience, or skills.
          </p>
        </div>

        <div ref={chatRef} className="relative">
          {/* Messages area */}
          <div className="relative z-10 h-[60vh] md:h-[65vh] space-y-6 overflow-y-auto p-4 sm:p-6 messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold shadow-lg ${
                    msg.role === "assistant"
                      ? "bg-white text-black"
                      : "bg-foreground text-background"
                  }`}
                >
                  {msg.role === "assistant" ? "T" : "U"}
                </div>

                {/* Message bubble */}
                <div
                  className={`group relative max-w-[70%] rounded-2xl px-6 py-4 shadow-lg transition-all hover:scale-[1.01] ${
                    msg.role === "assistant"
                      ? "rounded-tl-none bg-white/10 text-foreground backdrop-blur-md ring-1 ring-white/10"
                      : "rounded-tr-none bg-primary text-primary-foreground"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: (props: React.ComponentProps<"a">) => (
                          <a {...props} download />
                        ),
                      }}
                      className="prose prose-invert prose-p:m-0 prose-pre:bg-black/30 prose-code:px-1 prose-code:py-0.5 prose-code:bg-black/20 prose-code:rounded"
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  )}

                  {/* Timestamp */}
                  <span
                    className={`mt-2 text-xs ${
                      msg.role === "assistant"
                        ? "text-muted-foreground"
                        : "opacity-70"
                    }`}
                  >
                    {formatTime(msg.ts)}
                  </span>

                  {/* Glow effect */}
                  <div
                    className={`absolute -inset-1 -z-10 rounded-2xl opacity-0 blur-xl transition-opacity group-hover:opacity-100 ${
                      msg.role === "assistant" ? "bg-white/20" : "bg-white/30"
                    }`}
                  />
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold shadow-lg bg-white text-black">
                  T
                </div>
                <div className="group relative max-w-[70%] rounded-2xl px-6 py-4 shadow-lg transition-all rounded-tl-none bg-card/90 backdrop-blur-xl">
                  <div className="typing text-foreground">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="absolute -inset-1 -z-10 rounded-2xl opacity-0 blur-xl transition-opacity group-hover:opacity-100 bg-white/20" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="sticky bottom-0 z-10 mt-2 bg-background/60 px-2 py-4 backdrop-blur"
          >
            <div className="relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full rounded-full border-border/50 bg-background/70 px-6 py-6 pr-14 text-base backdrop-blur-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1.5 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Tejas M • Bengaluru
          </p>
        </div>
      </div>

      {/* Ambient glow effects */}
      <div className="pointer-events-none absolute left-1/4 top-20 h-96 w-96 rounded-full bg-white/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-white/5 blur-[120px]" />
      <style jsx>{`
        .messages {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .messages::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        .typing {
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .typing span {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: currentColor;
          opacity: 0.3;
          display: inline-block;
          animation: typing-blink 1.4s infinite ease-in-out;
        }
        .typing span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing span:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes typing-blink {
          0%,
          80%,
          100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-3px);
          }
        }
      `}</style>
    </section>
  );
}
