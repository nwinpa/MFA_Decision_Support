import { Page } from '../types';
import AssessmentJourney from '../components/AssessmentJourney';
import { useAssessment } from '../state/AssessmentContext';
import { QUADRANT_INFO, quadrantPosition, type ProfileLabel } from '../lib/decisionEngine';

interface RiskComplianceProfileProps {
  navigate: (page: Page) => void;
  currentPage: Page;
}

export default function RiskComplianceProfile({ navigate, currentPage }: RiskComplianceProfileProps) {
  const { contextualRisk, readiness, profile } = useAssessment();
  const { profileLabel } = profile;
  const info = QUADRANT_INFO[profileLabel];
  const position = quadrantPosition(profileLabel);

  const cell = (
    label: ProfileLabel,
    text: string,
    isActive: boolean,
    labelColor: string,
    bg: string,
  ) => (
    <div
      className="p-4"
      style={{
        background: bg,
        border: isActive ? '2px solid #E53935' : '1px solid transparent',
        minHeight: 100,
      }}
    >
      {isActive && (
        <div
          className="inline-flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded mb-1.5"
          style={{ background: '#FEE2E2', color: '#E53935', fontSize: 10 }}
        >
          ● CURRENT PROFILE
        </div>
      )}
      <p className="text-xs font-bold mb-1 leading-snug" style={{ color: labelColor }}>{label}</p>
      <p className="text-xs leading-snug" style={{ color: '#66818C' }}>{text}</p>
    </div>
  );

  return (
    <div className="space-y-5">
      <AssessmentJourney currentPage={currentPage} navigate={navigate} />

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          {/* Matrix card */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            {/* Card header */}
            <div className="px-5 pt-5 pb-3">
              <h3 className="text-sm font-semibold mb-1" style={{ color: '#102631' }}>Risk–Compliance Profile</h3>
              <p className="text-xs" style={{ color: '#66818C' }}>
                The 2 × 2 matrix maps contextual risk against compliance readiness to determine the appropriate profile.
              </p>
            </div>

            {/* Matrix */}
            <div className="px-5 pb-5">
              {/* Horizontal axis label */}
              <div className="flex" style={{ marginLeft: 72 }}>
                <div
                  className="flex-1 text-center py-1.5 text-xs font-semibold tracking-widest"
                  style={{ color: '#66818C', borderBottom: '1px solid #DCE8EB' }}
                >
                  COMPLIANCE READINESS →
                </div>
              </div>

              {/* Vertical axis + grid */}
              <div className="flex">
                {/* Vertical axis label */}
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{ width: 72 }}
                >
                  <span
                    className="text-xs font-semibold tracking-widest"
                    style={{
                      color: '#66818C',
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    CONTEXTUAL RISK ↑
                  </span>
                </div>

                {/* Right side: unified 3-column grid for correct border alignment */}
                <div
                  className="flex-1"
                  style={{ display: 'grid', gridTemplateColumns: '52px 1fr 1fr' }}
                >
                  {/* Header row */}
                  <div style={{ borderBottom: '1px solid #DCE8EB', background: '#F5F8FA' }} />
                  <div
                    className="py-2 text-center text-xs font-semibold"
                    style={{ color: '#66818C', borderBottom: '1px solid #DCE8EB', borderLeft: '1px solid #DCE8EB', borderRight: '1px solid #DCE8EB' }}
                  >
                    Low Readiness
                  </div>
                  <div
                    className="py-2 text-center text-xs font-semibold"
                    style={{ color: '#66818C', borderBottom: '1px solid #DCE8EB' }}
                  >
                    High Readiness
                  </div>

                  {/* High Risk row label */}
                  <div
                    className="flex items-center justify-center"
                    style={{ borderBottom: '1px solid #DCE8EB', borderRight: '1px solid #DCE8EB', background: '#F5F8FA' }}
                  >
                    <span
                      className="text-xs font-semibold"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: '#66818C', whiteSpace: 'nowrap' }}
                    >
                      High Risk
                    </span>
                  </div>
                  {/* Top-left quadrant */}
                  <div style={{ borderBottom: '1px solid #DCE8EB', borderLeft: '1px solid #DCE8EB', borderRight: '1px solid #DCE8EB' }}>
                    {cell(
                      'HIGH RISK / LOW READINESS',
                      QUADRANT_INFO['HIGH RISK / LOW READINESS'].text,
                      position === 'Top-Left',
                      QUADRANT_INFO['HIGH RISK / LOW READINESS'].color,
                      QUADRANT_INFO['HIGH RISK / LOW READINESS'].bg
                    )}
                  </div>
                  {/* Top-right quadrant */}
                  <div style={{ borderBottom: '1px solid #DCE8EB' }}>
                    {cell(
                      'HIGH RISK / HIGH READINESS',
                      QUADRANT_INFO['HIGH RISK / HIGH READINESS'].text,
                      position === 'Top-Right',
                      QUADRANT_INFO['HIGH RISK / HIGH READINESS'].color,
                      QUADRANT_INFO['HIGH RISK / HIGH READINESS'].bg
                    )}
                  </div>

                  {/* Low Risk row label */}
                  <div
                    className="flex items-center justify-center"
                    style={{ borderRight: '1px solid #DCE8EB', background: '#F5F8FA' }}
                  >
                    <span
                      className="text-xs font-semibold"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: '#66818C', whiteSpace: 'nowrap' }}
                    >
                      Low Risk
                    </span>
                  </div>
                  {/* Bottom-left quadrant */}
                  <div style={{ borderLeft: '1px solid #DCE8EB', borderRight: '1px solid #DCE8EB' }}>
                    {cell(
                      'LOW RISK / LOW READINESS',
                      QUADRANT_INFO['LOW RISK / LOW READINESS'].text,
                      position === 'Bottom-Left',
                      QUADRANT_INFO['LOW RISK / LOW READINESS'].color,
                      QUADRANT_INFO['LOW RISK / LOW READINESS'].bg
                    )}
                  </div>
                  {/* Bottom-right quadrant */}
                  <div>
                    {cell(
                      'LOW RISK / HIGH READINESS',
                      QUADRANT_INFO['LOW RISK / HIGH READINESS'].text,
                      position === 'Bottom-Right',
                      QUADRANT_INFO['LOW RISK / HIGH READINESS'].color,
                      QUADRANT_INFO['LOW RISK / HIGH READINESS'].bg
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interpretation */}
          <div
            className="rounded-xl p-5"
            style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <p className="text-xs font-semibold tracking-widest mb-2" style={{ color: '#66818C' }}>
              CURRENT PROFILE INTERPRETATION
            </p>
            <p className="text-sm font-bold mb-2" style={{ color: info.color }}>
              {profileLabel}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#66818C' }}>
              {info.text}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => navigate('compliance-readiness')}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: '#F5F8FA', color: '#66818C', border: '1px solid #DCE8EB' }}
            >
              ← Back
            </button>
            <button
              onClick={() => navigate('decision-rules')}
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: '#0F8B83', color: '#FFFFFF' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#0a7570')}
              onMouseLeave={e => (e.currentTarget.style.background = '#0F8B83')}
            >
              Continue to Decision Rules →
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
              PROFILE SUMMARY
            </p>

            {/* Dual ring charts */}
            <div className="flex justify-around mb-4">
              {/* Contextual Risk ring */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative" style={{ width: 80, height: 80 }}>
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="#FEE2E2" strokeWidth="9" />
                    <circle
                      cx="40" cy="40" r="32"
                      fill="none"
                      stroke={contextualRisk.level === 'HIGH' ? '#E53935' : '#008A62'}
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray={`${(contextualRisk.score / 100) * 2 * Math.PI * 32} ${2 * Math.PI * 32}`}
                      transform="rotate(-90 40 40)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold leading-none" style={{ color: contextualRisk.level === 'HIGH' ? '#E53935' : '#008A62' }}>
                      {contextualRisk.score}%
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold" style={{ color: '#102631' }}>Contextual Risk</p>
                  <span
                    className="inline-block mt-0.5 px-2 py-0.5 rounded text-xs font-bold"
                    style={{
                      background: contextualRisk.level === 'HIGH' ? '#FEE2E2' : '#DCFCE7',
                      color: contextualRisk.level === 'HIGH' ? '#E53935' : '#008A62',
                      fontSize: 10,
                    }}
                  >
                    {contextualRisk.level}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center">
                <span className="text-lg font-light" style={{ color: '#DCE8EB' }}>+</span>
              </div>

              {/* Compliance Readiness ring */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative" style={{ width: 80, height: 80 }}>
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="#DBEAFE" strokeWidth="9" />
                    <circle
                      cx="40" cy="40" r="32"
                      fill="none"
                      stroke={readiness.level === 'HIGH READINESS' ? '#008A62' : '#1677E8'}
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray={`${(readiness.pct / 100) * 2 * Math.PI * 32} ${2 * Math.PI * 32}`}
                      transform="rotate(-90 40 40)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold leading-none" style={{ color: readiness.level === 'HIGH READINESS' ? '#008A62' : '#1677E8' }}>
                      {readiness.pct}%
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold" style={{ color: '#102631' }}>MFA Readiness</p>
                  <span
                    className="inline-block mt-0.5 px-2 py-0.5 rounded text-xs font-bold"
                    style={{
                      background: readiness.level === 'HIGH READINESS' ? '#DCFCE7' : '#DBEAFE',
                      color: readiness.level === 'HIGH READINESS' ? '#008A62' : '#1677E8',
                      fontSize: 10,
                    }}
                  >
                    {readiness.level === 'HIGH READINESS' ? 'HIGH' : 'LOW'}
                  </span>
                </div>
              </div>
            </div>

            {/* Combined profile badge */}
            <div
              className="rounded-lg p-3 flex items-center gap-2"
              style={{ background: info.bg, border: `1px solid ${info.border}` }}
            >
              <div
                className="flex-shrink-0 rounded-full flex items-center justify-center"
                style={{ width: 28, height: 28, background: info.color }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 2v4l2.5 2" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                  <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="1.2"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold leading-snug" style={{ color: info.color }}>{profileLabel}</p>
                <p className="text-xs mt-0.5" style={{ color: '#66818C' }}>Quadrant: {position} · Rule {profile.rule.id}</p>
              </div>
            </div>
          </div>

          <div
            className="rounded-xl p-5"
            style={{ background: '#F0FBF9', border: '1px solid #A7F3D0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <p className="text-xs font-semibold mb-2" style={{ color: '#0F8B83' }}>Next step</p>
            <p className="text-xs leading-snug" style={{ color: '#66818C' }}>
              Decision Rule {profile.rule.id} will be applied based on this profile. Proceed to review the rule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
