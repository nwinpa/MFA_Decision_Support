<<<<<<< HEAD
/**
 * Conceptual scenario test for the five-layer ZT-MFA framework.
 * Traces two scenarios through the layers and checks each problem (P1-P3).
 * Run from the project root:  npx tsx scripts/test-conceptual-scenarios.ts
 */
import {
  computeContextualRisk,
  computeReadiness,
  computeProfile,
  applyPolicyGuardrail,
  explainRecommendation,
  mfaLabelToLevel,
  GUIDANCE_MESSAGES,
  MFA_LABEL,
  QUESTIONS,
  type OrgPolicy,
} from '../src/lib/decisionEngine';

const allAnswers = (option: string): Record<number, string> => {
  const a: Record<number, string> = {};
  QUESTIONS.forEach((_, i) => (a[i] = option));
  return a;
};
const policy: OrgPolicy = {
  minMFA: 'standard', sensitiveResourceMFA: 'standard',
  privilegedRoleMFA: 'standard', policyStatus: 'active',
};

interface Scenario {
  name: string;
  problems: string[];
  inputs: Record<string, string>;
  readiness: Record<number, string>;
  expect: { risk: 'HIGH' | 'LOW'; rule: string; mfa: string; guidance: string };
  claims: { text: string; test: (r: Result) => boolean }[];
}
interface Result {
  riskLevel: string; ruleId: string; mfa: string; guidance: string;
  message: string; drivers: number; finalMfa: string;
}

const scenarios: Scenario[] = [
  {
    name: 'Scenario 1: high risk, low readiness',
    problems: ['P3: a risky login needs a clear MFA choice', 'P2: the user needs to know why MFA is asked'],
    inputs: { role: 'Manager', network: 'Public Wi-Fi', location: 'Unknown',
      device: 'Unregistered Device', sensitivity: 'Confidential', login: 'Unfamiliar sign-in location' },
    readiness: allAnswers('Strongly Disagree'),
    expect: { risk: 'HIGH', rule: 'R4', mfa: 'Phishing-resistant MFA', guidance: 'Salient Warning + Simple Guidance' },
    claims: [
      { text: 'P3: final MFA is phishing-resistant (one clear choice)', test: r => r.finalMfa === 'Phishing-resistant MFA' },
      { text: 'P2: output names the risk drivers (reasons shown)', test: r => r.drivers > 0 },
      { text: 'P2: output carries a warning message', test: r => r.message.includes('high risk') },
    ],
  },
  {
    name: 'Scenario 2: low risk, high readiness',
    problems: ['P1: a routine login should not face too many prompts'],
    inputs: { role: 'Customer', network: 'Corporate Network', location: 'Known Location',
      device: 'Managed Corporate Device', sensitivity: 'Public', login: 'Expected login pattern' },
    readiness: allAnswers('Strongly Agree'),
    expect: { risk: 'LOW', rule: 'R1', mfa: 'Standard MFA', guidance: 'Minimal Friction' },
    claims: [
      { text: 'P1: final MFA is Standard MFA (lightest option)', test: r => r.finalMfa === 'Standard MFA' },
      { text: 'P1: guidance is Minimal Friction', test: r => r.guidance === 'Minimal Friction' },
      { text: 'P1: message says minimal interruption', test: r => r.message.includes('minimal interruption') },
    ],
  },
];

let failed = 0;
for (const s of scenarios) {
  const risk = computeContextualRisk(s.inputs);                  // Layer 1
  const ready = computeReadiness(s.readiness);                   // Layer 2
  const profile = computeProfile(risk.level, ready.level);       // Layer 3
  const check = applyPolicyGuardrail(mfaLabelToLevel(profile.rule.mfa), policy);
  const why = explainRecommendation(s.inputs, risk, ready, profile, policy, check); // Layer 4
  const msg = GUIDANCE_MESSAGES[profile.rule.guidance]?.message ?? '';
  const r: Result = {
    riskLevel: risk.level, ruleId: profile.rule.id, mfa: profile.rule.mfa,
    guidance: profile.rule.guidance, message: msg,
    drivers: why.riskDrivers.length, finalMfa: MFA_LABEL[check.finalLevel],
  };

  console.log(s.name);
  console.log(`  Problems    : ${s.problems.join(' | ')}`);
  console.log(`  Layer 1     : risk ${risk.score}/100 (${risk.level}); drivers: ${why.riskDrivers.map(d => d.value).join(', ') || 'none'}`);
  console.log(`  Layer 2     : readiness ${ready.pct}% (${ready.level})`);
  console.log(`  Layer 3     : rule ${r.ruleId} -> ${r.mfa}`);
  console.log(`  Layer 4     : "${r.guidance}" | ${msg}`);

  const layerOk = r.riskLevel === s.expect.risk && r.ruleId === s.expect.rule &&
    r.mfa === s.expect.mfa && r.guidance === s.expect.guidance;
  console.log(`  [${layerOk ? 'PASS' : 'FAIL'}] framework output matches the expected layer results`);
  if (!layerOk) failed++;
  for (const c of s.claims) {
    const ok = c.test(r);
    console.log(`  [${ok ? 'PASS' : 'FAIL'}] ${c.text}`);
    if (!ok) failed++;
  }
  console.log('');
}
console.log(failed === 0 ? 'All conceptual scenario checks passed.' : `${failed} check(s) failed.`);
=======
/**
 * Conceptual scenario test for the five-layer ZT-MFA framework.
 * Traces two scenarios through the layers and checks each problem (P1-P3).
 * Run from the project root:  npx tsx scripts/test-conceptual-scenarios.ts
 */
