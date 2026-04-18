import { Grid } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ProjectCard } from "../components/ProjectCard";
import { useEffect, useState } from "react";
import api from "../api";

export default function Projects() {
  const [projectsData, setProjectsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await api.get('/projects');
        setProjectsData(prodRes.data);
        const catRes = await api.get('/categories');
        setCategories(catRes.data);
      } catch (err) { 
        console.error(err);
      } finally { 
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="py-20 text-center text-xl animate-pulse">Establishing secure connection...</div>;
  return (
    <div className="py-12 animate-in fade-in duration-700">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-4 bg-primary/10 text-primary rounded-xl">
          <Grid className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-heading">Complete Collection</h1>
      </div>
      <p className="text-muted-foreground text-lg max-w-3xl mb-12">
        A deep dive into all of my creative work, organized by category. From full-length commercial cuts to vibrant brand posters.
      </p>

      <Tabs defaultValue="all" className="w-full">
        <div className="w-full overflow-x-auto pb-4 mb-6" style={{scrollbarWidth: 'thin'}}>
          <TabsList className="bg-secondary/50 border border-white/10 justify-start h-14 w-max rounded-xl p-1 gap-2">
            <TabsTrigger value="all" className="rounded-lg h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">All Projects</TabsTrigger>
            {categories.map(c => (
               <TabsTrigger key={c._id} value={c.name} className="rounded-lg h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">{c.name}</TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0 outline-none ease-in-out">
          {projectsData.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projectsData.map((project) => <ProjectCard key={project._id} project={project} />)}
            </div>
          ) : (
            <div className="py-20 text-center bg-card/20 rounded-2xl border border-white/5 shadow-inner">
              <p className="text-2xl font-heading text-muted-foreground">No projects till now, will make them sure!</p>
            </div>
          )}
        </TabsContent>
        {categories.map(cat => {
          const catProjects = projectsData.filter(p => p.category?.name === cat.name);
          return (
            <TabsContent key={cat._id} value={cat.name} className="mt-0 outline-none ease-in-out">
              {catProjects.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {catProjects.map((project) => <ProjectCard key={project._id} project={project} />)}
                </div>
              ) : (
                <div className="py-20 text-center bg-card/20 rounded-2xl border border-white/5 shadow-inner">
                  <p className="text-2xl font-heading text-muted-foreground">No {cat.name} till now, will make them sure!</p>
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
