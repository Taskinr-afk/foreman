'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';

const YELLOW = '#FFE500';
const BLACK = '#0A0A0A';

type Industry =
  | 'warehouse'
  | 'manufacturing'
  | 'food'
  | 'construction'
  | 'electrical'
  | 'trucking'
  | 'roofing'
  | 'other';

interface IndustryOption {
  id: Industry;
  label: string;
  icon: string;
  desc: string;
}

const INDUSTRIES: IndustryOption[] = [
  { id: 'warehouse', label: 'Warehouse / Logistics', icon: '📦', desc: 'Distribution, fulfillment, 3PL' },
  { id: 'manufacturing', label: 'Manufacturing', icon: '🏭', desc: 'Fabrication, assembly, production' },
  { id: 'food', label: 'Food Processing', icon: '🍖', desc: 'Meat, dairy, bakery, beverage' },
  { id: 'construction', label: 'Construction', icon: '🏗', desc: 'General, commercial, residential' },
  { id: 'electrical', label: 'Electrical / HVAC', icon: '⚡', desc: 'Electricians, HVAC, plumbing' },
  { id: 'trucking', label: 'Trucking / Fleet', icon: '🚛', desc: 'Freight, delivery, fleet ops' },
  { id: 'roofing', label: 'Roofing', icon: '🏠', desc: 'Commercial, residential roofing' },
  { id: 'other', label: 'Other Industry', icon: '🔧', desc: 'Tell us about your operation' },
];

interface TechQuestion {
  id: string;
  question: string;
  options: string[];
  industries: Industry[];
}

const TECH_QUESTIONS: TechQuestion[] = [
  {
    id: 'cameras_full',
    question: 'Do your facilities have security or safety cameras?',
    options: ['Yes, full coverage', 'Partial coverage', 'No cameras'],
    industries: ['warehouse', 'manufacturing', 'food', 'trucking'],
  },
  {
    id: 'cameras_yard',
    question: 'Do you have cameras on your yards or job sites?',
    options: ['Yes, yard/site cameras', 'Some areas only', 'No cameras'],
    industries: ['construction', 'roofing', 'electrical', 'other'],
  },
  {
    id: 'devices_floor',
    question: 'Do workers use company-issued scanners or tablets on the floor?',
    options: ['Yes, scanners/tablets', 'Some areas', 'No floor devices'],
    industries: ['warehouse', 'manufacturing', 'food'],
  },
  {
    id: 'devices_field',
    question: 'Do field technicians carry company phones?',
    options: ['Company phones', 'BYOD (personal phones)', 'No phones issued'],
    industries: ['electrical', 'trucking'],
  },
  {
    id: 'devices_general',
    question: 'What devices do your crews use in the field?',
    options: ['Company phones', 'BYOD / personal phones', 'Radios only', 'None'],
    industries: ['construction', 'roofing', 'other'],
  },
  {
    id: 'radios',
    question: 'Do your teams use two-way radios?',
    options: ['Yes, primary comms', 'Some crews', 'No'],
    industries: ['manufacturing', 'food', 'construction'],
  },
  {
    id: 'fleet_gps',
    question: 'Do your vehicles have GPS tracking or ELD?',
    options: ['Yes, GPS + ELD', 'GPS only', 'No fleet tracking'],
    industries: ['trucking', 'electrical', 'construction', 'roofing'],
  },
  {
    id: 'wearables',
    question: 'Do workers use safety wearables (gas monitors, fall detection, smart hard hats)?',
    options: ['Yes', 'Some crews', 'No'],
    industries: ['manufacturing', 'construction', 'roofing'],
  },
];

interface FixedQuestion {
  id: string;
  question: string;
  options: string[];
}

