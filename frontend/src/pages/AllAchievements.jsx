import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Award, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

export default function AllAchievements() {
  const [achievementsData, setAchievementsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/achievements');
        setAchievementsData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="py-20 text-center animate-pulse text-2xl font-heading">Syncing timeline data...</div>;

  return (
    <div className="py-20 animate-in fade-in duration-700">
      <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
      </Link>
      <div className="flex items-center gap-4 mb-4">
        <div className="p-4 bg-primary/10 text-primary rounded-xl">
          <Award className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-heading">Complete Timeline</h1>
      </div>
      <p className="text-muted-foreground text-lg max-w-3xl mb-12">
        A chronological showcase of my awards, recognitions, and major milestones.
      </p>

      {achievementsData.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-8">
          {achievementsData.map((achievement) => (
            <Card key={achievement._id} className="bg-card/40 border-white/10 glass-hover overflow-hidden rounded-2xl relative">
              <CardContent className="p-8">
                <Badge variant="outline" className="mb-4 text-primary border-primary/50 bg-primary/10">{achievement.year}</Badge>
                <h3 className="text-2xl font-bold font-heading mb-3 text-foreground">{achievement.title}</h3>
                <p className="text-muted-foreground mb-6 text-lg">{achievement.description}</p>

                <div className="flex flex-wrap gap-4 pb-4">
                  {achievement.images.map((img, i) => (
                    <img key={i} src={img} alt={`Proof of ${achievement.title}`} className="h-32 min-w-[200px] sm:h-48 sm:min-w-[280px] object-cover rounded-xl border border-white/10 shadow-lg" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-card/20 rounded-2xl border border-white/5 shadow-inner">
          <p className="text-2xl font-heading text-muted-foreground">No achievements till now, will have them sure!</p>
        </div>
      )}
    </div>
  );
}
