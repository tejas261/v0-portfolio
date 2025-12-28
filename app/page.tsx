import HeroSection from "@/components/hero-section"
import JourneySection from "@/components/journey-section"
import SkillsSection from "@/components/skills-section"
import ChatSection from "@/components/chat-section"
import GSAPProvider from "@/components/gsap-provider"

export default function Home() {
  return (
    <GSAPProvider>
      <main className="relative overflow-x-hidden">
        <HeroSection />
        <JourneySection />
        <SkillsSection />
        <ChatSection />
      </main>
    </GSAPProvider>
  )
}