const FIXED_QUESTIONS: FixedQuestion[] = [
  {
    id: 'employees',
    question: 'How many employees at this site?',
    options: ['1 - 19', '20 - 99', '100 - 249', '250 - 500', '500+'],
  },
  {
    id: 'current_system',
    question: 'How do you track injuries today?',
    options: ['Paper forms and binders', 'Spreadsheets (Excel, Google Sheets)', 'EHS software (VelocityEHS, Cority, etc.)', 'We don\'t really track yet'],
  },
  {
    id: 'pain_point',
    question: 'What\'s your biggest compliance headache?',
    options: [
      'Deciding if injuries are recordable',
      'Filling out OSHA forms correctly',
      'Hitting the ITA March 2 deadline',
      'Being ready for an OSHA audit',
      'Keeping injury rates (DART/TRIR) low',
    ],
  },
  {
    id: 'sites',
    question: 'How many work sites do you manage?',
    options: ['1 site', '2 - 5 sites', '6 - 10 sites', '10+ sites'],
  },
  {
    id: 'timeline',
    question: 'How soon do you need this running?',
    options: ['ASAP - we have a gap right now', 'Within a month', 'Just exploring options'],
  },
];

function getIncidentCapture(answers: Record<string, string>, industry: Industry): { label: string; desc: string } {
  const floor = answers.devices_floor;
  const field = answers.devices_field;
  const general = answers.devices_general;
  const radios = answers.radios;

  if (floor === 'Yes, scanners/tablets') {
    return { label: 'Web Kiosk Mode', desc: 'QR codes at work zones, shared tablet entry, offline-capable' };
  }
  if (field === 'Company phones' || general === 'Company phones') {
    return { label: 'Native App', desc: 'Push notifications, offline mode, biometric lock on company devices' };
  }
  if (field === 'BYOD (personal phones)' || general === 'BYOD / personal phones') {
    return { label: 'Progressive Web App', desc: 'Zero install, QR link to report, works on any phone' };
  }
  if (radios === 'Yes, primary comms' || general === 'Radios only') {
    return { label: 'Voice-First Capture', desc: 'Voice memo over radio, AI transcription, pre-filled incident form' };
  }
  return { label: 'Simple Web Form', desc: 'Browser-based reporting, works on any device, printed confirmation' };
}

function getConnectedData(answers: Record<string, string>): { label: string; desc: string }[] {
  const results: { label: string; desc: string }[] = [];

  if (answers.cameras_full === 'Yes, full coverage') {
    results.push({ label: 'Camera Clip (Auto)', desc: 'Footage auto-attached to incident report' });
  } else if (answers.cameras_full === 'Partial coverage') {
    results.push({ label: 'Camera Clip (Manual)', desc: 'Timestamped clip request for covered areas' });
  } else if (answers.cameras_yard === 'Yes, yard/site cameras') {
    results.push({ label: 'Camera Reference', desc: 'Yard camera reference note on each incident' });
  }

  if (answers.fleet_gps === 'Yes, GPS + ELD') {
    results.push({ label: 'ELD Integration', desc: 'Auto-pulls driver, vehicle, GPS, hours-of-service' });
  } else if (answers.fleet_gps === 'GPS only') {
    results.push({ label: 'GPS + Vehicle ID', desc: 'Location and vehicle data on each incident' });
  }

  if (answers.wearables === 'Yes') {
    results.push({ label: 'Wearable Auto-Trigger', desc: 'Fall detection or gas exposure opens pre-filled form' });
  }

  return results;
}

function getMigrationPath(answers: Record<string, string>): { label: string; desc: string } {
  const sys = answers.current_system;
  if (sys === 'Paper forms and binders') {
    return { label: 'Paper Digitization', desc: 'Scan or photo existing binders, AI imports all fields' };
  }
  if (sys === 'Spreadsheets (Excel, Google Sheets)') {
    return { label: 'Spreadsheet Import', desc: 'Column mapping wizard, DART/TRIR continuity preserved' };
  }
  if (sys === 'EHS software (VelocityEHS, Cority, etc.)') {
    return { label: 'EHS Complement Mode', desc: 'Runs parallel, CSV export compatible with your existing platform' };
  }
  return { label: 'Zero-to-Compliant Setup', desc: 'Full setup in one guided session, no prior data needed' };
}

