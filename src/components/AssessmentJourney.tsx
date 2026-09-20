import { Page } from '../types';

const STEPS: { num: number; title: string; desc: string; page: Page }[] = [
  { num: 1, title: 'Context', desc: 'Assess role and network context', page: 'contextual-risk' },
  { num: 2, title: 'Compliance', desc: 'Answer 16 readiness questions', page: 'compliance-readiness' },
  { num: 3, title: 'Profile', desc: 'View the binary 2 × 2 profile', page: 'risk-compliance-profile' },
  { num: 4, title: 'Decision Rules', desc: 'Apply one of four decision rules', page: 'decision-rules' },
  { num: 5, title: 'Recommendation', desc: 'Review the proposed MFA control', page: 'mfa-recommendation' },
  { num: 6, title: 'Review', desc: 'Validate the recommendation', page: 'practitioner-review' },
  { num: 7, title: 'Evaluates', desc: 'Confirm outcome and feedback', page: 'evaluation-feedback' },
];

const PAGE_TO_STEP: Partial<Record<Page, number>> = {
  'contextual-risk': 1,
  'compliance-readiness': 2,
  'risk-compliance-profile': 3,
  'decision-rules': 4,
  'mfa-recommendation': 5,
  'practitioner-review': 6,
  'evaluation-feedback': 7,
};

interface AssessmentJourneyProps {
  currentPage: Page;
  navigate: (page: Page) => void;
}

export default function AssessmentJourney({ currentPage, navigate }: AssessmentJourneyProps) {
  const activeStep = PAGE_TO_STEP[currentPage] ?? 0;

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold" style={{ color: '#102631' }}>Assessment Progress</h2>
          <p className="text-xs mt-0.5" style={{ color: '#66818C' }}>
            Complete 16 questions, then review the evidence behind the recommendation.
          </p>
        </div>
        {activeStep > 0 && (
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: '#F0FBF9', color: '#0F8B83', border: '1px solid #DCE8EB' }}
          >
            Step {activeStep} of 7
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {STEPS.map(({ num, title, desc, page }) => {
          const isActive = activeStep === num;
          const isCompleted = activeStep > num;

          return (
            <button
              key={num}
              onClick={() => navigate(page)}
              className="flex-1 text-left rounded-md px-2.5 py-2 transition-all duration-150"
              style={{
                background: isActive ? '#F0FBF9' : '#F5F8FA',
                border: `1px solid ${isActive ? '#0F8B83' : '#DCE8EB'}`,
                minWidth: 0,
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <div
                  className="flex items-center justify-center rounded-full text-xs font-semibold flex-shrink-0"
                  style={{
                    width: 20,
                    height: 20,
                    background: isActive
                      ? '#073F40'
                      : isCompleted
                      ? '#0F8B83'
                      : '#DCE8EB',
                    color: isActive || isCompleted ? '#fff' : '#66818C',
                  }}
                >
                  {isCompleted ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    num
                  )}
                </div>
                <span
                  className="text-xs font-semibold truncate"
                  style={{ color: isActive ? '#073F40' : '#66818C' }}
                >
                  {title}
                </span>
              </div>
              <p
                className="text-xs leading-tight"
                style={{ color: isActive ? '#0F8B83' : '#93B5BE', lineHeight: '1.3' }}
              >
                {desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
