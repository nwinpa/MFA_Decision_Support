import { Page } from '../types';

const PAGE_TITLES: Record<Page, { title: string; subtitle?: string }> = {
  dashboard: { title: 'Decision Support Dashboard', subtitle: 'Zero Trust MFA compliance for banking' },
  'contextual-risk': { title: 'Contextual Risk Assessment', subtitle: 'Step 1 of 7 — Context assessment' },
  'compliance-readiness': { title: 'MFA Compliance Readiness', subtitle: 'Step 2 of 7 — Readiness questions' },
  'risk-compliance-profile': { title: 'Risk–Compliance Profile', subtitle: 'Step 3 of 7 — Binary profile matrix' },
  'decision-rules': { title: 'Decision Rules', subtitle: 'Step 4 of 7 — Rule application' },
  'organisation-policy': { title: 'Organisation Policy', subtitle: 'Security policy configuration' },
  'mfa-recommendation': { title: 'MFA Recommendation', subtitle: 'Step 5 of 7 — Proposed control' },
  'practitioner-review': { title: 'Practitioner Review', subtitle: 'Step 6 of 7 — Expert validation' },
  'evaluation-feedback': { title: 'Evaluation & Feedback', subtitle: 'Step 7 of 7 — Outcome confirmation' },
};

interface HeaderProps {
  currentPage: Page;
}

export default function Header({ currentPage }: HeaderProps) {
  const { title, subtitle } = PAGE_TITLES[currentPage];

  return (
    <header
      className="fixed top-0 right-0 flex items-center justify-between px-6 z-10"
      style={{
        left: 240,
        height: 60,
        background: '#FFFFFF',
        borderBottom: '1px solid #DCE8EB',
      }}
    >
      <div>
        <h1 className="text-base font-semibold leading-tight" style={{ color: '#102631' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs leading-tight mt-0.5" style={{ color: '#66818C' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm font-medium leading-tight" style={{ color: '#102631' }}>
            Security Practitioner
          </div>
          <div className="text-xs leading-tight" style={{ color: '#0F8B83' }}>
            Review mode
          </div>
        </div>
        <div
          className="flex items-center justify-center rounded-full text-white text-sm font-semibold"
          style={{ width: 34, height: 34, background: '#0F8B83' }}
        >
          SP
        </div>
      </div>
    </header>
  );
}
