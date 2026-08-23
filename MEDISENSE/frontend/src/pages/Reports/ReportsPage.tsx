import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FileText, Upload, Trash2, Plus, X, File as FileIcon } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useReports, useUploadReport, useDeleteReport } from '../../hooks/useReports';

const TYPE_LABELS: Record<string, string> = {
  prescription: 'Prescription',
  'lab-report': 'Lab Report',
  'dermatologist-note': "Dermatologist's Note",
  other: 'Other',
};

const ReportsPage: React.FC = () => {
  const [page] = useState(1);
  const { data, isLoading } = useReports(page);
  const uploadReport = useUploadReport();
  const deleteReport = useDeleteReport();
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('other');

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      toast.error('Please provide a title and select a file.');
      return;
    }
    try {
      await uploadReport.mutateAsync({ file, title, type });
      toast.success('Report uploaded.');
      setModalOpen(false);
      setFile(null);
      setTitle('');
      setType('other');
    } catch {
      toast.error('Upload failed.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this report?')) return;
    try {
      await deleteReport.mutateAsync(id);
      toast.success('Report deleted.');
    } catch {
      toast.error('Failed to delete report.');
    }
  };

  return (
    <DashboardLayout title="Medical Reports">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-ink/60 dark:text-canvas/60">
          Securely store prescriptions, lab reports, and dermatologist notes.
        </p>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> Upload report
        </button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 w-full" />)}
        </div>
      )}

      {!isLoading && data?.results.length === 0 && (
        <div className="glass-card p-12 text-center">
          <FileText size={36} className="mx-auto text-ink/30" />
          <p className="mt-3 text-sm text-ink/60 dark:text-canvas/60">No reports uploaded yet.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.results.map((r) => (
          <div key={r._id} className="glass-card p-5">
            <div className="flex items-start justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300">
                <FileIcon size={18} />
              </span>
              <button onClick={() => handleDelete(r._id)} aria-label="Delete report">
                <Trash2 size={16} className="text-clay-500" />
              </button>
            </div>
            <p className="mt-3 truncate font-medium text-ink dark:text-canvas">{r.title}</p>
            <p className="text-xs text-ink/50 dark:text-canvas/50">{TYPE_LABELS[r.type]} · {new Date(r.createdAt).toLocaleDateString()}</p>
            <a href={r.file.url} target="_blank" rel="noreferrer" className="btn-secondary mt-4 w-full !py-2 text-xs">
              View file
            </a>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="glass-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Upload medical report</h3>
              <button onClick={() => setModalOpen(false)}><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <input className="input-field" placeholder="Report title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <select className="input-field" value={type} onChange={(e) => setType(e.target.value)}>
                {Object.entries(TYPE_LABELS).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
              </select>
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-ink/15 p-6 text-center dark:border-white/15">
                <Upload size={22} className="text-teal-600" />
                <span className="text-sm">{file ? file.name : 'Choose a PDF or image'}</span>
                <input type="file" accept="application/pdf,image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>
              <button onClick={handleUpload} disabled={uploadReport.isPending} className="btn-primary w-full">
                {uploadReport.isPending ? 'Uploading…' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ReportsPage;
