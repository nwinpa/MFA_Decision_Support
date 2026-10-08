<<<<<<< HEAD
// Shared decision-support logic for the TrustGuard MFA prototype.
=======
// Shared decision-support logic for the Zero Trust MFA Decision Support System MFA prototype.
>>>>>>> ad84745 (Update ZT-MFA DSS prototype)
//
// This module is the single source of truth for the scoring and decision
// logic that implements Layer 3 (Decision Logic) of the conceptual
// framework: it classifies Layer 1 (Contextual Factors) and Layer 2
// (Behavioural Assessment) inputs into binary Low/High classifications,
// combines them into the 2x2 risk-compliance profile (Table 3 of the
// thesis), and applies the Organisation Policy guardrail before producing
// a final MFA recommendation. Every page imports from here instead of
// keeping its own copy of the constants/logic.

// ---------------------------------------------------------------------------
// Layer 1: Contextual Risk
// ---------------------------------------------------------------------------

export type RiskLabel = 'Low Risk' | 'High Risk';
export type BinaryLevel = 'HIGH' | 'LOW';

export interface FieldOption {
  value: string;
  risk: RiskLabel;
}

export interface RiskField {
  id: string;
  label: string;
  options: FieldOption[];
}

export const RISK_FIELDS: RiskField[] = [
  {
    id: 'role',
    label: 'User Role',
    options: [
      { value: 'Customer', risk: 'Low Risk' },
      { value: 'Branch Staff', risk: 'Low Risk' },
      { value: 'Manager', risk: 'Low Risk' },
      { value: 'System Administrator', risk: 'High Risk' },
      { value: 'Privileged User', risk: 'High Risk' },
    ],
  },
  {
    id: 'network',
    label: 'Network Context',
    options: [
      { value: 'Corporate Network', risk: 'Low Risk' },
      { value: 'Approved VPN', risk: 'Low Risk' },
      { value: 'Home Network', risk: 'Low Risk' },
      { value: 'Public Wi-Fi', risk: 'High Risk' },
      { value: 'Unknown Network', risk: 'High Risk' },
    ],
  },
  {
    id: 'location',
    label: 'Location Context',
    options: [
      { value: 'Known Location', risk: 'Low Risk' },
      { value: 'Registered Device Location', risk: 'Low Risk' },
      { value: 'Unusual Location', risk: 'High Risk' },
      { value: 'High-Risk Country', risk: 'High Risk' },
      { value: 'Unknown', risk: 'High Risk' },
    ],
  },
  {
    id: 'device',
    label: 'Device Type',
    options: [
      { value: 'Managed Corporate Device', risk: 'Low Risk' },
      { value: 'Approved Personal Device', risk: 'Low Risk' },
      { value: 'Unregistered Device', risk: 'High Risk' },
      { value: 'Unknown Device', risk: 'High Risk' },
    ],
  },
  {
    id: 'sensitivity',
    label: 'Resource Sensitivity',
    options: [
      { value: 'Public', risk: 'Low Risk' },
      { value: 'Internal', risk: 'Low Risk' },
      { value: 'Confidential', risk: 'High Risk' },
      { value: 'Restricted', risk: 'High Risk' },
      { value: 'Top Secret', risk: 'High Risk' },
    ],
  },
  {
    id: 'login',
    label: 'Login Behaviour',
    options: [
      { value: 'Expected login pattern', risk: 'Low Risk' },
      { value: 'Slight deviation from baseline', risk: 'Low Risk' },
      { value: 'Unfamiliar sign-in location', risk: 'High Risk' },
      { value: 'Multiple failed attempts before success', risk: 'High Risk' },
      { value: 'Anomalous / suspicious pattern', risk: 'High Risk' },
    ],
  },
];

export const RISK_SCORES: Record<string, Record<string, number>> = {
  role: { Customer: 1, 'Branch Staff': 2, Manager: 3, 'System Administrator': 4, 'Privileged User': 5 },
  network: { 'Corporate Network': 1, 'Approved VPN': 2, 'Home Network': 3, 'Public Wi-Fi': 4, 'Unknown Network': 5 },
  location: { 'Known Location': 1, 'Registered Device Location': 2, 'Unusual Location': 3, 'High-Risk Country': 4, 'Unknown': 5 },
  device: { 'Managed Corporate Device': 1, 'Approved Personal Device': 2, 'Unregistered Device': 4, 'Unknown Device': 5 },
  sensitivity: { Public: 1, Internal: 2, Confidential: 3, Restricted: 4, 'Top Secret': 5 },
  login: { 'Expected login pattern': 1, 'Slight deviation from baseline': 2, 'Unfamiliar sign-in location': 3, 'Multiple failed attempts before success': 4, 'Anomalous / suspicious pattern': 5 },
};

