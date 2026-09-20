import { Page } from '../types';
import AssessmentJourney from '../components/AssessmentJourney';
import { useAssessment } from '../state/AssessmentContext';
import { GUIDANCE_MESSAGES, MFA_LABEL, mfaLabelToLevel } from '../lib/decisionEngine';

interface MFARecommendationProps {
  navigate: (page: Page) => void;
  currentPage: Page;
}

export default function MFARecommendation({ navigate, currentPage }: MFARecommendationProps) {
  const { contextualRisk, readiness, profile, policyCheck } = useAssessment();
  const { rule } = profile;
  const guidance = GUIDANCE_MESSAGES[rule.guidance];
  const finalMfaLabel = MFA_LABEL[policyCheck.finalLevel];

  return (
    <div className="space-y-5">
      <AssessmentJourney currentPage={currentPage} navigate={navigate} />

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">

          {/* Evidence trail */}
          <div
            className="rounded-xl p-5"
            style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <h3 className="text-sm font-semibold mb-4" style={{ color: '#102631' }}>Assessment Evidence</h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Contextual Risk', value: contextualRisk.level, color: contextualRisk.level === 'HIGH' ? '#E53935' : '#008A62', bg: contextualRisk.level === 'HIGH' ? '#FEF2F2' : '#F0FDF4', border: contextualRisk.level === 'HIGH' ? '#FCA5A5' : '#A7F3D0' },
                { label: 'MFA Compliance Readiness', value: readiness.level === 'HIGH READINESS' ? 'HIGH' : 'LOW', color: readiness.level === 'HIGH READINESS' ? '#008A62' : '#1677E8', bg: readiness.level === 'HIGH READINESS' ? '#F0FDF4' : '#EFF6FF', border: readiness.level === 'HIGH READINESS' ? '#A7F3D0' : '#BFDBFE' },
                { label: 'Profile', value: profile.profileLabel, color: '#E85D04', bg: '#FFF7ED', border: '#FED7AA' },
                { label: 'Decision Rule', value: rule.id, color: '#E53935', bg: '#FEF2F2', border: '#FCA5A5' },
              ].map(({ label, value, color, bg, border }) => (
                <div key={label} className="rounded-lg p-3 text-center" style={{ background: bg, border: `1px solid ${border}` }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#66818C' }}>{label}</p>
                  <p className="text-sm font-bold leading-tight" style={{ color }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 1 — MFA Recommendation */}
          <div
            className="rounded-xl p-6"
            style={{ background: '#073F40', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
          >
            <p className="text-xs font-semibold tracking-widest mb-1" style={{ color: '#35D6AE' }}>
              SECTION 1 — MFA RECOMMENDATION
            </p>
            <p className="text-3xl font-bold text-white mb-1">{finalMfaLabel}</p>
            <p className="text-sm" style={{ color: '#93B5BE' }}>Rule {rule.id} applied</p>
          </div>

          {/* SECTION 2 — Organisation Policy Check */}
          <div
            className="rounded-xl p-5"
            style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: '#66818C' }}>
              SECTION 2 — ORGANISATION POLICY CHECK
            </p>
            <div className="flex items-start gap-3">
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{ width: 32, height: 32, background: policyCheck.guardrailApplied ? '#FFF7ED' : '#F0FBF9', border: `1px solid ${policyCheck.guardrailApplied ? '#FED7AA' : '#A7F3D0'}` }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" stroke={policyCheck.guardrailApplied ? '#E85D04' : '#0F8B83'} strokeWidth="1.5"/>
                  <path d="M4 7L6 9L10 5" stroke={policyCheck.guardrailApplied ? '#E85D04' : '#0F8B83'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: policyCheck.guardrailApplied ? '#E85D04' : '#008A62' }}>
                  {policyCheck.guardrailApplied ? '⚠ Guardrail elevated recommendation' : '✓ Policy requirements satisfied'}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: '#66818C' }}>
                  {policyCheck.guardrailApplied
                    ? `The decision rule proposed ${MFA_LABEL[mfaLabelToLevel(rule.mfa)]}, but the organisation's configured minimum MFA requirement is stronger, so the final recommendation was raised to ${finalMfaLabel}.`
                    : `The recommendation has been checked against the organisation's configured minimum MFA requirements. ${finalMfaLabel} meets or exceeds the configured policy minimum.`}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 3 — User Guidance */}
          <div
            className="rounded-xl p-5"
            style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: '#66818C' }}>
              SECTION 3 — USER GUIDANCE
            </p>
            <p className="text-sm font-semibold mb-3" style={{ color: '#102631' }}>
              {rule.guidance}
            </p>
            <div
              className="rounded-lg p-4"
              style={{ background: guidance.bg, border: `1px solid ${guidance.border}` }}
            >
              <p className="text-xs font-semibold mb-1.5" style={{ color: guidance.color }}>
                ▲ User-facing message
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#66818C' }}>
                {guidance.message}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{ background: '#FEF2F2', color: '#E53935', border: '1px solid #FCA5A5' }}
            >
              Reject Request
            </button>
            <div className="flex gap-3">
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: '#F5F8FA', color: '#0F8B83', border: '1px solid #0F8B83' }}
              >
                Continue with MFA
              </button>
              <button
                onClick={() => navigate('practitioner-review')}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{ background: '#0F8B83', color: '#FFFFFF' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#0a7570')}
                onMouseLeave={e => (e.currentTarget.style.background = '#0F8B83')}
              >
                Continue to Practitioner Review →
              </button>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          <div
            className="rounded-xl p-5"
            style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: '#66818C' }}>
              RECOMMENDATION SUMMARY
            </p>
            {[
              { label: 'Rule applied', value: rule.id, color: '#E53935' },
              { label: 'MFA type', value: finalMfaLabel, color: '#008A62' },
              { label: 'Guidance', value: rule.guidance, color: '#E85D04' },
              { label: 'Policy check', value: policyCheck.guardrailApplied ? '⚠ Elevated' : '✓ Passed', color: policyCheck.guardrailApplied ? '#E85D04' : '#008A62' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #F0F4F6' }}>
                <span className="text-xs" style={{ color: '#66818C' }}>{label}</span>
                <span className="text-xs font-semibold" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>

          <div
            className="rounded-xl p-4"
            style={{ background: '#F0FBF9', border: '1px solid #A7F3D0' }}
          >
            <p className="text-xs font-semibold mb-2" style={{ color: '#0F8B83' }}>Next step</p>
            <p className="text-xs leading-relaxed" style={{ color: '#66818C' }}>
              A security practitioner must review and validate this recommendation before it is
              finalised. Proceed to Practitioner Review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
