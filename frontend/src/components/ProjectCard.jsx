import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";

export function ProjectCard({ project }) {
  const categoryName = project.category?.name || "Generic";

  return (
    <Link to={`/project/${project._id}`} className="block">
      <Card className="group overflow-hidden bg-card/40 border-white/10 glass-hover cursor-pointer rounded-2xl">
        <CardContent className="p-0 relative">
          <div className="relative aspect-[4/3] sm:aspect-video overflow-hidden bg-muted">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
              {categoryName === "Videos" || categoryName === "Shorts" ? (
                <div className="w-16 h-16 rounded-full bg-primary text-black flex items-center justify-center neon-glow transform scale-90 group-hover:scale-100 transition-transform duration-500 delay-100">
                  <Play fill="currentColor" className="w-6 h-6 ml-1" />
                </div>
              ) : (
                <div className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  View
                </div>
              )}
            </div>
          </div>
          <div className="p-6">
            <Badge variant="secondary" className="mb-4 bg-secondary/80 hover:bg-secondary text-secondary-foreground border-white/5">{categoryName}</Badge>
            <h3 className="text-2xl font-bold font-heading group-hover:text-primary transition-colors text-foreground">{project.title}</h3>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
