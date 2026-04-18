import { Link } from "react-router-dom";
import { projectsData } from "../data";
import { ProjectCard } from "./ProjectCard";

const featuredProjects = projectsData.slice(0, 6);

export default function WorkGallery() {
  return (
    <section id="work" className="py-20 border-t border-white/5 relative scroll-m-20">
      <div className="absolute top-40 right-0 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full -z-10" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-heading text-foreground">Featured Work</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">A curated selection of my finest commercial edit and design projects.</p>
        </div>
        <Link to="/projects" className="text-primary hover:text-cyan-400 transition-colors font-medium text-lg flex items-center border border-primary/50 bg-primary/10 px-6 py-3 rounded-full hover:bg-primary/20 whitespace-nowrap">
          View All Portfolios &rarr;
        </Link>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
