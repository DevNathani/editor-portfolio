import { ArrowRight, Sparkles, Camera, PlayCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Typewriter from 'typewriter-effect';
import { ContactDialog } from "./ContactDialog";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 flex flex-col lg:flex-row items-center gap-12">
      <div className="flex-1 space-y-8 relative z-10 w-full">
        <div className="space-y-4">
          <Badge variant="outline" className="border-primary/50 text-foreground px-3 py-1 bg-primary/10 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 mr-2 text-primary" />
            Available for Freelance
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1]">
            Hi, I'm <span className="text-gradient">Alex</span>. <br/>
            <span className="text-3xl md:text-4xl lg:text-5xl text-foreground font-semibold mt-4 block h-[60px] md:h-[80px]">
              <Typewriter
                options={{
                  strings: [
                    'Video Editor.',
                    'Graphic Designer.',
                    'Visual Storyteller.',
                    'Motion Artist.'
                  ],
                  autoStart: true,
                  loop: true,
                  wrapperClassName: "text-primary",
                  cursorClassName: "text-primary animate-pulse text-4xl block w-fit"
                }}
              />
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
            I help modern creators and visionary brands build high-end visual identities, cinematic cuts, and dynamic motion graphics. Let my work speak for itself.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/projects">
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground neon-glow px-8 py-6 rounded-xl text-lg font-medium transition-all hover:scale-105 active:scale-95">
              View My Work <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <ContactDialog trigger={
            <Button variant="outline" className="w-full sm:w-auto glass hover:bg-white/10 px-8 py-6 rounded-xl text-lg border-white/10 transition-all font-medium">
              Contact Me
            </Button>
          } />
        </div>
        <div className="flex gap-4 items-center pt-2">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-3 glass rounded-full hover:text-primary hover:border-primary/50 transition-colors">
            <Camera className="w-5 h-5"/>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-3 glass rounded-full hover:text-primary hover:border-primary/50 transition-colors">
            <PlayCircle className="w-5 h-5"/>
          </a>
        </div>
      </div>
      <div className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[600px] mt-10 lg:mt-0">
        <div className="absolute inset-x-0 bottom-0 top-1/4 rounded-full bg-primary/20 blur-[120px] -z-10 animate-pulse" style={{ animationDuration: '4s' }} />
        <img 
          src="/hero.png" 
          alt="Cyberpunk Avatar" 
          className="w-full h-[500px] lg:h-[600px] object-cover rounded-[2rem] border border-white/10 shadow-2xl transition-transform duration-700 hover:scale-[1.02]"
        />
      </div>
    </section>
  );
}
