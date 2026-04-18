import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { ArrowLeft, User, Image } from 'lucide-react';

export default function ProfileEditor() {
  const navigate = useNavigate();
  const { profile, updateProfile, loading } = useProfile();

  const [formData, setFormData] = useState({
    name: '',
    about: '',
    taglines: '',
    instagramUrl: '',
    youtubeUrl: '',
    availableForFreelance: true,
  });
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        about: profile.about || '',
        taglines: profile.taglines?.join(', ') || '',
        instagramUrl: profile.instagramUrl || '',
        youtubeUrl: profile.youtubeUrl || '',
        availableForFreelance: profile.availableForFreelance ?? true,
      });
    }
  }, [profile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('about', formData.about);
    payload.append('taglines', formData.taglines);
    payload.append('instagramUrl', formData.instagramUrl);
    payload.append('youtubeUrl', formData.youtubeUrl);
    payload.append('availableForFreelance', formData.availableForFreelance);
    if (heroImageFile) {
      payload.append('heroImage', heroImageFile);
    }

    try {
      await updateProfile(payload);
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 animate-pulse text-muted-foreground">Loading profile data...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-muted-foreground hover:text-white pb-4 border-b border-white/10 w-full">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
      </button>

      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-xl">
          <User className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-heading font-bold">Edit Hero & About Section</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Image */}
        <div className="space-y-3">
          <label className="text-sm text-primary font-mono tracking-widest uppercase">Hero Image</label>
          <div className="flex items-start gap-6">
            <div className="w-40 h-40 rounded-2xl border border-white/10 overflow-hidden bg-card flex items-center justify-center shrink-0">
              {previewUrl || profile?.heroImage ? (
                <img src={previewUrl || profile?.heroImage} alt="Hero preview" className="w-full h-full object-cover" />
              ) : (
                <Image className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-sm"
              />
              <p className="text-xs text-muted-foreground">Uploading a new image will replace the existing one on Cloudinary automatically.</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-primary font-mono tracking-widest uppercase">Display Name</label>
            <input
              type="text"
              required
              className="w-full bg-card border border-white/10 rounded-xl px-4 py-3"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2 flex flex-col justify-end">
            <label className="text-sm text-primary font-mono tracking-widest uppercase flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.availableForFreelance}
                onChange={e => setFormData({ ...formData, availableForFreelance: e.target.checked })}
                className="accent-primary w-4 h-4"
              />
              Available for Freelance Badge
            </label>
            <p className="text-xs text-muted-foreground">Shows/hides the "Available for Freelance" badge on the hero.</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-primary font-mono tracking-widest uppercase">Typewriter Taglines (comma separated)</label>
          <input
            type="text"
            className="w-full bg-card border border-white/10 rounded-xl px-4 py-3"
            placeholder="Video Editor., Graphic Designer., Motion Artist."
            value={formData.taglines}
            onChange={e => setFormData({ ...formData, taglines: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-primary font-mono tracking-widest uppercase">About / Bio Text</label>
          <textarea
            rows={5}
            required
            className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 resize-none"
            value={formData.about}
            onChange={e => setFormData({ ...formData, about: e.target.value })}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-primary font-mono tracking-widest uppercase">Instagram URL</label>
            <input
              type="url"
              className="w-full bg-card border border-white/10 rounded-xl px-4 py-3"
              value={formData.instagramUrl}
              onChange={e => setFormData({ ...formData, instagramUrl: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-primary font-mono tracking-widest uppercase">YouTube URL</label>
            <input
              type="url"
              className="w-full bg-card border border-white/10 rounded-xl px-4 py-3"
              value={formData.youtubeUrl}
              onChange={e => setFormData({ ...formData, youtubeUrl: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 bg-gradient-to-r from-primary to-cyan-400 text-black font-bold text-lg rounded-xl hover:scale-[1.01] transition-transform disabled:opacity-50"
        >
          {saving ? 'Uploading changes...' : '⚡ Save Profile Changes'}
        </button>
      </form>
    </div>
  );
}