import {
  computeContextualRisk,
  computeReadiness,
  computeProfile,
  applyPolicyGuardrail,
  explainRecommendation,
  mfaLabelToLevel,
  GUIDANCE_MESSAGES,
  MFA_LABEL,
  QUESTIONS,
  type OrgPolicy,
} from '../src/lib/decisionEngine';

const allAnswers = (option: string): Record<number, string> => {
  const a: Record<number, string> = {};
  QUESTIONS.forEach((_, i) => (a[i] = option));
  return a;
};
const policy: OrgPolicy = {
  minMFA: 'standard', sensitiveResourceMFA: 'standard',
  privilegedRoleMFA: 'standard', policyStatus: 'active',
};

interface Scenario {
  name: string;
  problems: string[];
  inputs: Record<string, string>;
  readiness: Record<number, string>;
  expect: { risk: 'HIGH' | 'LOW'; rule: string; mfa: string; guidance: string };
  claims: { text: string; test: (r: Result) => boolean }[];
}
interface Result {
  riskLevel: string; ruleId: string; mfa: string; guidance: string;
  message: string; drivers: number; finalMfa: string;
}

const scenarios: Scenario[] = [
  {
    name: 'Scenario 1: high risk, low readiness',
    problems: ['P3: a risky login needs a clear MFA choice', 'P2: the user needs to know why MFA is asked'],
    inputs: { role: 'Manager', network: 'Public Wi-Fi', location: 'Unknown',
      device: 'Unregistered Device', sensitivity: 'Confidential', login: 'Unfamiliar sign-in location' },
    readiness: allAnswers('Strongly Disagree'),
    expect: { risk: 'HIGH', rule: 'R4', mfa: 'Phishing-resistant MFA', guidance: 'Salient Warning + Simple Guidance' },
    claims: [
      { text: 'P3: final MFA is phishing-resistant (one clear choice)', test: r => r.finalMfa === 'Phishing-resistant MFA' },
      { text: 'P2: output names the risk drivers (reasons shown)', test: r => r.drivers > 0 },
      { text: 'P2: output carries a warning message', test: r => r.message.includes('high risk') },
    ],
  },
  {
    name: 'Scenario 2: low risk, high readiness',
    problems: ['P1: a routine login should not face too many prompts'],
    inputs: { role: 'Customer', network: 'Corporate Network', location: 'Known Location',
      device: 'Managed Corporate Device', sensitivity: 'Public', login: 'Expected login pattern' },
    readiness: allAnswers('Strongly Agree'),
    expect: { risk: 'LOW', rule: 'R1', mfa: 'Standard MFA', guidance: 'Minimal Friction' },
    claims: [
      { text: 'P1: final MFA is Standard MFA (lightest option)', test: r => r.finalMfa === 'Standard MFA' },
      { text: 'P1: guidance is Minimal Friction', test: r => r.guidance === 'Minimal Friction' },
      { text: 'P1: message says minimal interruption', test: r => r.message.includes('minimal interruption') },
    ],
  },
];

let failed = 0;
for (const s of scenarios) {
  const risk = computeContextualRisk(s.inputs);                  // Layer 1
  const ready = computeReadiness(s.readiness);                   // Layer 2
  const profile = computeProfile(risk.level, ready.level);       // Layer 3
  const check = applyPolicyGuardrail(mfaLabelToLevel(profile.rule.mfa), policy);
  const why = explainRecommendation(s.inputs, risk, ready, profile, policy, check); // Layer 4
  const msg = GUIDANCE_MESSAGES[profile.rule.guidance]?.message ?? '';
  const r: Result = {
    riskLevel: risk.level, ruleId: profile.rule.id, mfa: profile.rule.mfa,
    guidance: profile.rule.guidance, message: msg,
    drivers: why.riskDrivers.length, finalMfa: MFA_LABEL[check.finalLevel],
  };

  console.log(s.name);
  console.log(`  Problems    : ${s.problems.join(' | ')}`);
  console.log(`  Layer 1     : risk ${risk.score}/100 (${risk.level}); drivers: ${why.riskDrivers.map(d => d.value).join(', ') || 'none'}`);
  console.log(`  Layer 2     : readiness ${ready.pct}% (${ready.level})`);
  console.log(`  Layer 3     : rule ${r.ruleId} -> ${r.mfa}`);
  console.log(`  Layer 4     : "${r.guidance}" | ${msg}`);

  const layerOk = r.riskLevel === s.expect.risk && r.ruleId === s.expect.rule &&
    r.mfa === s.expect.mfa && r.guidance === s.expect.guidance;
  console.log(`  [${layerOk ? 'PASS' : 'FAIL'}] framework output matches the expected layer results`);
  if (!layerOk) failed++;
  for (const c of s.claims) {
    const ok = c.test(r);
    console.log(`  [${ok ? 'PASS' : 'FAIL'}] ${c.text}`);
    if (!ok) failed++;
  }
  console.log('');
}
console.log(failed === 0 ? 'All conceptual scenario checks passed.' : `${failed} check(s) failed.`);
>>>>>>> ad84745 (Update ZT-MFA DSS prototype)
process.exit(failed ? 1 : 0);