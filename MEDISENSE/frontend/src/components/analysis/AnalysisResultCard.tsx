import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { CheckCircle2, XCircle, Stethoscope, Droplets, ScanEye, Download, Loader2 } from 'lucide-react';
import { SkinAnalysis } from '../../types';
import SeverityBadge from './SeverityBadge';
import { downloadElementAsPdf } from '../../utils/downloadReport';

const URGENCY_COPY: Record<string, { label: string; classes: string }> = {
  routine: { label: 'Routine — monitor at your own pace', classes: 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300' },
  soon: { label: 'See a dermatologist soon', classes: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300' },
  urgent: { label: 'Prompt dermatologist consultation recommended', classes: 'bg-clay-50 text-clay-700 dark:bg-clay-500/10 dark:text-clay-300' },
};

const HYDRATION_BAR_COLORS: Record<string, string> = {
  hydrationLevel: '#6FADA8',
  oiliness: '#B8B1E0',
  textureScore: '#8B85C1',
  rednessScore: '#E3A69D',
};

const AnalysisResultCard: React.FC<{ analysis: SkinAnalysis; showDownload?: boolean }> = ({ analysis, showDownload = true }) => {
  const urgency = URGENCY_COPY[analysis.consultationUrgency] || URGENCY_COPY.routine;
  const [downloading, setDownloading] = useState(false);
  const elementId = `analysis-report-${analysis._id}`;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadElementAsPdf(elementId, `medisense-report-${analysis._id}.pdf`);
    } catch {
      toast.error('Could not generate the PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div id={elementId} className="space-y-5 bg-white dark:bg-transparent p-1">
      {showDownload && (
        <div className="flex justify-end">
          <button onClick={handleDownload} disabled={downloading} className="btn-secondary !py-1.5 !px-3 text-xs">
            {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {downloading ? 'Preparing…' : 'Download report (PDF)'}
          </button>
        </div>
      )}

      <div className="flex items-center gap-4">
        <img src={analysis.image.url} alt="Analyzed skin" className="h-20 w-20 rounded-xl2 object-cover" />
        <div>
          <h3 className="font-display text-lg font-semibold text-ink dark:text-canvas">
            {analysis.predictions[0]?.label || analysis.topCondition}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <SeverityBadge severity={analysis.severity} />
            <span className="font-mono text-xs text-ink/50 dark:text-canvas/50">
              {(analysis.topConfidence * 100).toFixed(0)}% confidence
            </span>
          </div>
        </div>
      </div>

      {/* Image analysis: original, grayscale (preprocessing step), and
          highlighted regions (explainability) side by side */}
      {(analysis.grayscaleImage || analysis.highlightedImage) && (
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-ink dark:text-canvas">
            <ScanEye size={15} /> Image analysis breakdown
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <img src={analysis.image.url} alt="Original" className="aspect-square w-full rounded-lg object-cover" />
              <p className="mt-1 text-center text-[10px] text-ink/50 dark:text-canvas/50">Original</p>
            </div>
            {analysis.grayscaleImage && (
              <div>
                <img src={analysis.grayscaleImage} alt="Grayscale preprocessing" className="aspect-square w-full rounded-lg object-cover" />
                <p className="mt-1 text-center text-[10px] text-ink/50 dark:text-canvas/50">Grayscale (preprocessing)</p>
              </div>
            )}
            {analysis.highlightedImage && (
              <div>
                <img src={analysis.highlightedImage} alt="Highlighted regions of concern" className="aspect-square w-full rounded-lg object-cover" />
                <p className="mt-1 text-center text-[10px] text-ink/50 dark:text-canvas/50">Regions of interest</p>
              </div>
            )}
          </div>
          {analysis.keyIndicators && analysis.keyIndicators.length > 0 && (
            <ul className="mt-3 space-y-1.5 rounded-xl bg-ink/5 p-3 text-xs text-ink/70 dark:bg-white/5 dark:text-canvas/70">
              {analysis.keyIndicators.map((k) => <li key={k}>• {k}</li>)}
            </ul>
          )}
        </div>
      )}

      {/* Ranked predictions */}
      {analysis.predictions.length > 1 && (
        <div className="space-y-2">
          {analysis.predictions.map((p) => (
            <div key={p.condition} className="flex items-center gap-3">
              <span className="w-32 shrink-0 truncate text-xs text-ink/60 dark:text-canvas/60">{p.label || p.condition}</span>
              <div className="h-2 flex-1 rounded-full bg-ink/10 dark:bg-white/10">
                <div className="h-2 rounded-full bg-teal-500" style={{ width: `${p.confidence * 100}%` }} />
              </div>
              <span className="w-10 shrink-0 text-right font-mono text-xs text-ink/50">{(p.confidence * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      )}

      <div className={`rounded-xl p-3 text-xs font-medium ${urgency.classes}`}>
        <Stethoscope size={14} className="mr-1.5 inline" /> {urgency.label}
      </div>

      <p className="text-sm text-ink/70 dark:text-canvas/70">{analysis.explanation}</p>

      {analysis.symptoms.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-ink dark:text-canvas">Common symptoms</h4>
          <ul className="flex flex-wrap gap-2">
            {analysis.symptoms.map((s) => (
              <li key={s} className="rounded-full bg-ink/5 px-3 py-1 text-xs dark:bg-white/5">{s}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-teal-700 dark:text-teal-300">
            <CheckCircle2 size={15} /> Do's
          </h4>
          <ul className="space-y-1.5 text-sm text-ink/70 dark:text-canvas/70">
            {analysis.dos.map((d) => <li key={d}>• {d}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-clay-700 dark:text-clay-300">
            <XCircle size={15} /> Don'ts
          </h4>
          <ul className="space-y-1.5 text-sm text-ink/70 dark:text-canvas/70">
            {analysis.donts.map((d) => <li key={d}>• {d}</li>)}
          </ul>
        </div>
      </div>

      {analysis.recommendedRoutine.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-ink dark:text-canvas">Suggested routine</h4>
          <ol className="space-y-1.5 text-sm text-ink/70 dark:text-canvas/70">
            {analysis.recommendedRoutine.map((r, i) => <li key={r}>{i + 1}. {r}</li>)}
          </ol>
        </div>
      )}

      {/* Premium "Analysis Overview" panel — dark glass card with
          animated colored progress bars, matching the marketing hero's
          metric card for a consistent look across the app. */}
      {analysis.hydrationAnalysis && (
        <div className="float-panel-dark p-5">
          <div className="mb-4 flex items-center gap-2">
            <Droplets size={16} className="text-teal-300" />
            <p className="text-sm font-semibold uppercase tracking-wide text-canvas/80">Hydration &amp; Texture Overview</p>
          </div>
          <div className="space-y-3.5">
            {[
              ['Hydration', analysis.hydrationAnalysis.hydrationLevel, HYDRATION_BAR_COLORS.hydrationLevel],
              ['Oiliness', analysis.hydrationAnalysis.oiliness, HYDRATION_BAR_COLORS.oiliness],
              ['Texture', analysis.hydrationAnalysis.textureScore, HYDRATION_BAR_COLORS.textureScore],
              ['Redness', analysis.hydrationAnalysis.rednessScore, HYDRATION_BAR_COLORS.rednessScore],
            ].map(([label, value, color]) => (
              <div key={label as string}>
                <div className="mb-1 flex items-center justify-between text-xs text-canvas/70">
                  <span>{label}</span>
                  <span className="font-mono">{Math.round(value as number)}%</span>
                </div>
                <div className="metric-bar-track">
                  <div
                    className="metric-bar-fill"
                    style={{ backgroundColor: color as string, ['--bar-width' as string]: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-canvas/70">{analysis.hydrationAnalysis.recommendation}</p>
        </div>
      )}

      {analysis.faqs.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-ink dark:text-canvas">Frequently asked questions</h4>
          <div className="space-y-3">
            {analysis.faqs.map((f) => (
              <div key={f.question}>
                <p className="text-sm font-medium text-ink dark:text-canvas">{f.question}</p>
                <p className="text-sm text-ink/60 dark:text-canvas/60">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResultCard;