export const MAX_SCORE = 5 + 5 + 5 + 5 + 5 + 5; // 30

<<<<<<< HEAD
=======
// A score at or above this percentage is classed HIGH (risk) or HIGH READINESS.
export const RISK_THRESHOLD_PCT = 50;
export const READINESS_THRESHOLD_PCT = 50;

>>>>>>> ad84745 (Update ZT-MFA DSS prototype)
export function getRiskForValue(fieldId: string, value: string): RiskLabel | null {
  const field = RISK_FIELDS.find(f => f.id === fieldId);
  return field?.options.find(o => o.value === value)?.risk ?? null;
}

export const DEFAULT_CONTEXTUAL_ANSWERS: Record<string, string> = {
  role: 'Manager',
  network: 'Public Wi-Fi',
  location: 'Unknown',
  device: 'Unregistered Device',
  sensitivity: 'Confidential',
  login: 'Unfamiliar sign-in location',
};

export interface ContextualRiskResult {
  score: number;
  level: BinaryLevel;
  highRiskFields: RiskField[];
}

export function computeContextualRisk(answers: Record<string, string>): ContextualRiskResult {
  const rawScore = Object.keys(RISK_SCORES).reduce(
    (sum, key) => sum + (RISK_SCORES[key][answers[key]] ?? 1),
    0
  );
  const score = Math.round((rawScore / MAX_SCORE) * 100);
<<<<<<< HEAD
  const level: BinaryLevel = score >= 50 ? 'HIGH' : 'LOW';
=======
  const level: BinaryLevel = score >= RISK_THRESHOLD_PCT ? 'HIGH' : 'LOW';
>>>>>>> ad84745 (Update ZT-MFA DSS prototype)
  const highRiskFields = RISK_FIELDS.filter(f => getRiskForValue(f.id, answers[f.id]) === 'High Risk');
  return { score, level, highRiskFields };
}

// ---------------------------------------------------------------------------
// Layer 2: Behavioural Assessment (MFA Compliance Readiness)
// ---------------------------------------------------------------------------

export type ReadinessLevel = 'HIGH READINESS' | 'LOW READINESS';

export const QUESTIONS = [
  'Our organisation has documented MFA policies for all critical banking systems.',
  'MFA is enforced for all privileged and administrative accounts.',
  'All users receive regular training on MFA best practices and phishing awareness.',
  'MFA bypass and exception procedures are formally documented and tightly controlled.',
  'MFA implementation is subject to formal annual review and audit.',
  'Emergency access and break-glass procedures include explicit MFA requirements.',
  'MFA failure rates and authentication anomalies are monitored and reported.',
  'Users can easily self-service MFA enrolment and device recovery without IT intervention.',
  "Our MFA solution is fully integrated with the organisation's identity management platform.",
  'We conduct regular effectiveness assessments of our MFA controls.',
  'Our MFA requirements align with current FCA, PRA and DORA regulatory guidance.',
  'Any MFA exception or waiver requires documented management-level approval.',
  'We have tested and documented recovery procedures for MFA device loss or theft.',
  'MFA event logs are retained in an auditable, tamper-evident format for ≥ 12 months.',
  'Our MFA solution supports adaptive and risk-based authentication policies.',
  'Our incident response plans include scenarios for MFA compromise and authentication failure.',
];

export const LIKERT = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

// Defaults chosen to reproduce the original worked example (~34% / LOW READINESS)
// so the app still opens on a real, computed HIGH-Risk / LOW-Readiness scenario.
export const DEFAULT_COMPLIANCE_ANSWERS: Record<number, string> = {
  0: 'Disagree', 1: 'Disagree', 2: 'Disagree', 3: 'Disagree', 4: 'Disagree',
  5: 'Disagree', 6: 'Disagree', 7: 'Disagree', 8: 'Disagree', 9: 'Disagree',
  10: 'Neutral', 11: 'Neutral', 12: 'Neutral', 13: 'Neutral', 14: 'Neutral', 15: 'Neutral',
};

export interface ReadinessResult {
  answeredCount: number;
  pct: number;
  level: ReadinessLevel;
}

export function computeReadiness(answers: Record<number, string>): ReadinessResult {
  const answeredCount = Object.keys(answers).length;
  const pct = answeredCount > 0
    ? Math.round(
        (Object.values(answers).reduce((sum, v) => sum + LIKERT.indexOf(v), 0) /
          (answeredCount * 4)) *
          100
      )
    : 0;
<<<<<<< HEAD
  const level: ReadinessLevel = pct >= 50 ? 'HIGH READINESS' : 'LOW READINESS';
=======
  const level: ReadinessLevel = pct >= READINESS_THRESHOLD_PCT ? 'HIGH READINESS' : 'LOW READINESS';
>>>>>>> ad84745 (Update ZT-MFA DSS prototype)
  return { answeredCount, pct, level };
}

