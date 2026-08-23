import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Trash2, Save } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AnalysisResultCard from '../../components/analysis/AnalysisResultCard';
import { useAnalysisById } from '../../hooks/useSkinAnalysis';
import api from '../../services/api';
import { useQueryClient } from '@tanstack/react-query';

const AnalysisDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: analysis, isLoading } = useAnalysisById(id);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (analysis?.notes) setNotes(analysis.notes);
  }, [analysis?.notes]);

  const handleSaveNotes = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await api.patch(`/skin-analysis/${id}`, { notes });
      toast.success('Notes saved.');
      queryClient.invalidateQueries({ queryKey: ['analysis', id] });
    } catch {
      toast.error('Failed to save notes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Delete this analysis? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.delete(`/skin-analysis/${id}`);
      toast.success('Analysis deleted.');
      navigate('/analysis');
    } catch {
      toast.error('Failed to delete analysis.');
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Analysis Detail">
        <div className="skeleton h-96 w-full" />
      </DashboardLayout>
    );
  }

  if (!analysis) {
    return (
      <DashboardLayout title="Analysis Detail">
        <p className="text-center text-ink/60 dark:text-canvas/60">Analysis not found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Analysis Detail">
      <div className="glass-card p-6">
        <AnalysisResultCard analysis={analysis} />

        <div className="mt-6 border-t border-ink/10 pt-6 dark:border-white/10">
          <label className="mb-2 block text-sm font-semibold text-ink dark:text-canvas">Your notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Add personal notes about this analysis…"
            className="input-field"
          />
          <div className="mt-3 flex justify-between">
            <button onClick={handleDelete} disabled={deleting} className="btn-secondary !border-clay-300 !text-clay-600">
              <Trash2 size={15} /> {deleting ? 'Deleting…' : 'Delete analysis'}
            </button>
            <button onClick={handleSaveNotes} disabled={saving} className="btn-teal">
              <Save size={15} /> {saving ? 'Saving…' : 'Save notes'}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalysisDetailPage;
