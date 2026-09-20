import { useState } from 'react';
import { Page } from '../types';
import { useAssessment } from '../state/AssessmentContext';
import { MFA_LEVELS, MFA_LABEL, mfaLabelToLevel, type MFALevel } from '../lib/decisionEngine';

interface OrganisationPolicyProps {
  navigate: (page: Page) => void;
}

const MFA_LEVEL_COLOR: Record<MFALevel, string> = {
  standard: '#008A62',
  'step-up': '#E85D04',
  'phishing-resistant': '#E53935',
};

export default function OrganisationPolicy({ navigate }: OrganisationPolicyProps) {
  const { orgPolicy, setOrgPolicy, profile, policyCheck } = useAssessment();
  const { minMFA, sensitiveResourceMFA, privilegedRoleMFA, policyStatus } = orgPolicy;
  const [saved, setSaved] = useState(false);

  const setMinMFA = (v: MFALevel) => setOrgPolicy(p => ({ ...p, minMFA: v }));
  const setSensitiveResourceMFA = (v: MFALevel) => setOrgPolicy(p => ({ ...p, sensitiveResourceMFA: v }));
  const setPrivilegedRoleMFA = (v: MFALevel) => setOrgPolicy(p => ({ ...p, privilegedRoleMFA: v }));
  const setPolicyStatus = (status: 'active' | 'review' | 'draft') => setOrgPolicy(p => ({ ...p, policyStatus: status }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Decision Rule Result comes from the real, currently-applied decision rule
  // (Layer 3: Decision Logic) — see DecisionRules.tsx / MFARecommendation.tsx.
  const decisionRuleResult: MFALevel = mfaLabelToLevel(profile.rule.mfa);
  const { finalLevel: finalRecommendation, guardrailApplied } = policyCheck;

  const SelectField = ({
    label,
    value,
    onChange,
    description,
  }: {
    label: string;
    value: MFALevel;
    onChange: (v: MFALevel) => void;
    description: string;
  }) => (
    <div
      className="rounded-xl p-5"
      style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold mb-1" style={{ color: '#102631' }}>{label}</p>
          <p className="text-xs leading-snug" style={{ color: '#66818C' }}>{description}</p>
        </div>
        <select
          value={value}
          onChange={e => onChange(e.target.value as MFALevel)}
          className="rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            background: '#F5F8FA',
            border: '1px solid #DCE8EB',
            color: '#102631',
            minWidth: 160,
          }}
        >
          {MFA_LEVELS.map(l => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header info */}
      <div
        className="rounded-xl p-5"
        style={{ background: '#073F40', border: '1px solid #073F40', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Organisation Security Policy</h3>
            <p className="text-xs" style={{ color: '#93B5BE' }}>
              Configure the MFA security guardrails that apply across all assessment outcomes.
              The final recommendation cannot be weaker than the configured minimum.
            </p>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: policyStatus === 'active' ? 'rgba(53,214,174,0.2)' : 'rgba(255,255,255,0.1)' }}
          >
            <span style={{ color: policyStatus === 'active' ? '#35D6AE' : '#93B5BE', fontSize: 8 }}>●</span>
            <span className="text-xs font-medium" style={{ color: policyStatus === 'active' ? '#35D6AE' : '#93B5BE' }}>
              Policy {policyStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          {/* Policy Settings */}
          <div
            className="rounded-xl p-5 space-y-4"
            style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <h3 className="text-sm font-semibold" style={{ color: '#102631' }}>MFA Policy Configuration</h3>

            <SelectField
              label="Minimum MFA Requirement"
              value={minMFA}
              onChange={setMinMFA}
              description="The weakest MFA method permitted organisation-wide. The final recommendation cannot fall below this level."
            />

            <SelectField
              label="Sensitive Resource MFA"
              value={sensitiveResourceMFA}
              onChange={setSensitiveResourceMFA}
              description="Required MFA level when accessing classified, restricted, or sensitive banking data and systems."
            />

            <SelectField
              label="Privileged Role MFA"
              value={privilegedRoleMFA}
              onChange={setPrivilegedRoleMFA}
              description="Required MFA level for privileged accounts, administrators, and users with elevated access rights."
            />
          </div>

          {/* Policy Status */}
          <div
            className="rounded-xl p-5"
            style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#102631' }}>Policy Status</h3>
            <div className="flex gap-3">
              {(['active', 'review', 'draft'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setPolicyStatus(status)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all"
                  style={{
                    background: policyStatus === status ? '#0F8B83' : '#F5F8FA',
                    color: policyStatus === status ? '#FFFFFF' : '#66818C',
                    border: `1px solid ${policyStatus === status ? '#0F8B83' : '#DCE8EB'}`,
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{ background: saved ? '#008A62' : '#0F8B83', color: '#FFFFFF' }}
            >
              {saved ? '✓ Policy saved' : 'Save Policy'}
            </button>
          </div>
        </div>

        {/* Side: Guardrail explanation */}
        <div className="space-y-4">
          <div
            className="rounded-xl p-5"
            style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: '#66818C' }}>
              GUARDRAIL LOGIC
            </p>
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs" style={{ color: '#66818C' }}>Decision Rule Result</span>
                <span className="text-sm font-bold" style={{ color: MFA_LEVEL_COLOR[decisionRuleResult] }}>
                  {MFA_LABEL[decisionRuleResult]} <span style={{ color: '#66818C', fontWeight: 500 }}>· Rule {profile.rule.id}</span>
                </span>
              </div>
              <div
                className="flex items-center gap-2 text-xs"
                style={{ color: '#66818C' }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1L11 5V9C11 10.1 8.76 11 6 11C3.24 11 1 10.1 1 9V5L6 1Z" stroke="#66818C" strokeWidth="1"/>
                </svg>
                Organisation Policy Guardrail
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs" style={{ color: '#66818C' }}>Final Recommendation</span>
                <span className="text-sm font-bold" style={{ color: MFA_LEVEL_COLOR[finalRecommendation] }}>
                  {MFA_LABEL[finalRecommendation]}
                </span>
              </div>
            </div>
            {guardrailApplied && (
              <div
                className="mt-3 rounded-lg p-3"
                style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}
              >
                <p className="text-xs font-medium" style={{ color: '#E85D04' }}>
                  Guardrail elevated recommendation
                </p>
                <p className="text-xs mt-1" style={{ color: '#66818C' }}>
                  Policy minimum is higher than the decision rule output.
                </p>
              </div>
            )}
            {!guardrailApplied && (
              <div
                className="mt-3 rounded-lg p-3"
                style={{ background: '#F0FBF9', border: '1px solid #A7F3D0' }}
              >
                <p className="text-xs font-medium" style={{ color: '#0F8B83' }}>
                  Policy requirements satisfied
                </p>
                <p className="text-xs mt-1" style={{ color: '#66818C' }}>
                  Decision rule meets or exceeds the policy minimum.
                </p>
              </div>
            )}
          </div>

          <div
            className="rounded-xl p-4"
            style={{ background: '#F0FBF9', border: '1px solid #A7F3D0' }}
          >
            <p className="text-xs font-semibold mb-2" style={{ color: '#0F8B83' }}>Policy scope</p>
            <p className="text-xs leading-relaxed" style={{ color: '#66818C' }}>
              Organisation Policy acts as a security guardrail. It does not participate in the
              seven-step assessment journey but applies to every final recommendation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