// ---------------------------------------------------------------------------
// Layer 3: Decision Logic (2x2 risk-compliance profile + decision rules)
// ---------------------------------------------------------------------------

export type ProfileLabel =
  | 'HIGH RISK / LOW READINESS'
  | 'HIGH RISK / HIGH READINESS'
  | 'LOW RISK / LOW READINESS'
  | 'LOW RISK / HIGH READINESS';

export interface DecisionRule {
  id: 'R1' | 'R2' | 'R3' | 'R4';
  profile: ProfileLabel;
  contextualRisk: 'Low' | 'High';
  complianceReadiness: 'Low' | 'High';
  mfa: string;
  guidance: string;
}

// Table 3 (Risk-compliance decision matrix), Layer 3 of the conceptual framework.
export const RULES: DecisionRule[] = [
  {
    id: 'R1',
    profile: 'LOW RISK / HIGH READINESS',
    contextualRisk: 'Low',
    complianceReadiness: 'High',
    mfa: 'Standard MFA',
    guidance: 'Minimal Friction',
  },
  {
    id: 'R2',
    profile: 'LOW RISK / LOW READINESS',
    contextualRisk: 'Low',
    complianceReadiness: 'Low',
    mfa: 'Standard MFA',
    guidance: 'Supportive Guidance',
  },
  {
    id: 'R3',
    profile: 'HIGH RISK / HIGH READINESS',
    contextualRisk: 'High',
    complianceReadiness: 'High',
    mfa: 'Phishing-resistant MFA',
    guidance: 'Security-Focused Explanation',
  },
  {
    id: 'R4',
    profile: 'HIGH RISK / LOW READINESS',
    contextualRisk: 'High',
    complianceReadiness: 'Low',
    mfa: 'Phishing-resistant MFA',
    guidance: 'Salient Warning + Simple Guidance',
  },
];

export interface ProfileResult {
  profileLabel: ProfileLabel;
  rule: DecisionRule;
}

export function computeProfile(riskLevel: BinaryLevel, readinessLevel: ReadinessLevel): ProfileResult {
  const riskBinary: 'Low' | 'High' = riskLevel === 'HIGH' ? 'High' : 'Low';
  const readinessBinary: 'Low' | 'High' = readinessLevel === 'HIGH READINESS' ? 'High' : 'Low';
  const rule = RULES.find(
    r => r.contextualRisk === riskBinary && r.complianceReadiness === readinessBinary
  )!;
  return { profileLabel: rule.profile, rule };
}

export function quadrantPosition(profileLabel: ProfileLabel): 'Top-Left' | 'Top-Right' | 'Bottom-Left' | 'Bottom-Right' {
  switch (profileLabel) {
    case 'HIGH RISK / LOW READINESS': return 'Top-Left';
    case 'HIGH RISK / HIGH READINESS': return 'Top-Right';
    case 'LOW RISK / LOW READINESS': return 'Bottom-Left';
    case 'LOW RISK / HIGH READINESS': return 'Bottom-Right';
  }
}

export const QUADRANT_INFO: Record<ProfileLabel, { color: string; bg: string; border: string; text: string }> = {
  'HIGH RISK / LOW READINESS': {
    color: '#E53935',
    bg: '#FEF2F2',
    border: '#FCA5A5',
    text: 'Strong authentication and additional user support are recommended. The combination of elevated contextual risk and lower compliance readiness calls for both robust MFA enforcement and clear guidance to the user.',
  },
  'HIGH RISK / HIGH READINESS': {
    color: '#E85D04',
    bg: '#FFFBEB',
    border: '#FED7AA',
    text: 'Strong authentication recommended. User is capable of handling complex MFA.',
  },
  'LOW RISK / LOW READINESS': {
    color: '#1677E8',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    text: 'Standard MFA with supportive guidance recommended.',
  },
  'LOW RISK / HIGH READINESS': {
    color: '#008A62',
    bg: '#F0FDF4',
    border: '#A7F3D0',
    text: 'Standard MFA with minimal friction is appropriate.',
  },
};

// ---------------------------------------------------------------------------
// Layer 4: Decision Output (user-facing guidance / nudge)
// ---------------------------------------------------------------------------

export interface GuidanceMessage {
  message: string;
  color: string;
  bg: string;
  border: string;
}

