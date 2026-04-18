import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useCategories } from '../context/CategoryContext';
import { ArrowLeft } from 'lucide-react';

export default function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, createProject, updateProject } = useProjects();
  const { categories } = useCategories();
  
  const isEditing = !!id;
  const projectToEdit = isEditing ? projects.find(p => p._id === id) : null;

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    learned: '',
    toolsUsed: '', // comma separated strings
    videoLink: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        title: projectToEdit.title || '',
        category: projectToEdit.category?._id || projectToEdit.category || '',
        description: projectToEdit.description || '',
        learned: projectToEdit.learned || '',
        toolsUsed: projectToEdit.toolsUsed?.join(', ') || '',
        videoLink: projectToEdit.videoLink || ''
      });
    }
  }, [projectToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Convert object to complex multi-part FormData object
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('category', formData.category);
    payload.append('description', formData.description);
    payload.append('learned', formData.learned);
    if (formData.videoLink) payload.append('videoLink', formData.videoLink);
    
    // Tools processing from simple comma string to array hook
    const toolsArray = formData.toolsUsed.split(',').map(t => t.trim()).filter(Boolean);
    toolsArray.forEach(tool => payload.append('toolsUsed', tool));
    
    if (imageFile) {
      payload.append('image', imageFile);
    }

    try {
      if (isEditing) {
        await updateProject(id, payload);
      } else {
        await createProject(payload);
      }
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("Submission failed. Did you authenticate as an Administrator?");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-muted-foreground hover:text-white pb-4 border-b border-white/10 w-full">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Terminal
      </button>

      <h1 className="text-3xl font-heading font-bold">{isEditing ? 'Edit Project Config' : 'Initialize New Project'}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-primary">Project Title *</label>
            <input required type="text" className="w-full bg-card border border-white/10 rounded px-4 py-2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          
          <div className="space-y-2">
             <label className="text-sm text-primary">Category Anchor *</label>
             <select required className="w-full bg-card border border-white/10 rounded px-4 py-2" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
               <option value="" disabled>Select a core logic loop...</option>
               {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
             </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-primary">Cover Artwork (Cloudinary Node) {isEditing ? '' : '*'}</label>
          <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="w-full bg-card border border-white/10 rounded px-4 py-2" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-primary">System Description (Supports Markdown) *</label>
          <textarea required rows={5} className="w-full bg-card border border-white/10 rounded px-4 py-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-primary">Lessons Learned (Supports Markdown) *</label>
          <textarea required rows={4} className="w-full bg-card border border-white/10 rounded px-4 py-2" value={formData.learned} onChange={e => setFormData({...formData, learned: e.target.value})} />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
           <div className="space-y-2">
              <label className="text-sm text-primary">Tools Frameworks (Comma separated)</label>
              <input type="text" placeholder="Premiere, Photoshop, Figma..." className="w-full bg-card border border-white/10 rounded px-4 py-2" value={formData.toolsUsed} onChange={e => setFormData({...formData, toolsUsed: e.target.value})} />
           </div>
           
           <div className="space-y-2">
              <label className="text-sm text-primary">External Media Link (YouTube/Vimeo)</label>
              <input type="url" placeholder="https://youtube.com/..." className="w-full bg-card border border-white/10 rounded px-4 py-2" value={formData.videoLink} onChange={e => setFormData({...formData, videoLink: e.target.value})} />
           </div>
        </div>
        
        <button disabled={saving} type="submit" className="w-full py-4 bg-primary text-black font-bold text-lg rounded-xl hover:bg-primary/90 hover:scale-[1.01] transition-transform">
           {saving ? 'Transmitting Data Array...' : (isEditing ? 'Compile Changes' : 'Initialize Package')}
        </button>
      </form>
    </div>
  );
}
