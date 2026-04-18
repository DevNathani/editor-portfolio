import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, Wrench, Lightbulb } from "lucide-react";
import { Badge } from "../components/ui/badge";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import api from "../api";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        setProject(res.data);
      } catch (err) { 
        console.error(err);
      } finally { 
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <div className="py-32 text-center text-4xl font-heading animate-pulse">Loading Asset...</div>;
  if (!project) return <div className="py-32 text-center text-4xl font-heading">Project Not Found.</div>;

  return (
    <div className="py-20 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <Link to="/projects" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
      </Link>
      
      <div className="space-y-6 mb-12">
        <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 py-1.5 px-4 text-sm">{project.category?.name || "Uncategorized"}</Badge>
        <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-foreground">{project.title}</h1>
      </div>

      <div className="glass rounded-3xl overflow-hidden mb-12 border-white/10 p-2 shadow-2xl relative group">
        {project.videoLink ? (
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
             <iframe src={project.videoLink} className="w-full h-full" frameBorder="0" allowFullScreen></iframe>
          </div>
        ) : (
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-12 text-lg">
        <div className="md:col-span-2 space-y-10">
          <div>
            <h2 className="text-2xl font-bold font-heading mb-4 flex items-center"><Play className="w-6 h-6 mr-3 text-primary" /> The Project</h2>
            <div className="prose prose-invert prose-p:text-muted-foreground prose-a:text-primary max-w-none">
              <ReactMarkdown>{project.description}</ReactMarkdown>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading mb-4 flex items-center"><Lightbulb className="w-6 h-6 mr-3 text-yellow-400" /> What I Learned</h2>
            <div className="prose prose-invert prose-p:text-muted-foreground prose-a:text-primary max-w-none">
              <ReactMarkdown>{project.learned}</ReactMarkdown>
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border-white/10 h-fit">
          <h2 className="text-xl font-bold font-heading mb-6 flex items-center"><Wrench className="w-5 h-5 mr-3 text-primary" /> Tools Used</h2>
          <div className="flex flex-col gap-3">
            {project.toolsUsed.map(tool => (
              <Badge key={tool} variant="outline" className="bg-white/5 border-white/10 text-foreground py-2 justify-center text-sm">{tool}</Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
