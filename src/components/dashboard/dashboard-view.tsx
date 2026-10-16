'use client';

import { StatsCards } from './stats-cards';
import { RecentIncidents } from './recent-incidents';
import { ComplianceChart } from './compliance-chart';
import { motion } from 'framer-motion';

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
};

export function DashboardView() {
  return (
    <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
      <motion.div variants={fadeUp}>
        <p className="text-sm text-[var(--ink-muted)] mb-1" style={{ fontFamily: 'var(--font-body)' }}>
          Good morning
        </p>
        <h2 className="text-xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
          Safety Overview
        </h2>
      </motion.div>
      <motion.div variants={fadeUp}>
        <StatsCards />
      </motion.div>
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <RecentIncidents />
        </div>
        <div className="lg:col-span-2">
          <ComplianceChart />
        </div>
      </motion.div>
    </motion.div>
  );
}
