import { Page } from '../types';
import AssessmentJourney from '../components/AssessmentJourney';
import { useAssessment } from '../state/AssessmentContext';
import { MFA_LABEL } from '../lib/decisionEngine';

interface PractitionerReviewProps {
  navigate: (page: Page) => void;
  currentPage: Page;
}

const FEEDBACK_CATEGORIES = [
  'MFA strength too high',
  'MFA strength too low',
  'Risk assessment issue',
  'Compliance assessment issue',
  'Explanation needs improvement',
  'User guidance needs improvement',
  'Organisation policy issue',
  'Other',
];

export default function PractitionerReview({ navigate, currentPage }: PractitionerReviewProps) {
  const { contextualRisk, readiness, profile, policyCheck, practitionerReview, setPractitionerReview } = useAssessment();
  const { decision, appropriate, explanationClear, guidanceAppropriate, selectedCategories, comments, overrideReason } = practitionerReview;

  const setDecision = (v: 'accept' | 'override') => setPractitionerReview(p => ({ ...p, decision: v }));
  const setAppropriate = (v: boolean) => setPractitionerReview(p => ({ ...p, appropriate: v }));
  const setExplanationClear = (v: boolean) => setPractitionerReview(p => ({ ...p, explanationClear: v }));
  const setGuidanceAppropriate = (v: boolean) => setPractitionerReview(p => ({ ...p, guidanceAppropriate: v }));
  const setComments = (v: string) => setPractitionerReview(p => ({ ...p, comments: v }));
  const setOverrideReason = (v: string) => setPractitionerReview(p => ({ ...p, overrideReason: v }));

  const toggleCategory = (cat: string) => {
    setPractitionerReview(p => ({
      ...p,
      selectedCategories: p.selectedCategories.includes(cat)
        ? p.selectedCategories.filter(c => c !== cat)
        : [...p.selectedCategories, cat],
    }));
  };

  const YesNo = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: boolean | null;
    onChange: (v: boolean) => void;
  }) => (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #F0F4F6' }}>
      <span className="text-sm" style={{ color: '#102631' }}>{label}</span>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(true)}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: value === true ? '#0F8B83' : '#F5F8FA',
            color: value === true ? '#FFFFFF' : '#66818C',
            border: `1px solid ${value === true ? '#0F8B83' : '#DCE8EB'}`,
          }}
        >
          Yes
        </button>
        <button
          onClick={() => onChange(false)}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: value === false ? '#E53935' : '#F5F8FA',
            color: value === false ? '#FFFFFF' : '#66818C',
            border: `1px solid ${value === false ? '#E53935' : '#DCE8EB'}`,
          }}
        >
          No
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <AssessmentJourney currentPage={currentPage} navigate={navigate} />

      {/* Status banner */}
      <div
        className="rounded-xl px-5 py-3 flex items-center gap-3"
        style={{ background: '#F3E8FF', border: '1px solid #D8B4FE' }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="#7C3AED" strokeWidth="1.5"/>
          <circle cx="8" cy="5" r="1.5" fill="#7C3AED"/>
          <path d="M8 8V12" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span className="text-xs font-semibold tracking-widest" style={{ color: '#7C3AED' }}>
          COMPLETED BY AUTHORISED SECURITY PRACTITIONER
        </span>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          {/* Full traceability — 6 data points */}
          <div
            className="rounded-xl p-5"
            style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <h3 className="text-sm font-semibold mb-4" style={{ color: '#102631' }}>Assessment Summary</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Contextual Risk', value: contextualRisk.level, color: contextualRisk.level === 'HIGH' ? '#E53935' : '#008A62', bg: contextualRisk.level === 'HIGH' ? '#FEF2F2' : '#F0FDF4', border: contextualRisk.level === 'HIGH' ? '#FCA5A5' : '#A7F3D0' },
                { label: 'MFA Compliance Readiness', value: readiness.level === 'HIGH READINESS' ? 'HIGH' : 'LOW', color: readiness.level === 'HIGH READINESS' ? '#008A62' : '#1677E8', bg: readiness.level === 'HIGH READINESS' ? '#F0FDF4' : '#EFF6FF', border: readiness.level === 'HIGH READINESS' ? '#A7F3D0' : '#BFDBFE' },
                { label: 'Risk–Compliance Profile', value: profile.profileLabel, color: '#E85D04', bg: '#FFF7ED', border: '#FED7AA' },
                { label: 'Decision Rule', value: profile.rule.id, color: '#E53935', bg: '#FEF2F2', border: '#FCA5A5' },
                { label: 'MFA Recommendation', value: MFA_LABEL[policyCheck.finalLevel], color: '#008A62', bg: '#F0FBF9', border: '#A7F3D0' },
                { label: 'User Guidance', value: profile.rule.guidance, color: '#102631', bg: '#F5F8FA', border: '#DCE8EB' },
              ].map(({ label, value, color, bg, border }) => (
                <div key={label} className="rounded-lg p-3" style={{ background: bg, border: `1px solid ${border}` }}>
                  <p className="text-xs mb-1" style={{ color: '#66818C' }}>{label}</p>
                  <p className="text-xs font-semibold leading-snug" style={{ color }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Accept / Override */}
          <div
            className="rounded-xl p-5"
            style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#102631' }}>
              Accept recommendation?
            </h3>
            <div className="flex gap-4 mb-5">
              <button
                onClick={() => setDecision('accept')}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: decision === 'accept' ? '#0F8B83' : '#F5F8FA',
                  color: decision === 'accept' ? '#FFFFFF' : '#66818C',
                  border: `2px solid ${decision === 'accept' ? '#0F8B83' : '#DCE8EB'}`,
                }}
              >
                ✓ Accept
              </button>
              <button
                onClick={() => setDecision('override')}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: decision === 'override' ? '#E53935' : '#F5F8FA',
                  color: decision === 'override' ? '#FFFFFF' : '#66818C',
                  border: `2px solid ${decision === 'override' ? '#E53935' : '#DCE8EB'}`,
                }}
              >
                ✕ Override
              </button>
            </div>

            <YesNo
              label="Is the MFA recommendation appropriate?"
              value={appropriate}
              onChange={setAppropriate}
            />
            <YesNo
              label="Is the explanation clear?"
              value={explanationClear}
              onChange={setExplanationClear}
            />
            <YesNo
              label="Is the user guidance appropriate?"
              value={guidanceAppropriate}
              onChange={setGuidanceAppropriate}
            />
          </div>

          {/* Feedback categories */}
          <div
            className="rounded-xl p-5"
            style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#102631' }}>Feedback categories</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {FEEDBACK_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: selectedCategories.includes(cat) ? '#073F40' : '#F5F8FA',
                    color: selectedCategories.includes(cat) ? '#35D6AE' : '#66818C',
                    border: `1px solid ${selectedCategories.includes(cat) ? '#0F8B83' : '#DCE8EB'}`,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {decision === 'override' && (
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#E53935' }}>
                  Override reason (required)
                </label>
                <textarea
                  value={overrideReason}
                  onChange={e => setOverrideReason(e.target.value)}
                  placeholder="State the reason for overriding the system recommendation…"
                  rows={3}
                  className="w-full rounded-lg px-3 py-2.5 text-sm resize-none outline-none"
                  style={{
                    background: '#FEF2F2',
                    border: '1.5px solid #FCA5A5',
                    color: '#102631',
                  }}
                />
              </div>
            )}

            <label className="block text-xs font-medium mb-1.5" style={{ color: '#102631' }}>
              Practitioner comments
            </label>
            <textarea
              value={comments}
              onChange={e => setComments(e.target.value)}
              placeholder="Provide any additional notes or justification for your review decision…"
              rows={4}
              className="w-full rounded-lg px-3 py-2.5 text-sm resize-none outline-none"
              style={{
                background: '#F5F8FA',
                border: '1px solid #DCE8EB',
                color: '#102631',
              }}
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => navigate('mfa-recommendation')}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: '#F5F8FA', color: '#66818C', border: '1px solid #DCE8EB' }}
            >
              ← Back
            </button>
            <button
              onClick={() => navigate('evaluation-feedback')}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{ background: '#0F8B83', color: '#FFFFFF' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#0a7570')}
              onMouseLeave={e => (e.currentTarget.style.background = '#0F8B83')}
            >
              Submit Review →
            </button>
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          <div
            className="rounded-xl p-5"
            style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: '#66818C' }}>
              REVIEW STATUS
            </p>
            <div className="space-y-2">
              {[
                { label: 'Decision', done: !!decision },
                { label: 'Appropriateness', done: appropriate !== null },
                { label: 'Clarity', done: explanationClear !== null },
                { label: 'User guidance', done: guidanceAppropriate !== null },
              ].map(({ label, done }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#66818C' }}>{label}</span>
                  <span style={{ color: done ? '#008A62' : '#DCE8EB', fontSize: 16 }}>
                    {done ? '●' : '○'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {decision === 'accept' && (
            <div
              className="rounded-xl p-4"
              style={{ background: '#F0FBF9', border: '1px solid #A7F3D0' }}
            >
              <p className="text-xs font-semibold mb-1" style={{ color: '#008A62' }}>Recommendation accepted</p>
              <p className="text-xs leading-relaxed" style={{ color: '#66818C' }}>
                The recommendation will be finalised and recorded in the evaluation.
              </p>
            </div>
          )}
          {decision === 'override' && (
            <div
              className="rounded-xl p-4"
              style={{ background: '#FEF2F2', border: '1px solid #FCA5A5' }}
            >
              <p className="text-xs font-semibold mb-1" style={{ color: '#E53935' }}>Override selected</p>
              <p className="text-xs leading-relaxed" style={{ color: '#66818C' }}>
                Please provide a comment justifying the override decision.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
