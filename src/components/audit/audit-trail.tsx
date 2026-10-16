'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/stores/app-store';

export function AuditTrail() {
  const { auditLog } = useAppStore();

  return (
    <motion.div className="space-y-4 max-w-4xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <p className="text-sm text-[var(--ink-muted)]">
        Every submission, engine decision, sign-off and override, newest first. Entries are never edited or deleted.
      </p>
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] divide-y divide-[var(--border)]">
        {auditLog.map((e, i) => (
          <motion.div
            key={e.id}
            className="px-5 py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: Math.min(i, 12) * 0.03 }}
          >
            <span className="text-[11px] text-[var(--ink-faint)] sm:w-40 shrink-0" style={{ fontFamily: 'var(--font-mono)' }}>
              {new Date(e.at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--ink)]">
                <span className="font-medium">{e.action}</span>{' '}
                <span className="text-[var(--ink-faint)]" style={{ fontFamily: 'var(--font-mono)' }}>{e.incidentId}</span>
              </p>
              <p className="text-xs text-[var(--ink-muted)] mt-0.5 break-words">{e.detail}</p>
            </div>
            <span className="text-xs text-[var(--ink-muted)] shrink-0">{e.actor}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