function getFirstPriority(answers: Record<string, string>): { label: string; desc: string } {
  const pain = answers.pain_point;
  if (pain === 'Deciding if injuries are recordable') {
    return { label: 'Decision Engine', desc: '29 CFR rules encoded. Plain-English verdict with regulation citations.' };
  }
  if (pain === 'Filling out OSHA forms correctly') {
    return { label: 'Form Automation', desc: '300/301/300A auto-generated from signed-off incidents' };
  }
  if (pain === 'Hitting the ITA March 2 deadline') {
    return { label: 'ITA Sprint', desc: 'CSV builder, 60/30/7-day alerts, ITA sandbox validation' };
  }
  if (pain === 'Being ready for an OSHA audit') {
    return { label: 'Audit Shield', desc: 'Full decision log, 4-hour OSHA doc pack, First Aid binder' };
  }
  return { label: 'Score Protection', desc: 'First Aid optimization engine, DART/TRIR dashboard, insurance cost estimator' };
}

function getOshaCoverage(answers: Record<string, string>): { label: string; desc: string } {
  const emp = answers.employees;
  if (emp === '100 - 249' || emp === '250 - 500' || emp === '500+') {
    return {
      label: 'Full ITA Reporting (100+)',
      desc: '300 Log + 301 per incident + 300A annual summary + full case-level ITA upload by March 2',
    };
  }
  if (emp === '20 - 99') {
    return {
      label: 'ITA 300A Reporting (20+)',
      desc: '300 Log + 301 per incident + 300A annual summary + ITA 300A upload by March 2',
    };
  }
  return {
    label: 'Standard Recordkeeping',
    desc: '300 Log + 301 per incident + 300A annual summary + immediate severe-injury reporting',
  };
}

interface SignupFlowProps {
  onComplete: () => void;
  onBack: () => void;
}

