import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCategories } from '../context/CategoryContext';
import { ArrowLeft } from 'lucide-react';

export default function CategoryEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, createCategory, updateCategory } = useCategories();
  
  const isEditing = !!id;
  const categoryToEdit = isEditing ? categories.find(c => c._id === id) : null;

  const [formData, setFormData] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (categoryToEdit) {
      setFormData({ name: categoryToEdit.name || '', description: categoryToEdit.description || '' });
    }
  }, [categoryToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditing) {
        await updateCategory(id, formData);
      } else {
        await createCategory(formData);
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
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-muted-foreground hover:text-white pb-4 border-b border-white/10 w-full">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back
      </button>

      <h1 className="text-3xl font-bold font-heading">{isEditing ? 'Edit Category' : 'New Category'}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm text-primary">Category Name *</label>
          <input required type="text" className="w-full bg-card border border-white/10 rounded px-4 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-primary">Description (Optional)</label>
          <textarea rows={3} className="w-full bg-card border border-white/10 rounded px-4 py-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>
        
        <button disabled={saving} type="submit" className="w-full py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 hover:scale-[1.01] transition-transform">
           {saving ? 'Processing...' : 'Save Category Configuration'}
        </button>
      </form>
    </div>
  );
}
