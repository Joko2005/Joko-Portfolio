import { Header } from "../components/ui";
import {
  HeroSection,
  AboutSection,
  ContactSection,
  JourneySection,
  SkillsSection,
  WorkSection,
} from "../components/sections";

export default function Home() {
  return (
    <div id="top" className="min-h-screen bg-bg text-ink">
      <Header />

      <main className="mx-25 w-auto max-w-7xl pb-12 pt-28">
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
