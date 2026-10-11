import { TERMINAL_ROAST_STATUSES, type RoastIntensity, type RoastStatus, type TipPriority } from '../types/roast';
import type { IntensityOption, ScoreCategory } from '../types/roastUi';

export const GITHUB_REPO_REGEX = /^https:\/\/github\.com\/[A-Za-z0-9-]+\/[A-Za-z0-9._-]+\/?$/;

export const isValidRepoUrl = (url: string): boolean => GITHUB_REPO_REGEX.test(url.trim());

export const DEFAULT_INTENSITY: RoastIntensity = 'medium';

export const INTENSITY_OPTIONS: readonly IntensityOption[] = [
  {
    value: 'mild',
    chilis: '🌶️',
    label: 'Mild',
    sample: 'Nalla try pa, but README konjam azhaga ezhudhalaam.',
  },
  {
    value: 'medium',
    chilis: '🌶️🌶️',
    label: 'Medium',
    sample: 'main.py-la 400 lines-aa? Function-nu oru concept irukku da.',
  },
  {
    value: 'extra_spicy',
    chilis: '🌶️🌶️🌶️',
    label: 'Extra Spicy',
    sample: 'API key-a commit pannitu "secure app"-nu README-la potrukkiya? Semma comedy.',
  },
];

export const getIntensityOption = (value: RoastIntensity): IntensityOption =>
  INTENSITY_OPTIONS.find((o) => o.value === value) ?? INTENSITY_OPTIONS[1];

export const SCORE_CATEGORIES: readonly { key: ScoreCategory; label: string }[] = [
  { key: 'code_quality', label: 'Code Quality' },
  { key: 'structure', label: 'Structure' },
  { key: 'documentation', label: 'Documentation' },
  { key: 'ai_best_practices', label: 'AI Best Practices' },
  { key: 'security', label: 'Security' },
];

export const TIP_PRIORITY_COLOR: Record<TipPriority, string> = {
  high: 'red',
  medium: 'orange',
  low: 'green',
};

export const STATUS_COLOR: Record<RoastStatus, string> = {
  pending: 'gray',
  fetching: 'blue',
  analyzing: 'purple',
  completed: 'green',
  failed: 'red',
};

export const isTerminalStatus = (status: RoastStatus): boolean => TERMINAL_ROAST_STATUSES.includes(status);
