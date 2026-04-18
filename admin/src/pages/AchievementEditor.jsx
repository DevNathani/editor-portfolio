import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAchievements } from '../context/AchievementContext';
import { ArrowLeft } from 'lucide-react';

export default function AchievementEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { achievements, createAchievement, updateAchievement } = useAchievements();
  
  const isEditing = !!id;
  const achievementToEdit = isEditing ? achievements.find(a => a._id === id) : null;

  const [formData, setFormData] = useState({ title: '', year: '', description: '' });
  const [imageFiles, setImageFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (achievementToEdit) {
      setFormData({
        title: achievementToEdit.title || '',
        year: achievementToEdit.year || '',
        description: achievementToEdit.description || ''
      });
    }
  }, [achievementToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Convert object to complex multi-part FormData object
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('year', formData.year);
    payload.append('description', formData.description);
    
    // Append multiple files natively to array matching Multer "images" key
    for (let i = 0; i < imageFiles.length; i++) {
      payload.append('images', imageFiles[i]);
    }

    try {
      if (isEditing) {
        await updateAchievement(id, payload);
      } else {
        await createAchievement(payload);
      }
      navigate('/');
    } catch (error) {
       console.error(error);
       alert("Submission failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-muted-foreground hover:text-white pb-4 border-b border-white/10 w-full">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back
      </button>

      <h1 className="text-3xl font-bold font-heading">{isEditing ? 'Edit Achievement' : 'New Achievement'}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-primary">Achievement Title *</label>
            <input required type="text" className="w-full bg-card border border-white/10 rounded px-4 py-2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          
          <div className="space-y-2">
             <label className="text-sm text-primary">Year *</label>
             <input required type="text" placeholder="2026" className="w-full bg-card border border-white/10 rounded px-4 py-2" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-primary">Proof Images (Select Multiple Files) {isEditing ? '(Uploading new images will replace existing)' : '*'}</label>
          <input type="file" multiple accept="image/*" onChange={e => setImageFiles(e.target.files)} className="w-full bg-card border border-white/10 rounded px-4 py-2" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-primary">Description *</label>
          <textarea required rows={4} className="w-full bg-card border border-white/10 rounded px-4 py-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>
        
        <button disabled={saving} type="submit" className="w-full py-4 bg-primary text-black font-bold text-lg rounded-xl hover:bg-primary/90 hover:scale-[1.01] transition-transform">
           {saving ? 'Transmitting Arrays...' : (isEditing ? 'Compile Overwrites' : 'Initialize Achievement')}
        </button>
      </form>
    </div>
  );
}
