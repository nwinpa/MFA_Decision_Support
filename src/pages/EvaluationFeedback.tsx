import { Page } from '../types';
import AssessmentJourney from '../components/AssessmentJourney';
import { useAssessment } from '../state/AssessmentContext';
import { MFA_LABEL } from '../lib/decisionEngine';

interface EvaluationFeedbackProps {
  navigate: (page: Page) => void;
  currentPage: Page;
}

function MetricCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className="rounded-xl p-5 text-center"
      style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <div className="relative inline-flex items-center justify-center mb-3">
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="30" fill="none" stroke="#F0F4F6" strokeWidth="7"/>
          <circle
            cx="36" cy="36" r="30"
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${(value / 100) * 188.5} 188.5`}
            transform="rotate(-90 36 36)"
          />
        </svg>
        <span className="absolute text-sm font-bold" style={{ color }}>{value}%</span>
      </div>
      <p className="text-xs leading-snug" style={{ color: '#66818C' }}>{label}</p>
    </div>
  );
}

export default function EvaluationFeedback({ navigate, currentPage }: EvaluationFeedbackProps) {
  const { profile, policyCheck, practitionerReview } = useAssessment();
  const practitionerDecisionLabel =
    practitionerReview.decision === 'accept' ? 'Accepted'
    : practitionerReview.decision === 'override' ? 'Overridden'
    : 'Not yet reviewed';

  return (
    <div className="space-y-5">
      <AssessmentJourney currentPage={currentPage} navigate={navigate} />

      {/* Complete status */}
      <div
        className="rounded-xl px-6 py-4 flex items-center gap-4"
        style={{ background: '#073F40', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
      >
        <div
          className="flex items-center justify-center rounded-full flex-shrink-0"
          style={{ width: 44, height: 44, background: 'rgba(53,214,174,0.2)' }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10L8 14L16 6" stroke="#35D6AE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest" style={{ color: '#35D6AE' }}>
            ASSESSMENT COMPLETE
          </p>
          <p className="text-sm font-semibold text-white mt-0.5">
            TrustGuard MFA decision cycle completed successfully
          </p>
        </div>
        <div className="ml-auto">
          <p className="text-xs text-right" style={{ color: '#93B5BE' }}>Completed</p>
          <p className="text-xs font-medium text-white">
            {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Recommendation Acceptance Rate" value={87} color="#008A62" />
        <MetricCard label="MFA Appropriateness Rate" value={91} color="#0F8B83" />
        <MetricCard label="Explanation Clarity Rate" value={78} color="#1677E8" />
        <MetricCard label="User Guidance Appropriateness Rate" value={83} color="#E85D04" />
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Feedback Summary */}
        <div
          className="rounded-xl p-5"
          style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#102631' }}>Feedback Summary</h3>

          <div className="space-y-3">
            {[
              { label: 'Assessments completed', value: '1', color: '#102631' },
              { label: 'Practitioner decision', value: practitionerDecisionLabel, color: practitionerReview.decision === 'override' ? '#E53935' : '#008A62' },
              { label: 'MFA type recommended', value: MFA_LABEL[policyCheck.finalLevel], color: '#008A62' },
              { label: 'Decision rule applied', value: profile.rule.id, color: '#E53935' },
              { label: 'Profile quadrant', value: profile.profileLabel, color: '#E85D04' },
              { label: 'Policy guardrail triggered', value: policyCheck.guardrailApplied ? 'Yes' : 'No', color: '#66818C' },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="flex items-center justify-between py-2"
                style={{ borderBottom: '1px solid #F0F4F6' }}
              >
                <span className="text-xs" style={{ color: '#66818C' }}>{label}</span>
                <span className="text-xs font-semibold" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Practitioner Comments */}
        <div className="space-y-4">
          <div
            className="rounded-xl p-5"
            style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#102631' }}>Practitioner Comments</h3>
            <div
              className="rounded-lg p-4 relative"
              style={{ background: '#F5F8FA', border: '1px solid #DCE8EB' }}
            >
              <div
                className="absolute top-3 left-3 w-0.5 rounded-full"
                style={{ height: 'calc(100% - 24px)', background: '#0F8B83' }}
              />
              <p className="text-sm leading-relaxed pl-4" style={{ color: '#66818C', fontStyle: 'italic' }}>
                {practitionerReview.comments.trim()
                  ? `"${practitionerReview.comments.trim()}"`
                  : practitionerReview.decision === 'override'
                  ? `"Override recorded — see reason: ${practitionerReview.overrideReason.trim() || 'no reason provided'}."`
                  : '"No practitioner comments have been recorded for this review yet."'}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                style={{ background: '#0F8B83' }}
              >
                SP
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: '#102631' }}>Security Practitioner</p>
                <p className="text-xs" style={{ color: '#66818C' }}>Review mode · Authorised reviewer</p>
              </div>
            </div>
          </div>

          <div
            className="rounded-xl p-4"
            style={{ background: '#F0FBF9', border: '1px solid #A7F3D0' }}
          >
            <p className="text-xs font-semibold mb-2" style={{ color: '#0F8B83' }}>Assessment record</p>
            <p className="text-xs leading-relaxed" style={{ color: '#66818C' }}>
              This completed assessment has been recorded. The outcome and practitioner review are
              stored for audit and continuous improvement purposes.
            </p>
          </div>
        </div>
      </div>

      {/* Feedback for System Refinement */}
      <div
        className="rounded-xl p-5"
        style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <p className="text-xs font-semibold tracking-widest mb-2" style={{ color: '#66818C' }}>
          FEEDBACK FOR SYSTEM REFINEMENT
        </p>
        <p className="text-sm leading-relaxed" style={{ color: '#66818C' }}>
          Practitioner and evaluation feedback can be used to refine decision rules, explanations
          and user guidance. This represents the refinement feedback loop in the conceptual
          framework.
        </p>
        <div
          className="mt-3 rounded-lg px-4 py-3 flex items-start gap-2"
          style={{ background: '#F5F8FA', border: '1px solid #DCE8EB' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 mt-0.5">
            <circle cx="7" cy="7" r="6" stroke="#66818C" strokeWidth="1.2"/>
            <path d="M7 5V7.5" stroke="#66818C" strokeWidth="1.2" strokeLinecap="round"/>
            <circle cx="7" cy="9.5" r="0.6" fill="#66818C"/>
          </svg>
          <p className="text-xs leading-relaxed" style={{ color: '#66818C' }}>
            Note: feedback does not automatically change decision rules. Any refinement requires
            deliberate review and authorisation by an appropriate governance body.
          </p>
        </div>
      </div>

      {/* Return button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => navigate('dashboard')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
          style={{ background: '#073F40', color: '#35D6AE', border: '1px solid rgba(53,214,174,0.3)' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#0F8B83')}
          onMouseLeave={e => (e.currentTarget.style.background = '#073F40')}
        >
          ← Return to Dashboard
        </button>
      </div>
    </div>
  );
}
