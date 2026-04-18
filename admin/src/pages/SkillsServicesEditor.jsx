import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSkillsServices } from '../context/SkillsServicesContext';
import { ArrowLeft, Plus, Trash, Wrench } from 'lucide-react';

const ICON_OPTIONS = ['Film', 'Layers', 'PenTool', 'MonitorPlay', 'Code', 'Camera', 'Brush', 'Zap', 'Globe', 'Music', 'BookOpen', 'Box'];

export default function SkillsServicesEditor() {
  const navigate = useNavigate();
  const { data, loading, updateData } = useSkillsServices();

  const [skills, setSkills] = useState('');
  const [services, setServices] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setSkills(data.skills?.join(', ') || '');
      setServices(data.services || []);
    }
  }, [data]);

  const addService = () => {
    setServices([...services, { iconName: 'Film', title: '', desc: '', order: services.length }]);
  };

  const removeService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const updateService = (index, field, value) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateData({
        skills,
        services: JSON.stringify(services),
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to save. Check console.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 animate-pulse text-muted-foreground">Loading toolkit data...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-muted-foreground hover:text-white pb-4 border-b border-white/10 w-full">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
      </button>

      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-xl"><Wrench className="w-6 h-6 text-primary" /></div>
        <h1 className="text-3xl font-heading font-bold">Toolkit &amp; Services Editor</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Skills */}
        <div className="space-y-3">
          <label className="text-sm text-primary font-mono tracking-widest uppercase">Skills / Tools (Comma Separated)</label>
          <textarea
            rows={4}
            className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 resize-none"
            placeholder="Adobe Premiere Pro, After Effects, Figma..."
            value={skills}
            onChange={e => setSkills(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Each comma-separated value becomes a badge tag on the public site.</p>
        </div>

        {/* Services */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <label className="text-sm text-primary font-mono tracking-widest uppercase">Service Cards</label>
            <button
              type="button"
              onClick={addService}
              className="flex items-center gap-2 text-sm bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Service
            </button>
          </div>

          <div className="space-y-4">
            {services.map((svc, i) => (
              <div key={i} className="bg-card/60 border border-white/10 rounded-xl p-5 space-y-4 relative">
                <button
                  type="button"
                  onClick={() => removeService(i)}
                  className="absolute top-4 right-4 text-red-500/70 hover:text-red-400"
                >
                  <Trash className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">Icon</label>
                    <select
                      value={svc.iconName}
                      onChange={e => updateService(i, 'iconName', e.target.value)}
                      className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm"
                    >
                      {ICON_OPTIONS.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">Title</label>
                    <input
                      type="text"
                      required
                      value={svc.title}
                      onChange={e => updateService(i, 'title', e.target.value)}
                      className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Description</label>
                  <textarea
                    rows={2}
                    required
                    value={svc.desc}
                    onChange={e => updateService(i, 'desc', e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 bg-gradient-to-r from-primary to-cyan-400 text-black font-bold text-lg rounded-xl hover:scale-[1.01] transition-transform disabled:opacity-50"
        >
          {saving ? 'Saving...' : '⚡ Save Toolkit & Services'}
        </button>
      </form>
    </div>
  );
}
