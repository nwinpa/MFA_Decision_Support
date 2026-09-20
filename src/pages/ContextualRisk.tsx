import { Page } from '../types';
import AssessmentJourney from '../components/AssessmentJourney';
import { useAssessment } from '../state/AssessmentContext';
import { RISK_FIELDS, getRiskForValue } from '../lib/decisionEngine';

interface ContextualRiskProps {
  navigate: (page: Page) => void;
  currentPage: Page;
}

export default function ContextualRisk({ navigate, currentPage }: ContextualRiskProps) {
  const { contextualAnswers: answers, setContextualAnswers: setAnswers, contextualRisk } = useAssessment();
  const { score: riskScore, level: riskLevel, highRiskFields } = contextualRisk;
  const riskColor = riskLevel === 'HIGH' ? '#E53935' : '#008A62';

  return (
    <div className="space-y-5">
      <AssessmentJourney currentPage={currentPage} navigate={navigate} />

      <div className="grid grid-cols-3 gap-5">
        {/* Form */}
        <div
          className="col-span-2 rounded-xl p-5"
          style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <h3 className="text-sm font-semibold mb-1" style={{ color: '#102631' }}>
            Contextual Risk Assessment
          </h3>
          <p className="text-xs mb-4" style={{ color: '#66818C' }}>
            Select the conditions that best describe the current access request.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {RISK_FIELDS.map(({ id, label, options }) => {
              const selectedRisk = getRiskForValue(id, answers[id]);
              const isHigh = selectedRisk === 'High Risk';
              return (
                <div key={id}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#102631' }}>
                    {label}
                  </label>
                  <select
                    value={answers[id] || ''}
                    onChange={e => setAnswers(prev => ({ ...prev, [id]: e.target.value }))}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-all"
                    style={{
                      background: '#F5F8FA',
                      border: `1px solid ${isHigh ? 'rgba(229,57,53,0.3)' : '#DCE8EB'}`,
                      color: '#102631',
                    }}
                  >
                    {options.map(o => (
                      <option key={o.value} value={o.value}>
                        {o.value}
                      </option>
                    ))}
                  </select>
                  {/* Colored risk badge */}
                  {selectedRisk && (
                    <div className="mt-1 flex items-center gap-1">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: isHigh ? '#E53935' : '#0F8B83' }}
                      >
                        {isHigh ? '▲' : '●'} {selectedRisk}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* System-detected banner */}
          <div
            className="mt-5 rounded-xl px-4 py-3 flex items-start gap-3"
            style={{ background: '#F0FBF9', border: '1px solid #A7F3D0' }}
          >
            <div className="flex-shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5L13.5 4V9C13.5 12 11 14 8 15C5 14 2.5 12 2.5 9V4L8 1.5Z"
                  fill="#0F8B83" opacity="0.9"/>
                <path d="M5.5 8L7 9.5L10.5 6" stroke="white" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold mb-0.5" style={{ color: '#073F40' }}>
                SYSTEM-DETECTED — IT ADMIN VERIFIES / OVERRIDES
              </p>
              <p className="text-xs leading-snug" style={{ color: '#66818C' }}>
                Risk signals are detected by the system. An authorised administrator can verify
                or override them when required.
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-5 pt-4" style={{ borderTop: '1px solid #DCE8EB' }}>
            <button
              onClick={() => navigate('dashboard')}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: '#F5F8FA', color: '#66818C', border: '1px solid #DCE8EB' }}
            >
              ← Back to Dashboard
            </button>
            <div className="flex gap-3">
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ background: '#F5F8FA', color: '#66818C', border: '1px solid #DCE8EB' }}
              >
                Save
              </button>
              <button
                onClick={() => navigate('compliance-readiness')}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{ background: '#0F8B83', color: '#FFFFFF' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#0a7570')}
                onMouseLeave={e => (e.currentTarget.style.background = '#0F8B83')}
              >
                Continue to Compliance →
              </button>
            </div>
          </div>
        </div>

        {/* Risk Score Summary */}
        <div className="space-y-4">
          <div
            className="rounded-xl p-5"
            style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: '#66818C' }}>
              RISK SCORE
            </p>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold" style={{ color: riskColor }}>{riskScore}</span>
              <span className="text-sm mb-1" style={{ color: '#66818C' }}>/100</span>
            </div>
            <p className="text-base font-bold mb-3" style={{ color: riskColor }}>{riskLevel}</p>
            <div className="rounded-full overflow-hidden mb-1" style={{ height: 8, background: '#F0F4F6' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${riskScore}%`, background: riskColor }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-xs" style={{ color: '#008A62' }}>Low</span>
              <span className="text-xs" style={{ color: '#E53935' }}>High</span>
            </div>
          </div>

          {/* Key risk signals */}
          <div
            className="rounded-xl p-4"
            style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <p className="text-xs font-semibold mb-2" style={{ color: '#102631' }}>Key risk signals</p>
            {highRiskFields.length === 0 ? (
              <p className="text-xs" style={{ color: '#008A62' }}>No high-risk signals detected.</p>
            ) : (
              <ul className="space-y-1.5">
                {highRiskFields.map(f => (
                  <li key={f.id} className="text-xs flex items-start gap-1.5">
                    <span style={{ color: '#E53935' }}>▲</span>
                    <span style={{ color: '#66818C' }}>
                      <span style={{ color: '#102631' }}>{f.label}:</span>{' '}
                      {answers[f.id]}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {riskLevel === 'HIGH' && (
            <div
              className="rounded-xl p-4"
              style={{ background: '#FEF2F2', border: '1px solid #FCA5A5' }}
            >
              <p className="text-xs font-semibold mb-1" style={{ color: '#E53935' }}>
                High-risk profile detected
              </p>
              <p className="text-xs leading-snug" style={{ color: '#66818C' }}>
                Phishing-resistant MFA will be recommended based on current signals.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
