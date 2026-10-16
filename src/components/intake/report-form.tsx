'use client';

import { useState, useRef } from 'react';
import { clsx } from 'clsx';
import { useAppStore } from '@/lib/stores/app-store';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 'describe' | 'extracting' | 'review' | 'submitted';

interface ExtractedFacts {
  employeeName: string;
  date: string;
  type: 'injury' | 'illness' | 'near-miss';
  bodyPart: string;
  location: string;
  description: string;
  severity: string;
  treatments: string;
  confidence: 'high' | 'medium' | 'low';
}

const SIMULATED_EXTRACTION: ExtractedFacts = {
  employeeName: 'Marcus Johnson',
  date: new Date().toISOString().split('T')[0],
  type: 'injury',
  bodyPart: 'Right hand',
  location: 'Warehouse B - Loading Dock',
  description: 'Employee caught hand between pallet and dock bumper while unloading delivery truck.',
  severity: 'medical',
  treatments: 'Sent to urgent care, X-ray ordered, splint applied',
  confidence: 'high',
};

export function ReportForm() {
  const { addIncident } = useAppStore();
  const [step, setStep] = useState<Step>('describe');
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [extractedFacts, setExtractedFacts] = useState<ExtractedFacts | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmitDescription() {
    if (!inputText.trim()) return;
    setStep('extracting');
    setTimeout(() => {
      setExtractedFacts(SIMULATED_EXTRACTION);
      setStep('review');
    }, 2200);
  }

  function handleAcceptAndSubmit() {
    if (!extractedFacts) return;
    const id = `INC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;
    addIncident({
      id,
      employeeName: extractedFacts.employeeName,
      date: extractedFacts.date,
      type: extractedFacts.type,
      bodyPart: extractedFacts.bodyPart,
      location: extractedFacts.location,
      description: extractedFacts.description,
      status: 'pending-review',
      severity: extractedFacts.severity as any,
      oshaRecordable: null,
      createdAt: new Date().toISOString(),
    });
    setStep('submitted');
  }

  function handleReset() {
    setStep('describe');
    setInputText('');
    setExtractedFacts(null);
    setIsRecording(false);
  }

  function toggleRecording() {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInputText(
          "Marcus in warehouse B caught his right hand between a pallet and the dock bumper while unloading a delivery truck around 9am. We sent him to urgent care, they did an X-ray and put a splint on it. He can't use his right hand for at least a week."
        );
      }, 3000);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {step === 'describe' && (
          <motion.div
            key="describe"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-[var(--accent-subtle)] flex items-center justify-center mx-auto mb-4">
                <MicIcon className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <h3
                className="text-lg font-semibold text-[var(--ink)] mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Describe what happened
              </h3>
              <p className="text-sm text-[var(--ink-muted)] max-w-md mx-auto">
                Use your own words. Talk or type like you're telling a coworker. Our AI will extract the details and fill out the OSHA forms for you.
              </p>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] overflow-hidden">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={6}
                  placeholder='Example: "John in building A slipped on a wet floor near the break room and hurt his lower back. He went to the clinic and they gave him muscle relaxants..."'
                  className="w-full p-5 pb-16 text-sm text-[var(--ink)] bg-transparent border-none outline-none resize-none placeholder:text-[var(--ink-faint)]"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 border-t border-[var(--border)] bg-[var(--card)]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleRecording}
                      className={clsx(
                        'flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] text-xs font-medium transition-all',
                        isRecording
                          ? 'bg-[var(--alert)] text-white'
                          : 'bg-[var(--accent-subtle)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white'
                      )}
                      style={{ transitionDuration: 'var(--duration-fast)' }}
                    >
                      {isRecording ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          Recording...
                        </>
                      ) : (
                        <>
                          <MicIcon className="w-3.5 h-3.5" />
                          Voice
                        </>
                      )}
                    </button>
                    <button
                      className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] text-xs font-medium bg-[var(--blue-subtle)] text-[var(--blue)] hover:bg-[var(--blue)] hover:text-white transition-all"
                      style={{ transitionDuration: 'var(--duration-fast)' }}
                    >
                      <CameraIcon className="w-3.5 h-3.5" />
                      Photos
                    </button>
                  </div>
                  <button
                    onClick={handleSubmitDescription}
                    disabled={!inputText.trim()}
                    className={clsx(
                      'flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-xs font-medium transition-all',
                      inputText.trim()
                        ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
                        : 'bg-[var(--border)] text-[var(--ink-faint)] cursor-not-allowed'
                    )}
                    style={{ transitionDuration: 'var(--duration-fast)' }}
                  >
                    <SparklesIcon className="w-3.5 h-3.5" />
                    Extract with AI
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: '1', text: 'You describe it in plain language' },
                { icon: '2', text: 'AI extracts employee, body part, treatments' },
                { icon: '3', text: 'Review the facts, then submit for OSHA classification' },
              ].map((s) => (
                <div key={s.icon} className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--card)] border border-[var(--border)]">
                  <span
                    className="w-5 h-5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5"
                  >
                    {s.icon}
                  </span>
                  <p className="text-xs text-[var(--ink-muted)] leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'extracting' && (
          <motion.div
            key="extracting"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-center py-20"
          >
            <div className="w-14 h-14 rounded-full bg-[var(--accent-subtle)] flex items-center justify-center mx-auto mb-5">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              >
                <SparklesIcon className="w-6 h-6 text-[var(--accent)]" />
              </motion.div>
            </div>
            <h3 className="text-lg font-semibold text-[var(--ink)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Extracting incident details...
            </h3>
            <p className="text-sm text-[var(--ink-muted)]">
              Reading your description and identifying employee, injuries, treatments, and location
            </p>
            <div className="mt-8 max-w-sm mx-auto space-y-3">
              {['Employee name', 'Body part affected', 'Treatments given', 'Location identified'].map((label, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.4, duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.4 + 0.2, type: 'spring', damping: 12 }}
                  >
                    <div className="w-5 h-5 rounded-full bg-[var(--engine)] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 8l3.5 3.5L13 5" />
                      </svg>
                    </div>
                  </motion.div>
                  <span className="text-sm text-[var(--ink-muted)]">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'review' && extractedFacts && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
                  Review Extracted Details
                </h3>
                <p className="text-sm text-[var(--ink-muted)] mt-1">
                  AI pulled these facts from your description. Edit anything that's wrong before submitting.
                </p>
              </div>
              <span
                className={clsx(
                  'text-[11px] font-medium px-2.5 py-1 rounded-full',
                  extractedFacts.confidence === 'high'
                    ? 'bg-[var(--engine-subtle)] text-[var(--engine)]'
                    : extractedFacts.confidence === 'medium'
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                    : 'bg-[var(--alert-subtle)] text-[var(--alert)]'
                )}
              >
                {extractedFacts.confidence === 'high' ? 'High' : extractedFacts.confidence === 'medium' ? 'Medium' : 'Low'} confidence
              </span>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FactField label="Employee Name" value={extractedFacts.employeeName} source="your description" />
                <FactField label="Date" value={extractedFacts.date} source="auto-detected" />
                <FactField label="Incident Type" value={extractedFacts.type} source="classified from description" />
                <FactField label="Body Part" value={extractedFacts.bodyPart} source='"caught his right hand"' />
                <FactField label="Location" value={extractedFacts.location} source='"warehouse B... dock bumper"' />
                <FactField label="Severity" value={extractedFacts.severity} source="urgent care + splint = medical treatment" />
              </div>
              <div className="mt-5 pt-5 border-t border-[var(--border)]">
                <FactField label="Treatments" value={extractedFacts.treatments} source='"X-ray and put a splint on it"' fullWidth />
              </div>
              <div className="mt-5 pt-5 border-t border-[var(--border)]">
                <FactField label="AI Summary" value={extractedFacts.description} source="generated from your words" fullWidth />
              </div>
            </div>

            <div className="mt-4 rounded-[var(--radius-md)] bg-[var(--accent-subtle)] border border-[var(--accent)] border-opacity-20 p-4">
              <div className="flex items-start gap-3">
                <SparklesIcon className="w-4 h-4 text-[var(--accent)] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-[var(--accent)]">What happens next</p>
                  <p className="text-xs text-[var(--ink-muted)] mt-1">
                    After you submit, the rules engine will check OSHA 1904.5 through 1904.11 to determine if this is recordable. A safety manager will then review and accept or override the classification.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-[var(--ink-muted)] rounded-[var(--radius-md)] border border-[var(--border)] hover:bg-[var(--card-hover)] transition-colors"
                style={{ transitionDuration: 'var(--duration-fast)' }}
              >
                Start Over
              </button>
              <button
                onClick={handleAcceptAndSubmit}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-[var(--radius-md)] hover:opacity-90 transition-colors"
                style={{ backgroundColor: 'var(--accent)', transitionDuration: 'var(--duration-fast)' }}
              >
                Submit for Classification
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}

        {step === 'submitted' && (
          <motion.div
            key="submitted"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-center py-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, delay: 0.1 }}
              className="w-14 h-14 rounded-full bg-[var(--engine-subtle)] flex items-center justify-center mx-auto mb-4"
            >
              <svg className="w-7 h-7 text-[var(--engine)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </motion.div>
            <h3 className="text-lg font-semibold text-[var(--ink)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Incident Submitted
            </h3>
            <p className="text-sm text-[var(--ink-muted)] mb-2">
              The rules engine is now classifying this incident against OSHA 1904.5-11.
            </p>
            <p className="text-xs text-[var(--ink-faint)] mb-6">
              A safety manager will review the classification shortly.
            </p>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-white rounded-[var(--radius-md)] transition-colors"
              style={{ backgroundColor: 'var(--accent)', transitionDuration: 'var(--duration-fast)' }}
            >
              Report Another Incident
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FactField({ label, value, source, fullWidth }: { label: string; value: string; source: string; fullWidth?: boolean }) {
  return (
    <div className={fullWidth ? '' : ''}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--ink-faint)]" style={{ fontFamily: 'var(--font-body)' }}>
          {label}
        </span>
        <span className="text-[10px] text-[var(--accent)] font-mono" style={{ fontFamily: 'var(--font-mono)' }}>
          AI-extracted
        </span>
      </div>
      <p className="text-sm font-medium text-[var(--ink)] capitalize">{value}</p>
      <p className="text-[11px] text-[var(--ink-faint)] mt-0.5 italic">Source: {source}</p>
    </div>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5.5" y="1.5" width="5" height="9" rx="2.5" />
      <path d="M3 7.5a5 5 0 0010 0M8 12.5v2M6 14.5h4" />
    </svg>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 5.5a1 1 0 011-1h2l1-1.5h4l1 1.5h2a1 1 0 011 1v7a1 1 0 01-1 1H3a1 1 0 01-1-1v-7z" />
      <circle cx="8" cy="8.5" r="2.5" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0l1.5 4.5L14 6l-4.5 1.5L8 12l-1.5-4.5L2 6l4.5-1.5L8 0z" />
      <path d="M12 8l.75 2.25L15 11l-2.25.75L12 14l-.75-2.25L9 11l2.25-.75L12 8z" opacity="0.6" />
    </svg>
  );
}
