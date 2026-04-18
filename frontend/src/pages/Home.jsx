import HeroSection from "../components/HeroSection";
import WorkGallery from "../components/WorkGallery";
import SkillsServices from "../components/SkillsServices";
import Achievements from "../components/Achievements";

export default function Home() {
  return (
    <div className="space-y-20 w-full overflow-hidden">
      <HeroSection />
      <Achievements />
      <WorkGallery />
      <SkillsServices />
    </div>
  );
}
