export type Outcome = 'recordable' | 'not-recordable' | 'needs-info';

// OSHA 300 columns G-J: only the single most severe outcome is checked.
export type Classification = 'death' | 'days-away' | 'restricted' | 'other-recordable';

// OSHA 300 column M.
export type CaseType =
  | 'injury'
  | 'skin-disorder'
  | 'respiratory'
  | 'poisoning'
  | 'hearing-loss'
  | 'other-illness';

export type SevereEvent = 'fatality' | 'hospitalization' | 'amputation' | 'eye-loss';

export type Confidence = 'high' | 'medium' | 'low';

export interface Fact {
  key: string;
  label: string;
  value: string | null;
  source: string | null;
  confidence: Confidence;
}

export interface Determination {
  outcome: Outcome;
  classification: Classification | null;
  reason: string;
  citations: string[];
  openQuestions: string[];
  engineVersion: string;
}

export interface Review {
  status: 'pending' | 'accepted' | 'overridden';
  reviewer?: string;
  at?: string;
  outcome?: Exclude<Outcome, 'needs-info'>;
  classification?: Classification | null;
  overrideReason?: string;
  answers?: Record<string, string>;
}

export interface SevereAlert {
  event: SevereEvent;
  deadlineAt: string;
  reportedAt: string | null;
}

export interface Incident {
  id: string;
  caseNumber: string | null;
  employeeName: string;
  jobTitle: string;
  date: string;
  location: string;
  description: string;
  bodyPart: string;
  caseType: CaseType;
  daysAway: number;
  daysRestricted: number;
  privacyCase: boolean;
  rawText: string;
  facts: Fact[];
  determination: Determination;
  review: Review;
  severeAlert: SevereAlert | null;
  submittedBy: string;
  createdAt: string;
}

export interface Establishment {
  companyName: string;
  establishmentName: string;
  ein: string;
  naicsCode: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  annualAverageEmployees: number;
  totalHoursWorked: number;
}

export interface AuditEntry {
  id: string;
  at: string;
  actor: string;
  incidentId: string;
  action: string;
  detail: string;
}

export const OUTCOME_LABELS: Record<Outcome, string> = {
  'recordable': 'Recordable',
  'not-recordable': 'Not Recordable',
  'needs-info': 'Needs Info',
};

export const CLASSIFICATION_LABELS: Record<Classification, string> = {
  'death': 'Death',
  'days-away': 'Days Away',
  'restricted': 'Restricted / Transfer',
  'other-recordable': 'Other Recordable',
};

export const CLASSIFICATION_COLUMNS: Record<Classification, string> = {
  'death': 'G',
  'days-away': 'H',
  'restricted': 'I',
  'other-recordable': 'J',
};

export const CASE_TYPE_LABELS: Record<CaseType, string> = {
  'injury': 'Injury',
  'skin-disorder': 'Skin Disorder',
  'respiratory': 'Respiratory Condition',
  'poisoning': 'Poisoning',
  'hearing-loss': 'Hearing Loss',
  'other-illness': 'All Other Illnesses',
};

export const SEVERE_EVENT_LABELS: Record<SevereEvent, string> = {
  'fatality': 'Fatality',
  'hospitalization': 'In-patient hospitalization',
  'amputation': 'Amputation',
  'eye-loss': 'Loss of an eye',
};

export const REVIEW_LABELS: Record<Review['status'], string> = {
  'pending': 'Needs Sign-off',
  'accepted': 'Accepted',
  'overridden': 'Overridden',
};
