export type IncidentType = 'injury' | 'illness' | 'near-miss';
export type IncidentStatus = 'pending-review' | 'reviewed' | 'recorded' | 'rejected';
export type Severity = 'first-aid' | 'medical' | 'restricted' | 'days-away' | 'death';

export interface Incident {
  id: string;
  employeeName: string;
  date: string;
  type: IncidentType;
  bodyPart: string;
  location: string;
  description: string;
  status: IncidentStatus;
  severity: Severity;
  oshaRecordable: boolean | null;
  createdAt: string;
}

export const SEVERITY_LABELS: Record<Severity, string> = {
  'first-aid': 'First Aid',
  'medical': 'Medical Treatment',
  'restricted': 'Restricted Work',
  'days-away': 'Days Away',
  'death': 'Fatality',
};

export const STATUS_LABELS: Record<IncidentStatus, string> = {
  'pending-review': 'Pending Review',
  'reviewed': 'Reviewed',
  'recorded': 'Recorded',
  'rejected': 'Rejected',
};

export const TYPE_LABELS: Record<IncidentType, string> = {
  'injury': 'Injury',
  'illness': 'Illness',
  'near-miss': 'Near Miss',
};
