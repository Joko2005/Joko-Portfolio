import { Header } from "../components/ui";
import {
  HeroSection,
  AboutSection,
  ContactSection,
  JourneySection,
  SkillsSection,
  WorkSection,
} from "../sections";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#111111]">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <WorkSection />
        <JourneySection />
        <ContactSection />
      </main>
    </div>
  );
}
