import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { MonitorPlay, PenTool, Layers, Film } from "lucide-react";

const skills = [
  "Adobe Premiere Pro", "After Effects", "DaVinci Resolve", "Final Cut", "Photoshop", "Illustrator", "Figma", "Cinema 4D", "Blender"
];

const services = [
  { icon: Film, title: "Video Editing", desc: "Cinematic cuts, color grading, and audio syncing for YouTube, commercials, and short films." },
  { icon: Layers, title: "Motion Graphics", desc: "Dynamic text animations, lower thirds, and impactful intros built in After Effects." },
  { icon: PenTool, title: "Brand Identity", desc: "Logo design, typography sets, and modern brand guidelines crafted for the digital era." },
  { icon: MonitorPlay, title: "Web Graphics", desc: "High-converting thumbnails, social media kits, and UI marketing assets." },
]

export default function SkillsServices() {
  return (
    <section id="skills" className="py-20 border-t border-white/5 relative">
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8 sticky top-32 h-fit">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading text-foreground">Toolkit & Services</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">The industry-standard tools and specific services I offer to bring your ideas to life.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <Badge key={skill} variant="outline" className="border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-primary/20 hover:text-primary hover:border-primary/50 transition-colors cursor-default text-foreground/80">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
          {services.map((svc, i) => (
            <Card key={i} className="glass p-8 hover:-translate-y-2 transition-transform duration-300 border-white/10 bg-white/5 group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <svc.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 font-heading text-foreground">{svc.title}</h3>
              <p className="text-muted-foreground leading-loose">{svc.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
