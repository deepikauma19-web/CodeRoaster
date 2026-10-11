export type ScoreColorScheme = 'red' | 'orange' | 'yellow' | 'green';

export interface ScoreBand {
  label: string;
  colorScheme: ScoreColorScheme;
}

export const SCORE_MAX = 100;
export const CATEGORY_MAX = 20;

/** Score bands: 0–39 Burnt, 40–59 Half-boiled, 60–79 Decent da, 80–100 Semma. */
export const getScoreBand = (score: number): ScoreBand => {
  if (score >= 80) return { label: 'Semma! 🏆', colorScheme: 'green' };
  if (score >= 60) return { label: 'Decent da', colorScheme: 'yellow' };
  if (score >= 40) return { label: 'Half-boiled', colorScheme: 'orange' };
  return { label: 'Burnt 🔥', colorScheme: 'red' };
};
