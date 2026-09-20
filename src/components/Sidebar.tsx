import type { ReactElement } from 'react';
import { Page } from '../types';

const NAV_ITEMS: { label: string; page: Page; icon: ReactElement }[] = [
  {
    label: 'Dashboard',
    page: 'dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" opacity="0.8"/>
        <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" opacity="0.8"/>
        <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.8"/>
        <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.8"/>
      </svg>
    ),
  },
  {
    label: 'Contextual Risk Assessment',
    page: 'contextual-risk',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5L14.5 13H1.5L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M8 6V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="8" cy="11" r="0.75" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'MFA Compliance Readiness',
    page: 'compliance-readiness',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Risk–Compliance Profile',
    page: 'risk-compliance-profile',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="1.5" width="6" height="6" rx="0.75" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="8.5" y="1.5" width="6" height="6" rx="0.75" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="1.5" y="8.5" width="6" height="6" rx="0.75" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="8.5" y="8.5" width="6" height="6" rx="0.75" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.3"/>
      </svg>
    ),
  },
  {
    label: 'Decision Rules',
    page: 'decision-rules',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 4H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M2 8H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M2 12H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="13" cy="12" r="2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    label: 'Organisation Policy',
    page: 'organisation-policy',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5L14 4V8C14 11.5 11 14 8 14.5C5 14 2 11.5 2 8V4L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M5.5 8L7 9.5L10.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'MFA Recommendation',
    page: 'mfa-recommendation',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="4" y="7" width="8" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5.5 7V5C5.5 3.07 10.5 3.07 10.5 5V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="8" cy="10.5" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Practitioner Review',
    page: 'practitioner-review',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 14C2 11.239 4.686 9 8 9C11.314 9 14 11.239 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Evaluation & Feedback',
    page: 'evaluation-feedback',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5L9.5 5.5H14L10.5 8L11.5 12L8 9.5L4.5 12L5.5 8L2 5.5H6.5L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

interface SidebarProps {
  currentPage: Page;
  navigate: (page: Page) => void;
}

export default function Sidebar({ currentPage, navigate }: SidebarProps) {
  return (
    <aside
      className="fixed left-0 top-0 h-full flex flex-col z-10"
      style={{ width: 240, background: '#06242D' }}
    >
      {/* Brand */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2.5 mb-1">
          <div
            className="flex items-center justify-center rounded-md"
            style={{ width: 30, height: 30, background: '#0F8B83' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L13.5 3.5V8C13.5 11 11 13.5 8 14.5C5 13.5 2.5 11 2.5 8V3.5L8 1Z" fill="#35D6AE"/>
              <path d="M5.5 8L7 9.5L10.5 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="font-semibold text-white text-sm leading-tight">Zero Trust</div>
            <div className="text-xs leading-tight" style={{ color: '#35D6AE' }}>MFA Decision Support</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        {NAV_ITEMS.map(({ label, page, icon }) => {
          const isActive = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => navigate(page)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md mb-0.5 text-left transition-all duration-150"
              style={{
                background: isActive ? '#0F8B83' : 'transparent',
                color: isActive ? '#ffffff' : '#93B5BE',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
            >
              <span style={{ color: isActive ? '#35D6AE' : '#66818C', flexShrink: 0 }}>{icon}</span>
              <span className="text-sm font-medium leading-tight">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-5 py-4 flex items-center gap-2 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div
          className="rounded-full flex items-center justify-center"
          style={{ width: 7, height: 7, background: '#35D6AE' }}
        />
        <span className="text-xs" style={{ color: '#66818C' }}>Secure workspace</span>
      </div>
    </aside>
  );
}
