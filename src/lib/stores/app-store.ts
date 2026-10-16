import { create } from 'zustand';

interface Incident {
  id: string;
  employeeName: string;
  date: string;
  type: 'injury' | 'illness' | 'near-miss';
  bodyPart: string;
  location: string;
  description: string;
  status: 'pending-review' | 'reviewed' | 'recorded' | 'rejected';
  severity: 'first-aid' | 'medical' | 'restricted' | 'days-away' | 'death';
  oshaRecordable: boolean | null;
  createdAt: string;
}

interface AppState {
  incidents: Incident[];
  sidebarOpen: boolean;
  activeView: string;
  setSidebarOpen: (open: boolean) => void;
  setActiveView: (view: string) => void;
  addIncident: (incident: Incident) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
}

const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'INC-2024-001',
    employeeName: 'Marcus Johnson',
    date: '2024-10-14',
    type: 'injury',
    bodyPart: 'Right hand',
    location: 'Warehouse B - Loading Dock',
    description: 'Employee caught hand between pallet and dock bumper while unloading delivery truck.',
    status: 'pending-review',
    severity: 'medical',
    oshaRecordable: null,
    createdAt: '2024-10-14T09:23:00Z',
  },
  {
    id: 'INC-2024-002',
    employeeName: 'Sarah Chen',
    date: '2024-10-12',
    type: 'injury',
    bodyPart: 'Lower back',
    location: 'Building A - 3rd Floor Office',
    description: 'Employee reported lower back pain after lifting file boxes from floor level without proper technique.',
    status: 'reviewed',
    severity: 'restricted',
    oshaRecordable: true,
    createdAt: '2024-10-12T14:15:00Z',
  },
  {
    id: 'INC-2024-003',
    employeeName: 'James Rivera',
    date: '2024-10-10',
    type: 'near-miss',
    bodyPart: 'N/A',
    location: 'Parking Lot C',
    description: 'Forklift nearly struck pedestrian near crosswalk. No contact made. Driver visibility obstructed by stacked pallets.',
    status: 'recorded',
    severity: 'first-aid',
    oshaRecordable: false,
    createdAt: '2024-10-10T16:45:00Z',
  },
  {
    id: 'INC-2024-004',
    employeeName: 'Ana Martinez',
    date: '2024-10-09',
    type: 'illness',
    bodyPart: 'Respiratory',
    location: 'Chemical Storage Room 2',
    description: 'Employee developed respiratory irritation after prolonged exposure to cleaning chemicals without adequate ventilation.',
    status: 'reviewed',
    severity: 'medical',
    oshaRecordable: true,
    createdAt: '2024-10-09T11:30:00Z',
  },
  {
    id: 'INC-2024-005',
    employeeName: 'David Park',
    date: '2024-10-07',
    type: 'injury',
    bodyPart: 'Left ankle',
    location: 'Stairwell B - Between Floors 2-3',
    description: 'Employee slipped on wet step and twisted ankle. Wet floor sign was not posted after mopping.',
    status: 'recorded',
    severity: 'days-away',
    oshaRecordable: true,
    createdAt: '2024-10-07T08:12:00Z',
  },
];

export const useAppStore = create<AppState>((set) => ({
  incidents: MOCK_INCIDENTS,
  sidebarOpen: true,
  activeView: 'dashboard',
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveView: (view) => set({ activeView: view }),
  addIncident: (incident) =>
    set((state) => ({ incidents: [incident, ...state.incidents] })),
  updateIncident: (id, updates) =>
    set((state) => ({
      incidents: state.incidents.map((inc) =>
        inc.id === id ? { ...inc, ...updates } : inc
      ),
    })),
}));
