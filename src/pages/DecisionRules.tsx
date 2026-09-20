import { Page } from '../types';
import AssessmentJourney from '../components/AssessmentJourney';
import { useAssessment } from '../state/AssessmentContext';
import { RULES } from '../lib/decisionEngine';

interface DecisionRulesProps {
  navigate: (page: Page) => void;
  currentPage: Page;
}

function RiskPill({ value }: { value: 'High' | 'Low' }) {
  const isHigh = value === 'High';
  return (
    <span
      className="inline-block px-3 py-1 rounded-lg text-xs font-semibold"
      style={{
        background: isHigh ? '#FEE2E2' : '#DCFCE7',
        color: isHigh ? '#E53935' : '#16A34A',
      }}
    >
      {value}
    </span>
  );
}

function formatProfile(profile: string): string {
  return profile
    .toLowerCase()
    .split(' / ')
    .map(part => part.replace(/\b\w/g, c => c.toUpperCase()))
    .join(' / ');
}

export default function DecisionRules({ navigate, currentPage }: DecisionRulesProps) {
  const { contextualRisk, readiness, profile } = useAssessment();
  const appliedRuleId = profile.rule.id;

  return (
    <div className="space-y-5">
      <AssessmentJourney currentPage={currentPage} navigate={navigate} />

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <div className="px-5 pt-5 pb-3">
              <h3 className="text-sm font-semibold mb-1" style={{ color: '#102631' }}>Decision Rules</h3>
              <p className="text-xs" style={{ color: '#66818C' }}>
                The four decision rules map the risk–compliance profile to the appropriate MFA control and user guidance.
              </p>
            </div>

            {/* Table */}
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F5F8FA', borderTop: '1px solid #DCE8EB', borderBottom: '1px solid #DCE8EB' }}>
                  {['RULE', 'RISK–COMPLIANCE PROFILE', 'CONTEXTUAL RISK', 'COMPLIANCE READINESS', 'MFA RECOMMENDATION', 'USER GUIDANCE'].map(h => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold"
                      style={{ color: '#66818C', whiteSpace: 'normal', verticalAlign: 'top' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RULES.map((rule, i) => {
                  const applied = rule.id === appliedRuleId;
                  return (
                  <tr
                    key={rule.id}
                    style={{
                      background: applied ? '#F0F4FF' : '#FFFFFF',
                      borderTop: i > 0 ? '1px solid #DCE8EB' : undefined,
                      borderLeft: applied ? '3px solid #3B5BDB' : '3px solid transparent',
                    }}
                  >
                    <td className="px-4 py-4">
                      <div>
                        <p
                          className="text-sm font-bold"
                          style={{ color: applied ? '#3B5BDB' : '#66818C' }}
                        >
                          {rule.id}
                        </p>
                        {applied && (
                          <p className="text-xs font-semibold" style={{ color: '#3B5BDB' }}>Applied</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm" style={{ color: '#102631' }}>
                      {formatProfile(rule.profile)}
                    </td>
                    <td className="px-4 py-4">
                      <RiskPill value={rule.contextualRisk as 'High' | 'Low'} />
                    </td>
                    <td className="px-4 py-4">
                      <RiskPill value={rule.complianceReadiness as 'High' | 'Low'} />
                    </td>
                    <td className="px-4 py-4 text-sm font-medium" style={{ color: '#102631' }}>
                      {rule.mfa}
                    </td>
                    <td className="px-4 py-4 text-sm" style={{ color: '#66818C' }}>
                      {rule.guidance}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => navigate('risk-compliance-profile')}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: '#F5F8FA', color: '#66818C', border: '1px solid #DCE8EB' }}
            >
              ← Back
            </button>
            <button
              onClick={() => navigate('mfa-recommendation')}
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: '#0F8B83', color: '#FFFFFF' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#0a7570')}
              onMouseLeave={e => (e.currentTarget.style.background = '#0F8B83')}
            >
              Continue to Recommendation →
            </button>
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          <div
            className="rounded-xl p-5"
            style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <p className="text-xs font-semibold tracking-widest mb-4" style={{ color: '#66818C' }}>
              RULE LOGIC
            </p>

            {/* Flow diagram */}
            <div className="flex flex-col items-center gap-0">

              {/* Input row */}
              <div className="flex gap-2 w-full">
                {/* Risk input */}
                <div
                  className="flex-1 rounded-lg p-3 text-center"
                  style={{ background: '#FEF2F2', border: '1px solid #FCA5A5' }}
                >
                  <p className="text-xs mb-1" style={{ color: '#66818C' }}>Risk input</p>
                  <div className="relative inline-flex items-center justify-center mb-1" style={{ width: 52, height: 52 }}>
                    <svg width="52" height="52" viewBox="0 0 52 52">
                      <circle cx="26" cy="26" r="20" fill="none" stroke="#FEE2E2" strokeWidth="6"/>
                      <circle cx="26" cy="26" r="20" fill="none" stroke="#E53935" strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${(contextualRisk.score / 100) * 2 * Math.PI * 20} ${2 * Math.PI * 20}`}
                        transform="rotate(-90 26 26)"
                      />
                    </svg>
                    <span className="absolute text-xs font-bold" style={{ color: '#E53935' }}>{contextualRisk.score}%</span>
                  </div>
                  <p className="text-xs font-bold" style={{ color: '#E53935' }}>{contextualRisk.level}</p>
                </div>

                {/* Readiness input */}
                <div
                  className="flex-1 rounded-lg p-3 text-center"
                  style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}
                >
                  <p className="text-xs mb-1" style={{ color: '#66818C' }}>Readiness</p>
                  <div className="relative inline-flex items-center justify-center mb-1" style={{ width: 52, height: 52 }}>
                    <svg width="52" height="52" viewBox="0 0 52 52">
                      <circle cx="26" cy="26" r="20" fill="none" stroke="#DBEAFE" strokeWidth="6"/>
                      <circle cx="26" cy="26" r="20" fill="none" stroke="#1677E8" strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${(readiness.pct / 100) * 2 * Math.PI * 20} ${2 * Math.PI * 20}`}
                        transform="rotate(-90 26 26)"
                      />
                    </svg>
                    <span className="absolute text-xs font-bold" style={{ color: '#1677E8' }}>{readiness.pct}%</span>
                  </div>
                  <p className="text-xs font-bold" style={{ color: '#1677E8' }}>{readiness.level === 'HIGH READINESS' ? 'HIGH' : 'LOW'}</p>
                </div>
              </div>

              {/* Arrow down */}
              <div className="flex flex-col items-center py-1">
                <div style={{ width: 2, height: 10, background: '#DCE8EB' }} />
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M0 0L5 6L10 0" fill="#DCE8EB"/>
                </svg>
              </div>

              {/* Rule matched */}
              <div
                className="w-full rounded-lg px-4 py-3 flex items-center justify-between"
                style={{ background: '#F5F8FA', border: '1px solid #DCE8EB' }}
              >
                <div>
                  <p className="text-xs mb-0.5" style={{ color: '#66818C' }}>Rule matched</p>
                  <p className="text-lg font-bold" style={{ color: '#102631' }}>{appliedRuleId}</p>
                </div>
                <div
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold"
                  style={{ background: '#E53935', color: '#FFFFFF' }}
                >
                  APPLIED
                </div>
              </div>

              {/* Arrow down */}
              <div className="flex flex-col items-center py-1">
                <div style={{ width: 2, height: 10, background: '#DCE8EB' }} />
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M0 0L5 6L10 0" fill="#DCE8EB"/>
                </svg>
              </div>

              {/* MFA output */}
              <div
                className="w-full rounded-lg px-4 py-3"
                style={{ background: '#F0FBF9', border: '1px solid #A7F3D0' }}
              >
                <p className="text-xs mb-1" style={{ color: '#66818C' }}>MFA output</p>
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center justify-center rounded-full flex-shrink-0"
                    style={{ width: 28, height: 28, background: '#0F8B83' }}
                  >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M3 7L5.5 9.5L10 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-sm font-bold" style={{ color: '#008A62' }}>{profile.rule.mfa}</p>
                </div>
              </div>

            </div>
          </div>

          <div
            className="rounded-xl p-4"
            style={{ background: '#F0FBF9', border: '1px solid #A7F3D0' }}
          >
            <p className="text-xs font-semibold mb-1.5" style={{ color: '#0F8B83' }}>How rules work</p>
            <p className="text-xs leading-relaxed" style={{ color: '#66818C' }}>
              Rules map directly from the 2×2 risk–compliance profile. Each rule prescribes a
              specific MFA strength and accompanying guidance type. Only one rule applies per
              assessment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
