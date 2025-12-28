"use client";

import { useEffect, useRef } from "react";

const skills = [
  {
    name: "TypeScript",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    name: "React",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Next.js",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  },
  {
    name: "Node.js",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "MongoDB",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
  {
    name: "PostgreSQL",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },
  {
    name: "Python",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "DevOps",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg",
  },
  {
    name: "Git",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  {
    name: "Docker",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
  {
    name: "AWS",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  },
  {
    name: "Generative & Agentic AI",
    logo: "/openai.svg",
  },
];

export default function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    const checkGSAP = setInterval(() => {
      if (window.gsap && window.ScrollTrigger) {
        clearInterval(checkGSAP);
        const gsap = window.gsap;

        // Stagger animation for cards
        gsap.fromTo(
          gridRef.current?.children || [],
          {
            opacity: 0,
            scale: 0.5,
            rotateY: -180,
          },
          {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            duration: 0.8,
            stagger: {
              amount: 1.2,
              from: "random",
            },
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
            },
          }
        );

        // Continuous floating animation
        const cards = gridRef.current?.children;
        if (cards) {
          Array.from(cards).forEach((card, index) => {
            gsap.to(card, {
              y: "random(-20, 20)",
              duration: "random(2, 4)",
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              delay: index * 0.1,
            });
          });
        }
      }
    }, 100);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(checkGSAP);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-secondary/20 to-background px-6 py-20"
    >
      <div className="relative w-full max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-sans text-6xl font-black tracking-tight text-white md:text-7xl">
            Tech Stack
          </h2>
          <p className="text-lg text-muted-foreground">
            Technologies I work with daily
          </p>
        </div>

        <div
          ref={gridRef}
          className="relative grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              className="group relative"
              style={{
                perspective: "1000px",
              }}
            >
              {/* Gradient border effect */}
              <div className="absolute -inset-0.5 rounded-2xl bg-white opacity-0 blur-lg transition-all duration-500 group-hover:opacity-75" />

              {/* Card */}
              <div
                className="relative flex h-40 flex-col items-center justify-center gap-4 rounded-2xl border border-border/50 bg-card/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-primary/50 hover:bg-card"
                style={{
                  transformStyle: "preserve-3d",
                  transition: "transform 0.3s ease",
                }}
                onMouseMove={(e) => {
                  const card = e.currentTarget;
                  const rect = card.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;
                  const rotateX = (y - centerY) / 10;
                  const rotateY = (centerX - x) / 10;

                  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)";
                }}
              >
                {/* Shine effect */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Logo */}
                <div className="relative z-10 flex h-16 w-16 items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  {/* Colored glow behind logo */}
                  <div className="absolute inset-0 rounded-full bg-white/20 blur-xl transition-all duration-300 group-hover:blur-2xl" />
                  <img
                    src={skill.logo || "/placeholder.svg"}
                    alt={skill.name}
                    className="relative z-10 h-14 w-14 object-contain drop-shadow-2xl"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      if (!img.src.includes("/placeholder.svg"))
                        img.src = "/placeholder.svg";
                    }}
                  />
                </div>

                {/* Skill name */}
                <p className="relative z-10 text-center text-sm font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
                  {skill.name}
                </p>

                {/* Corner accent */}
                <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary/50 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:shadow-lg group-hover:shadow-primary/50" />
              </div>
            </div>
          ))}
        </div>

        {/* Floating particles background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-primary/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${
                  5 + Math.random() * 10
                }s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Ambient effects */}
      <div className="pointer-events-none absolute left-20 top-20 h-96 w-96 rounded-full bg-white/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-20 right-20 h-96 w-96 rounded-full bg-white/5 blur-[120px]" />
    </section>
  );
}
