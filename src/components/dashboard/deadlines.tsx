'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/stores/app-store';
import { SEVERE_EVENT_LABELS } from '@/lib/schemas/incident';
import { DAY_MS, useNow } from '@/lib/use-now';

interface Deadline {
  key: string;
  title: string;
  detail: string;
  due: number;
  rule: string;
  view?: string;
}

function dueText(due: number, now: number) {
  const ms = due - now;
  if (ms < 0) return { text: 'Overdue', color: 'var(--alert)' };
  if (ms < DAY_MS) return { text: `${Math.max(1, Math.floor(ms / 3_600_000))}h left`, color: 'var(--alert)' };
  const days = Math.ceil(ms / DAY_MS);
  return { text: `${days} day${days === 1 ? '' : 's'}`, color: days <= 2 ? 'var(--alert)' : days <= 7 ? 'var(--accent)' : 'var(--ink-faint)' };
}

export function Deadlines() {
  const { incidents, setActiveView } = useAppStore();
  const now = useNow();

  const items: Deadline[] = [];
  if (now !== null) {
    for (const i of incidents) {
      if (i.severeAlert && !i.severeAlert.reportedAt) {
        items.push({
          key: `${i.id}-severe`,
          title: `Report ${SEVERE_EVENT_LABELS[i.severeAlert.event].toLowerCase()} to OSHA`,
          detail: i.employeeName,
          due: new Date(i.severeAlert.deadlineAt).getTime(),
          rule: '1904.39',
        });
      }
      if (i.review.status === 'pending' && i.determination.outcome !== 'not-recordable') {
        items.push({
          key: `${i.id}-log`,
          title: `Sign off ${i.employeeName}'s case`,
          detail: 'Must be on the log within 7 days',
          due: new Date(i.createdAt).getTime() + 7 * DAY_MS,
          rule: '1904.29(b)(3)',
          view: 'review',
        });
      }
    }
    const nextYear = new Date(now).getFullYear() + 1;
    items.push(
      {
        key: 'post-300a',
        title: 'Post signed 300A summary',
        detail: 'Executive certifies it; stays up until Apr 30',
        due: new Date(nextYear, 1, 1).getTime(),
        rule: '1904.32',
      },
      {
        key: 'ita',
        title: 'Upload to OSHA ITA',
        detail: 'If your site is required to file electronically',
        due: new Date(nextYear, 2, 2).getTime(),
        rule: '1904.41',
      }
    );
    items.sort((a, b) => a.due - b.due);
  }

  return (
    <motion.div
      className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] h-full"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="px-5 py-4 border-b border-[var(--border)]">
        <h3 className="text-sm font-semibold text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
          Deadlines
        </h3>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {now !== null &&
          items.map((d, i) => {
            const due = dueText(d.due, now);
            return (
              <motion.button
                key={d.key}
                type="button"
                disabled={!d.view}
                onClick={() => d.view && setActiveView(d.view)}
                className="w-full text-left px-5 py-3 flex items-start gap-3 disabled:cursor-default"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
                whileHover={{ backgroundColor: 'var(--card-hover)' }}
              >
                <span className="w-1.5 self-stretch rounded-full shrink-0" style={{ backgroundColor: due.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--ink)]">{d.title}</p>
                  <p className="text-[11px] text-[var(--ink-faint)] mt-0.5">
                    {d.detail} · <span style={{ fontFamily: 'var(--font-mono)' }}>{d.rule}</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold tabular-nums" style={{ color: due.color }}>
                    {due.text}
                  </p>
                  <p className="text-[11px] text-[var(--ink-faint)]">
                    {new Date(d.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </motion.button>
            );
          })}
      </div>
    </motion.div>
  );
}
