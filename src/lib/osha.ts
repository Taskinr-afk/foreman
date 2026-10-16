import type { Classification, Incident, Outcome } from './schemas/incident';

export const DAY_COUNT_CAP = 180;

export function finalOutcome(i: Incident): Outcome {
  return i.review.status === 'pending' ? i.determination.outcome : i.review.outcome!;
}

export function finalClassification(i: Incident): Classification | null {
  return i.review.status === 'pending' ? i.determination.classification : i.review.classification ?? null;
}

export function isLogged(i: Incident) {
  return i.review.status !== 'pending' && i.review.outcome === 'recordable';
}

export function isDart(i: Incident) {
  const c = finalClassification(i);
  return c === 'days-away' || c === 'restricted';
}

// TRIR and DART per 100 full-time workers (200,000 hours).
export function rate(cases: number, hoursWorked: number) {
  if (!hoursWorked) return null;
  return (cases * 200_000) / hoursWorked;
}

export function capDays(n: number) {
  return Math.min(n, DAY_COUNT_CAP);
}

export function nextCaseNumber(incidents: Incident[], year: number) {
  const prefix = `${year}-`;
  const max = incidents
    .map((i) => i.caseNumber)
    .filter((c): c is string => !!c && c.startsWith(prefix))
    .reduce((m, c) => Math.max(m, Number(c.slice(prefix.length))), 0);
  return `${prefix}${String(max + 1).padStart(3, '0')}`;
}

export const OUTCOME_STYLES: Record<Outcome, { text: string; bg: string }> = {
  'recordable': { text: 'var(--alert)', bg: 'var(--alert-subtle)' },
  'needs-info': { text: 'var(--accent)', bg: 'var(--accent-subtle)' },
  'not-recordable': { text: 'var(--engine)', bg: 'var(--engine-subtle)' },
};
