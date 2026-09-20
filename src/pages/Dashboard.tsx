import { Page } from '../types';
import AssessmentJourney from '../components/AssessmentJourney';
import { useAssessment } from '../state/AssessmentContext';
import { MFA_LABEL } from '../lib/decisionEngine';

interface DashboardProps {
  navigate: (page: Page) => void;
  currentPage: Page;
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 6, background: '#F0F4F6' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="text-xs font-semibold w-8 text-right" style={{ color: '#102631' }}>
        {value}%
      </span>
    </div>
  );
}

export default function Dashboard({ navigate, currentPage }: DashboardProps) {
  const { contextualRisk, readiness, profile, policyCheck } = useAssessment();
  const readinessDisplay = readiness.level === 'HIGH READINESS' ? 'HIGH' : 'LOW';
  const finalMfaLabel = MFA_LABEL[policyCheck.finalLevel];

  return (
    <div className="space-y-5">
      {/* Hero Card */}
      <div
        className="rounded-[18px] px-7 py-6 flex items-center justify-between overflow-hidden relative"
        style={{ background: '#073437' }}
      >
        {/* Left: copy block */}
        <div className="flex flex-col gap-2 relative z-10">
          {/* Tag pill */}
          <div
            className="self-start px-2.5 py-1.5 rounded-full"
            style={{ background: '#144f4f' }}
          >
            <span
              className="text-[9px] leading-none font-bold whitespace-nowrap"
              style={{ fontFamily: "'Manrope:Bold', Manrope, sans-serif", color: '#8af2d1' }}
            >
              BANKING SECURITY • ZERO TRUST
            </span>
          </div>

          {/* Heading */}
          <div
            className="text-[27px] font-bold leading-snug"
            style={{ fontFamily: "'Manrope:Bold', Manrope, sans-serif", color: '#f5fffc' }}
          >
            <p className="m-0">Make every MFA decision</p>
            <p className="m-0">explainable and risk-aware.</p>
          </div>

          {/* Subtitle */}
          <p
            className="text-[11px] leading-normal max-w-[610px]"
            style={{ fontFamily: "'Manrope:Regular', Manrope, sans-serif", color: '#b8dbd9' }}
          >
            Translate contextual risk, user readiness and policy requirements into a clear,
            reviewable MFA recommendation.
          </p>

          {/* CTA */}
          <button
            onClick={() => navigate('contextual-risk')}
            className="self-start px-4 py-2.5 rounded-[9px] text-[10px] font-bold transition-opacity hover:opacity-90"
            style={{
              fontFamily: "'Manrope:Bold', Manrope, sans-serif",
              background: '#4adbb2',
              color: '#052629',
            }}
          >
            {'Start assessment  →'}
          </button>
        </div>

        {/* Right: illustration */}
        <div className="flex-shrink-0 hidden md:block" style={{ width: 330, height: 182 }}>
          <img
            alt="Zero Trust banking MFA illustration"
            src="/assets/68df9.svg"
            style={{ width: 330, height: 182, objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4">
        {/* Card 1: Current Risk */}
        <div
          className="rounded-xl p-4"
          style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <p className="text-xs font-semibold tracking-widest mb-2" style={{ color: '#66818C' }}>
            CURRENT RISK
          </p>
          <p className="text-xl font-bold mb-1" style={{ color: contextualRisk.level === 'HIGH' ? '#E53935' : '#008A62' }}>
            {contextualRisk.level}
          </p>
          <p className="text-xs leading-snug" style={{ color: '#66818C' }}>
            {contextualRisk.level === 'HIGH' ? 'Context signals indicate elevated risk' : 'Context signals are within expected bounds'}
          </p>
        </div>

        {/* Card 2: Compliance Readiness */}
        <div
          className="rounded-xl p-4"
          style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <p className="text-xs font-semibold tracking-widest mb-2" style={{ color: '#66818C' }}>
            COMPLIANCE READINESS
          </p>
          <p className="text-xl font-bold mb-1" style={{ color: readiness.level === 'HIGH READINESS' ? '#008A62' : '#1677E8' }}>
            {readinessDisplay}
          </p>
          <p className="text-xs leading-snug" style={{ color: '#66818C' }}>
            {readiness.level === 'HIGH READINESS' ? 'MFA controls and policy are well established' : 'PMT and policy gaps identified'}
          </p>
        </div>

        {/* Card 3: Risk–Compliance Profile */}
        <div
          className="rounded-xl p-4"
          style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <p className="text-xs font-semibold tracking-widest mb-2" style={{ color: '#66818C' }}>
            RISK–COMPLIANCE PROFILE
          </p>
          <p className="text-sm font-bold mb-1 leading-tight" style={{ color: '#E85D04' }}>
            {profile.profileLabel}
          </p>
          <p className="text-xs leading-snug" style={{ color: '#66818C' }}>
            {profile.rule.guidance}
          </p>
        </div>

        {/* Card 4: MFA Recommendation */}
        <div
          className="rounded-xl p-4"
          style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <p className="text-xs font-semibold tracking-widest mb-2" style={{ color: '#66818C' }}>
            MFA RECOMMENDATION
          </p>
          <p className="text-sm font-bold mb-1 leading-tight" style={{ color: '#008A62' }}>
            {finalMfaLabel.toUpperCase()}
          </p>
          <p className="text-xs leading-snug" style={{ color: '#66818C' }}>
            Rule {profile.rule.id} · practitioner review
          </p>
        </div>
      </div>

      {/* Assessment Journey */}
      <AssessmentJourney currentPage={currentPage} navigate={navigate} />

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left: Why phishing-resistant MFA */}
        <div
          className="rounded-xl p-5"
          style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <h3 className="text-sm font-semibold mb-1" style={{ color: '#102631' }}>
            Why {finalMfaLabel.charAt(0).toLowerCase() + finalMfaLabel.slice(1)} is recommended
          </h3>
          <p className="text-xs mb-4" style={{ color: '#66818C' }}>
            Evidence contributing to the current decision.
          </p>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs font-medium" style={{ color: '#102631' }}>Contextual risk</span>
              </div>
              <ProgressBar value={contextualRisk.score} color={contextualRisk.level === 'HIGH' ? '#E85D04' : '#008A62'} />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs font-medium" style={{ color: '#102631' }}>Compliance readiness</span>
              </div>
              <ProgressBar value={readiness.pct} color={readiness.level === 'HIGH READINESS' ? '#008A62' : '#E53935'} />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs font-medium" style={{ color: '#102631' }}>Policy alignment</span>
              </div>
              <ProgressBar value={policyCheck.guardrailApplied ? 55 : 82} color="#008A62" />
            </div>
          </div>
        </div>

        {/* Right: Next Best Action */}
        <div
          className="rounded-xl p-5"
          style={{
            background: '#FEFCE8',
            border: '1px solid #FDE68A',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest mb-3 px-2 py-0.5 rounded"
            style={{ background: '#FEF08A', color: '#92400E' }}
          >
            NEXT BEST ACTION
          </div>
          <h3 className="text-sm font-semibold mb-2 leading-snug" style={{ color: '#102631' }}>
            Complete contextual risk assessment
          </h3>
          <p className="text-xs leading-relaxed mb-4" style={{ color: '#66818C' }}>
            Complete the contextual risk assessment before continuing to the 16 readiness questions.
          </p>
          <button
            onClick={() => navigate('contextual-risk')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
            style={{ background: '#0F8B83', color: '#FFFFFF' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#0a7570')}
            onMouseLeave={e => (e.currentTarget.style.background = '#0F8B83')}
          >
            Continue to context →
          </button>
        </div>
      </div>
    </div>
  );
}