export const GUIDANCE_MESSAGES: Record<string, GuidanceMessage> = {
  'Minimal Friction': {
    message: 'Your sign-in matches expected patterns and your MFA compliance is strong. Standard authentication will proceed with minimal interruption.',
    color: '#008A62',
    bg: '#F0FDF4',
    border: '#A7F3D0',
  },
  'Supportive Guidance': {
    message: "Standard authentication is required. We'll guide you through a few steps to help strengthen your MFA compliance going forward.",
    color: '#1677E8',
    bg: '#EFF6FF',
    border: '#BFDBFE',
  },
  'Security-Focused Explanation': {
    message: 'This sign-in has been identified as high risk. Because your MFA compliance is strong, a concise explanation accompanies the required step-up authentication.',
    color: '#E85D04',
    bg: '#FFFBEB',
    border: '#FED7AA',
  },
  'Salient Warning + Simple Guidance': {
    message: 'This sign-in has been identified as high risk. Additional authentication is required to continue.',
    color: '#E53935',
    bg: '#FEF2F2',
    border: '#FCA5A5',
  },
};

// ---------------------------------------------------------------------------
// Organisation Policy guardrail (applied before the final recommendation)
// ---------------------------------------------------------------------------

export type MFALevel = 'standard' | 'step-up' | 'phishing-resistant';

export const MFA_LEVELS: { value: MFALevel; label: string }[] = [
  { value: 'standard', label: 'Standard MFA' },
  { value: 'step-up', label: 'Step-up MFA' },
  { value: 'phishing-resistant', label: 'Phishing-resistant MFA' },
];

export const levelRank: Record<MFALevel, number> = { standard: 1, 'step-up': 2, 'phishing-resistant': 3 };
export const MFA_LABEL: Record<MFALevel, string> = {
  standard: 'Standard MFA',
  'step-up': 'Step-up MFA',
  'phishing-resistant': 'Phishing-resistant MFA',
};

export function mfaLabelToLevel(label: string): MFALevel {
  if (label === 'Phishing-resistant MFA') return 'phishing-resistant';
  if (label === 'Step-up MFA') return 'step-up';
  return 'standard';
}

export interface OrgPolicy {
  minMFA: MFALevel;
  sensitiveResourceMFA: MFALevel;
  privilegedRoleMFA: MFALevel;
  policyStatus: 'active' | 'review' | 'draft';
}

export interface PolicyCheckResult {
  finalLevel: MFALevel;
  guardrailApplied: boolean;
}

// The final MFA recommendation cannot be weaker than the organisation's configured minimum.
export function applyPolicyGuardrail(ruleMfaLevel: MFALevel, policy: OrgPolicy): PolicyCheckResult {
  const guardrailApplied = levelRank[policy.minMFA] > levelRank[ruleMfaLevel];
  const finalLevel: MFALevel = guardrailApplied ? policy.minMFA : ruleMfaLevel;
  return { finalLevel, guardrailApplied };
}
<<<<<<< HEAD
=======

// ---------------------------------------------------------------------------
// Explanation (Layer 4): plain-language reasons behind a recommendation.
// Pure function: it only describes values the engine has already computed,
// so it cannot change the recommendation.
// ---------------------------------------------------------------------------

export interface RecommendationExplanation {
  riskDrivers: { label: string; value: string }[];
  riskLine: string;
  readinessLine: string;
  ruleLine: string;
  policyLine: string;
}

export function explainRecommendation(
  answers: Record<string, string>,
  risk: ContextualRiskResult,
  readiness: ReadinessResult,
  profile: ProfileResult,
  policy: OrgPolicy,
  check: PolicyCheckResult,
): RecommendationExplanation {
  const riskDrivers = risk.highRiskFields.map(f => ({ label: f.label, value: answers[f.id] }));
  const riskLine =
    `Risk score is ${risk.score}%. A score of ${RISK_THRESHOLD_PCT}% or more counts as HIGH, so risk is ${risk.level}.`;
  const readinessLine =
    `Readiness score is ${readiness.pct}% (${readiness.answeredCount} of ${QUESTIONS.length} questions answered). ` +
    `A score of ${READINESS_THRESHOLD_PCT}% or more counts as HIGH, so readiness is ` +
    `${readiness.level === 'HIGH READINESS' ? 'HIGH' : 'LOW'}.`;
  const ruleLine =
    `${profile.profileLabel} matches rule ${profile.rule.id}: ${profile.rule.mfa} with "${profile.rule.guidance}" guidance. ` +
    `Risk decides the MFA type. Readiness changes the guidance message.`;
  const policyLine = check.guardrailApplied
    ? `The policy minimum (${MFA_LABEL[policy.minMFA]}) is stronger than the rule result, so the recommendation was raised to ${MFA_LABEL[check.finalLevel]}.`
    : `The rule result meets the policy minimum (${MFA_LABEL[policy.minMFA]}), so no change was needed.`;
  return { riskDrivers, riskLine, readinessLine, ruleLine, policyLine };
}
>>>>>>> ad84745 (Update ZT-MFA DSS prototype)
