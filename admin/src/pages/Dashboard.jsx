import React from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useCategories } from '../context/CategoryContext';
import { useAchievements } from '../context/AchievementContext';
import { useProfile } from '../context/ProfileContext';
import { useSkillsServices } from '../context/SkillsServicesContext';
import { useUser } from '../context/UserContext';
import { Plus, Trash, Edit, LogOut, User, Wrench } from 'lucide-react';

export default function Dashboard() {
  const { projects, deleteProject, loading: pLoad } = useProjects();
  const { categories, deleteCategory, loading: cLoad } = useCategories();
  const { achievements, deleteAchievement, loading: aLoad } = useAchievements();
  const { profile } = useProfile();
  const { data: skillsData } = useSkillsServices();
  const { logout } = useUser();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      <div className="flex justify-between items-center bg-card/40 p-6 rounded-2xl border border-white/5 shadow-lg">
        <div>
          <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CMS Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your entire portfolio autonomously.</p>
        </div>
        <button onClick={() => logout()} className="flex items-center text-red-400 hover:text-red-300 transition-colors">
          <LogOut className="w-5 h-5 mr-2" /> Sign Out
        </button>
      </div>

      {/* Hero / Profile Section */}
      <section className="space-y-4">
        <div className="flex justify-between border-b border-border pb-2">
          <h2 className="text-2xl font-bold font-heading">Hero & Profile</h2>
          <Link to="/profile" className="bg-primary text-black px-4 py-2 rounded font-medium flex items-center hover:bg-primary/90 transition-colors">
            <Edit className="w-4 h-4 mr-2" /> Edit Profile
          </Link>
        </div>
        <div className="flex bg-card/60 rounded-xl p-4 border border-white/5 gap-4 items-center">
          {profile?.heroImage ? (
            <img src={profile.heroImage} className="w-20 h-20 object-cover rounded-2xl border border-white/10" alt="hero" />
          ) : (
            <div className="w-20 h-20 bg-black/50 rounded-2xl flex items-center justify-center border border-white/10">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          <div>
            <h3 className="font-bold text-lg">{profile?.name || '—'}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 max-w-md">{profile?.about || 'No bio set.'}</p>
          </div>
        </div>
      </section>

      {/* Toolkit & Services */}
      <section className="space-y-4">
        <div className="flex justify-between border-b border-border pb-2">
          <h2 className="text-2xl font-bold font-heading">Toolkit &amp; Services</h2>
          <Link to="/skills-services" className="bg-primary text-black px-4 py-2 rounded font-medium flex items-center hover:bg-primary/90 transition-colors">
            <Edit className="w-4 h-4 mr-2" /> Edit Toolkit
          </Link>
        </div>
        <div className="flex bg-card/60 rounded-xl p-4 border border-white/5 gap-4 items-center">
          <div className="p-3 bg-primary/10 rounded-xl shrink-0">
            <Wrench className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">{skillsData?.skills?.length || 0}</span> skill tags &nbsp;·&nbsp;
              <span className="text-foreground font-medium">{skillsData?.services?.length || 0}</span> service cards
            </p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{skillsData?.skills?.slice(0, 5).join(', ')}{skillsData?.skills?.length > 5 ? '...' : ''}</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex justify-between border-b border-border pb-2">
          <h2 className="text-2xl font-bold font-heading">Projects Registry</h2>
          <Link to="/projects/new" className="bg-primary text-black px-4 py-2 rounded font-medium flex items-center hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4 mr-2" /> Add Project
          </Link>
        </div>
        
        {pLoad ? <p className="animate-pulse">Loading engine...</p> : (
          <div className="grid md:grid-cols-2 gap-4">
            {projects.length === 0 && <p className="text-muted-foreground">No projects indexed yet.</p>}
            {projects.map(p => (
              <div key={p._id} className="flex bg-card/60 rounded-xl p-4 border border-white/5 gap-4 items-center">
                <img src={p.image} className="w-20 h-20 object-cover rounded-lg border border-white/10" alt="thumbnail" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.category?.name || 'Uncategorized'}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Link to={`/projects/${p._id}`} className="text-blue-400 hover:text-blue-300">
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button onClick={() => deleteProject(p._id)} className="text-red-500 hover:text-red-400">
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div className="flex justify-between border-b border-border pb-2">
          <h2 className="text-2xl font-bold font-heading">Categories Configuration</h2>
          <Link to="/categories/new" className="bg-primary text-black px-4 py-2 rounded font-medium flex items-center hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4 mr-2" /> Quick Add
          </Link>
        </div>
        
        {cLoad ? <p className="animate-pulse">Loading tags...</p> : (
          <div className="flex flex-wrap gap-4">
            {categories.map(c => (
              <div key={c._id} className="bg-card/60 px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
                <span className="font-medium text-sm">{c.name}</span>
                <Link to={`/categories/${c._id}`} className="text-blue-400 hover:text-blue-300 ml-2"><Edit className="w-4 h-4" /></Link>
                <button onClick={() => deleteCategory(c._id)} className="text-red-500/70 hover:text-red-500"><Trash className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div className="flex justify-between border-b border-border pb-2">
          <h2 className="text-2xl font-bold font-heading">Milestone Achievements</h2>
          <Link to="/achievements/new" className="bg-primary text-black px-4 py-2 rounded font-medium flex items-center hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4 mr-2" /> Add Achievement
          </Link>
        </div>
        
        {aLoad ? <p className="animate-pulse">Loading modules...</p> : (
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.length === 0 && <p className="text-muted-foreground">No achievements logged.</p>}
            {achievements.map(a => (
              <div key={a._id} className="flex bg-card/60 rounded-xl p-4 border border-white/5 gap-4 items-center">
                {a.images?.[0] ? (
                  <img src={a.images[0]} className="w-20 h-20 object-cover rounded-lg border border-white/10" alt="thumb" />
                ) : (
                  <div className="w-20 h-20 bg-black/50 rounded-lg flex items-center justify-center border border-white/10 text-xs text-muted-foreground">No img</div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{a.title}</h3>
                  <p className="text-sm text-secondary">{a.year}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Link to={`/achievements/${a._id}`} className="text-blue-400 hover:text-blue-300">
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button onClick={() => deleteAchievement(a._id)} className="text-red-500 hover:text-red-400">
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
