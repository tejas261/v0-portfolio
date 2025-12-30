"use client";

import { useEffect, useRef } from "react";

const journeySteps = [
  // {
  //   title: "Pre-University",
  //   place: "KLE's PU College",
  //   detail: "PCMB • 87.5%",
  //   year: "2018-2020",

  //   emoji: "💻",
  //   color: "from-white to-gray-300",
  //   bgColor: "bg-white/10",
  // },
  {
    title: "Graduation",
    place: "VTU - CSE",
    detail: "CGPA: 8.3",
    year: "2020-2024",
    emoji: "🎓",
    color: "from-gray-300 to-gray-400",
    bgColor: "bg-white/15",
  },
  {
    title: "Fullstack Intern",
    place: "Fynd",
    detail: "Next.js & Tailwind",
    year: "Jul-Sep 2024",
    emoji: "🚀",
    color: "from-gray-400 to-gray-500",
    bgColor: "bg-white/20",
  },
  {
    title: "Graduate SDE",
    place: "Fynd",
    detail: "TypeScript, Node & MongoDB",
    year: "Oct 2024-Present",
    emoji: "⚡",
    color: "from-gray-500 to-gray-600",
    bgColor: "bg-white/25",
  },
];

export default function JourneySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkGSAP = setInterval(() => {
      if (window.gsap && window.ScrollTrigger) {
        clearInterval(checkGSAP);
        const gsap = window.gsap;
        const ScrollTrigger = window.ScrollTrigger;

        const container = containerRef.current;
        if (!container) return;

        const sections = container.querySelectorAll(".journey-step");

        // Create horizontal scroll
        gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 1,
            snap: 1 / (sections.length - 1),
            end: () => "+=" + container.offsetWidth * 2,
          },
        });

        // Parallax effect for each card
        sections.forEach((section, index) => {
          const card = section.querySelector(".journey-card");

          gsap.fromTo(
            card,
            {
              y: 100,
              opacity: 0,
              rotateY: -30,
              scale: 0.8,
            },
            {
              y: 0,
              opacity: 1,
              rotateY: 0,
              scale: 1,
              scrollTrigger: {
                trigger: section,
                containerAnimation: gsap.to(sections, {
                  xPercent: -100 * (sections.length - 1),
                }),
                start: "left center",
                end: "right center",
                scrub: 1,
              },
            }
          );
        });
      }
    }, 100);

    return () => clearInterval(checkGSAP);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section relative overflow-hidden bg-linear-to-br from-background via-secondary/30 to-background"
    >
      <div className="absolute left-0 right-0 top-0 z-10 px-6 pt-20">
        <h2
          className="text-center font-sans text-6xl font-black tracking-tight text-foreground md:text-7xl"
          style={{
            textShadow: "0 0 40px rgba(255, 255, 255, 0.3)",
          }}
        >
          Journey
        </h2>
      </div>

      <div ref={containerRef} className="relative h-screen">
        <div className="flex h-full items-center">
          {journeySteps.map((step, index) => (
            <div
              key={index}
              className="journey-step flex h-full w-screen shrink-0 items-center justify-center px-20"
            >
              <div className="journey-card group relative">
                {/* Road path visual */}
                <div className="absolute -top-40 left-1/2 h-80 w-1 -translate-x-1/2">
                  <div
                    className={`h-full w-full bg-linear-to-b ${step.color} opacity-30`}
                  />
                  <div
                    className={`absolute top-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full border-4 border-background ${step.bgColor} shadow-lg`}
                  />
                </div>

                {/* Main card */}
                <div
                  className="relative overflow-hidden rounded-3xl border border-border/50 bg-white/5 p-0.75 shadow-2xl transition-all duration-500 hover:scale-110 hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
                  style={{
                    perspective: "1000px",
                  }}
                >
                  <div className="relative w-full overflow-hidden rounded-3xl bg-card/95 backdrop-blur-xl">
                    {/* Emoji background */}
                    <div className="absolute right-0 top-0 text-[200px] opacity-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                      {step.emoji}
                    </div>

                    <div className="relative z-10 flex h-full w-full flex-col justify-between p-10 sm:max-w-40 md:max-w-125">
                      {/* Year badge */}
                      <div className="inline-flex self-start">
                        <span
                          className={`rounded-full ${step.bgColor} px-4 py-2 text-sm font-bold backdrop-blur-sm`}
                        >
                          {step.year}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="space-y-4">
                        <div className="text-7xl mt-4">{step.emoji}</div>
                        <div className="flex flex-col gap-2 items-start">
                          <span className="font-sans wrap-break-words text-4xl font-black text-foreground sm:max-w-32 md:max-w-full">
                            {step.title}
                          </span>
                          <span className="text-2xl sm:max-w-20 md:max-w-full wrap-break-words font-bold text-white">
                            {step.place}
                          </span>
                          <span className="text-lg text-muted-foreground">
                            {step.detail}
                          </span>
                        </div>
                      </div>

                      {/* Step indicator */}
                      <div className="flex items-center gap-2 mt-4">
                        {journeySteps.map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all ${
                              i === index ? "w-12 bg-white" : "w-1.5 bg-border"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Glow effect */}
                    <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/20 opacity-20 blur-3xl transition-all group-hover:opacity-40" />
                  </div>
                </div>

                {/* Arrow indicator */}
                {index < journeySteps.length - 1 && (
                  <div className="absolute -right-32 top-1/2 -translate-y-1/2 text-6xl opacity-30">
                    →
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <p className="text-sm font-medium text-muted-foreground">
          Scroll to explore →
        </p>
      </div>

      {/* Ambient effects */}
      <div className="pointer-events-none absolute left-10 top-1/2 h-96 w-96 rounded-full bg-white/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-10 h-96 w-96 rounded-full bg-white/5 blur-[120px]" />
    </section>
  );
}
