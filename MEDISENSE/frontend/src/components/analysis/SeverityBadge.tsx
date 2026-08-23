import React from 'react';
import { Severity } from '../../types';

const LABELS: Record<Severity, string> = {
  mild: 'Mild',
  moderate: 'Moderate',
  severe: 'Severe',
  unknown: 'Unknown',
};

const CLASSES: Record<Severity, string> = {
  mild: 'badge-mild',
  moderate: 'badge-moderate',
  severe: 'badge-severe',
  unknown: 'bg-ink/10 text-ink/60 dark:bg-white/10 dark:text-canvas/60',
};

const SeverityBadge: React.FC<{ severity: Severity }> = ({ severity }) => (
  <span className={`badge ${CLASSES[severity]}`}>{LABELS[severity]}</span>
);

export default SeverityBadge;