export function SignupFlow({ onComplete, onBack }: SignupFlowProps) {
  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentFixedIdx, setCurrentFixedIdx] = useState(0);

  const techQs = useMemo(() => {
    if (!industry) return [];
    return TECH_QUESTIONS.filter((q) => q.industries.includes(industry));
  }, [industry]);

  const [currentTechIdx, setCurrentTechIdx] = useState(0);

  const totalSteps = useMemo(() => {
    if (!industry) return 4;
    const techCount = TECH_QUESTIONS.filter((q) => q.industries.includes(industry)).length;
    return 1 + techCount + FIXED_QUESTIONS.length + 1;
  }, [industry]);

  const currentStepNumber = useMemo(() => {
    if (step === 0) return 1;
    if (step === 1) return 2 + currentTechIdx;
    if (step === 2) return 2 + techQs.length + currentFixedIdx;
    return totalSteps;
  }, [step, currentTechIdx, currentFixedIdx, techQs.length, totalSteps]);

  const handleIndustrySelect = (id: Industry) => {
    setIndustry(id);
    setCurrentTechIdx(0);
    setStep(1);
  };

  const handleTechAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    if (currentTechIdx < techQs.length - 1) {
      setCurrentTechIdx((i) => i + 1);
    } else {
      setCurrentFixedIdx(0);
      setStep(2);
    }
  };

  const handleFixedAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    if (currentFixedIdx < FIXED_QUESTIONS.length - 1) {
      setCurrentFixedIdx((i) => i + 1);
    } else {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 0) {
      onBack();
    } else if (step === 1) {
      if (currentTechIdx > 0) {
        setCurrentTechIdx((i) => i - 1);
      } else {
        setStep(0);
        setIndustry(null);
      }
    } else if (step === 2) {
      if (currentFixedIdx > 0) {
        setCurrentFixedIdx((i) => i - 1);
      } else {
        setCurrentTechIdx(techQs.length - 1);
        setStep(1);
      }
    } else {
      setCurrentFixedIdx(FIXED_QUESTIONS.length - 1);
      setStep(2);
    }
  };

  const solution = useMemo(() => {
    if (step !== 3 || !industry) return null;
    return {
      capture: getIncidentCapture(answers, industry),
      data: getConnectedData(answers),
      migration: getMigrationPath(answers),
      priority: getFirstPriority(answers),
      coverage: getOshaCoverage(answers),
    };
  }, [step, industry, answers]);

  const industryLabel = INDUSTRIES.find((i) => i.id === industry)?.label || '';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: BLACK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
      `}</style>

      <div className="absolute left-0 top-0 bottom-0 w-1 lg:w-2" style={{ background: YELLOW }} />

      {/* progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
        <motion.div
          className="h-full"
          style={{ background: YELLOW }}
          animate={{ width: `${(currentStepNumber / totalSteps) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* nav */}
      <div className="absolute top-0 left-0 right-0 z-50 px-4 lg:px-8 h-16 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors bg-transparent border-none cursor-pointer"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
        >
          <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 10H5M9 6l-4 4 4 4" />
          </svg>
          Back
        </button>
        <span className="text-xs text-white/30 font-mono" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
          {currentStepNumber} / {totalSteps}
        </span>
      </div>

      <div className="w-full max-w-3xl mx-auto px-4 lg:px-8 pt-20 pb-8 max-h-screen overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="industry"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 max-w-[40px]" style={{ background: YELLOW }} />
                <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: YELLOW, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                  Step 1
                </span>
              </div>
              <h2
                className="text-3xl lg:text-5xl font-black tracking-tighter text-white mb-3"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                What industry are you in?
              </h2>
              <p className="text-sm text-white/40 mb-10" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                We tailor your setup based on your operation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {INDUSTRIES.map((ind, i) => (
                  <motion.button
                    key={ind.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => handleIndustrySelect(ind.id)}
                    className="group flex items-center gap-4 p-4 bg-white/[0.03] border border-white/[0.06] hover:border-[#FFE500]/30 hover:bg-white/[0.06] transition-all cursor-pointer text-left"
                  >
                    <span className="text-2xl">{ind.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-[#FFE500] transition-colors" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                        {ind.label}
                      </div>
                      <div className="text-xs text-white/30" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                        {ind.desc}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && techQs[currentTechIdx] && (
            <motion.div
              key={`tech-${techQs[currentTechIdx].id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 max-w-[40px]" style={{ background: YELLOW }} />
                <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: YELLOW, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                  Your Tech Stack
                </span>
              </div>
              <h2
                className="text-2xl lg:text-4xl font-black tracking-tighter text-white mb-3"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                {techQs[currentTechIdx].question}
              </h2>
              <p className="text-sm text-white/40 mb-10" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                This helps us connect your existing systems.
              </p>

              <div className="space-y-2">
                {techQs[currentTechIdx].options.map((opt, i) => (
                  <motion.button
                    key={opt}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleTechAnswer(techQs[currentTechIdx].id, opt)}
                    className={`w-full flex items-center gap-4 p-4 border transition-all cursor-pointer text-left ${
                      answers[techQs[currentTechIdx].id] === opt
                        ? 'border-[#FFE500]/50 bg-[#FFE500]/10'
                        : 'border-white/[0.06] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div
                      className="w-5 h-5 border-2 flex items-center justify-center shrink-0"
                      style={{
                        borderColor: answers[techQs[currentTechIdx].id] === opt ? YELLOW : 'rgba(255,255,255,0.2)',
                        background: answers[techQs[currentTechIdx].id] === opt ? YELLOW : 'transparent',
                      }}
                    >
                      {answers[techQs[currentTechIdx].id] === opt && (
                        <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke={BLACK} strokeWidth="2" strokeLinecap="round">
                          <path d="M2 6l3 3 5-5" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-white/80 font-medium" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                      {opt}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && FIXED_QUESTIONS[currentFixedIdx] && (
            <motion.div
              key={`fixed-${FIXED_QUESTIONS[currentFixedIdx].id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 max-w-[40px]" style={{ background: YELLOW }} />
                <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: YELLOW, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                  About Your Operation
                </span>
              </div>
              <h2
                className="text-2xl lg:text-4xl font-black tracking-tighter text-white mb-3"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                {FIXED_QUESTIONS[currentFixedIdx].question}
              </h2>
              <p className="text-sm text-white/40 mb-10" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                {currentFixedIdx === 0 && 'Determines your OSHA reporting requirements.'}
                {currentFixedIdx === 1 && 'So we can migrate your existing records.'}
                {currentFixedIdx === 2 && 'We prioritize what matters most to you.'}
                {currentFixedIdx === 3 && 'Helps us set up your log structure.'}
                {currentFixedIdx === 4 && 'We will match your timeline.'}
              </p>

              <div className="space-y-2">
                {FIXED_QUESTIONS[currentFixedIdx].options.map((opt, i) => (
                  <motion.button
                    key={opt}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleFixedAnswer(FIXED_QUESTIONS[currentFixedIdx].id, opt)}
                    className={`w-full flex items-center gap-4 p-4 border transition-all cursor-pointer text-left ${
                      answers[FIXED_QUESTIONS[currentFixedIdx].id] === opt
                        ? 'border-[#FFE500]/50 bg-[#FFE500]/10'
                        : 'border-white/[0.06] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div
                      className="w-5 h-5 border-2 flex items-center justify-center shrink-0"
                      style={{
                        borderColor: answers[FIXED_QUESTIONS[currentFixedIdx].id] === opt ? YELLOW : 'rgba(255,255,255,0.2)',
                        background: answers[FIXED_QUESTIONS[currentFixedIdx].id] === opt ? YELLOW : 'transparent',
                      }}
                    >
                      {answers[FIXED_QUESTIONS[currentFixedIdx].id] === opt && (
                        <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke={BLACK} strokeWidth="2" strokeLinecap="round">
                          <path d="M2 6l3 3 5-5" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-white/80 font-medium" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                      {opt}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && solution && (
            <motion.div
              key="solution"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 max-w-[40px]" style={{ background: YELLOW }} />
                <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: YELLOW, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                  Your Solution
                </span>
              </div>
              <h2
                className="text-2xl lg:text-4xl font-black tracking-tighter text-white mb-2"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                Built for your {industryLabel.toLowerCase()} operation.
              </h2>
              <p className="text-sm text-white/40 mb-10" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                Based on your answers, here is your custom Foremen setup.
              </p>

              <div className="space-y-3 mb-10">
                <SolutionCard
                  tag="CAPTURE"
                  label={solution.capture.label}
                  desc={solution.capture.desc}
                  delay={0}
                />

                {solution.data.length > 0 && solution.data.map((d, i) => (
                  <SolutionCard
                    key={d.label}
                    tag={i === 0 ? 'CONNECTED DATA' : ''}
                    label={d.label}
                    desc={d.desc}
                    delay={0.08 * (i + 1)}
                  />
                ))}

                <SolutionCard
                  tag="MIGRATION"
                  label={solution.migration.label}
                  desc={solution.migration.desc}
                  delay={0.08 * (solution.data.length + 1)}
                />

                <SolutionCard
                  tag="FIRST PRIORITY"
                  label={solution.priority.label}
                  desc={solution.priority.desc}
                  delay={0.08 * (solution.data.length + 2)}
                />

                <SolutionCard
                  tag="OSHA COVERAGE"
                  label={solution.coverage.label}
                  desc={solution.coverage.desc}
                  delay={0.08 * (solution.data.length + 3)}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={onComplete}
                  className="inline-flex items-center gap-2 text-sm font-bold px-8 py-4 transition-all hover:brightness-90 cursor-pointer border-none"
                  style={{
                    background: YELLOW,
                    color: BLACK,
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  }}
                >
                  Launch Your Dashboard
                  <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 10h10M11 6l4 4-4 4" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setStep(0);
                    setIndustry(null);
                    setAnswers({});
                    setCurrentTechIdx(0);
                    setCurrentFixedIdx(0);
                  }}
                  className="inline-flex items-center gap-2 text-sm font-bold px-6 py-4 border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all cursor-pointer bg-transparent"
                  style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
                >
                  Start Over
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SolutionCard({ tag, label, desc, delay }: { tag: string; label: string; desc: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-start gap-4 p-4 border border-white/[0.06] bg-white/[0.03]"
    >
      <div className="shrink-0 w-1 self-stretch" style={{ background: YELLOW }} />
      <div className="flex-1 min-w-0">
        {tag && (
          <div className="text-[10px] font-bold tracking-[0.2em] text-white/30 mb-1" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
            {tag}
          </div>
        )}
        <div className="text-sm font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
          {label}
        </div>
        <div className="text-xs text-white/45 leading-relaxed" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          {desc}
        </div>
      </div>
    </motion.div>
  );
}
