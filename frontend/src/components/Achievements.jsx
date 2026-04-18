import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

export default function Achievements() {
  const [topAchievements, setTopAchievements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/achievements');
        setTopAchievements(res.data.slice(0, 2));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <section id="achievements" className="py-20 border-t border-white/5 scroll-m-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex flex-shrink-0 items-center justify-center">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-foreground">Achievements</h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">Milestones and recognitions that continually push me to evolve my craft.</p>
        </div>
        <Link to="/achievements" className="text-primary hover:text-cyan-400 transition-colors font-medium text-lg flex items-center border border-primary/50 bg-primary/10 px-6 py-3 rounded-full hover:bg-primary/20 whitespace-nowrap">
          View All Achievements &rarr;
        </Link>
      </div>

      {topAchievements.length > 0 ? (
        <div className="grid lg:grid-cols-2 gap-8">
          {topAchievements.map((achievement) => (
            <Card key={achievement._id} className="bg-card/40 border-white/10 glass-hover overflow-hidden rounded-2xl relative">
              <CardContent className="p-8">
                <Badge variant="outline" className="mb-4 text-primary border-primary/50 bg-primary/10">{achievement.year}</Badge>
                <h3 className="text-2xl font-bold font-heading mb-3 text-foreground">{achievement.title}</h3>
                <p className="text-muted-foreground mb-6 text-lg">{achievement.description}</p>

                <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin' }}>
                  {achievement.images.map((img, i) => (
                    <img key={i} src={img} alt={`Proof of ${achievement.title}`} className="h-32 min-w-[200px] sm:h-48 sm:min-w-[280px] object-cover rounded-xl border border-white/10 shadow-lg shrink-0" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-card/20 rounded-2xl border border-white/5 shadow-inner">
          <p className="text-xl font-heading text-muted-foreground">No achievements till now, will have them sure!</p>
        </div>
      )}
    </section>
  );
}
