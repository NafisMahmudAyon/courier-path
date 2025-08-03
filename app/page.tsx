import AboutSection from "@/components/AboutSection";
import AgentSection from "@/components/AgentSection";
import CustomerSection from "@/components/CustomerSection";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <div className="min-h-screen w-full relative bg-gradient">
      
      <HeroSection />
      <AboutSection />
      <CustomerSection />
      <AgentSection />
    </div>
  );
}
