<<<<<<< HEAD
/**
 * Scenario test for the ZT-MFA Decision Support System.
 * Runs the four scenarios of Table 7 through the real decision engine.
 * Run from the project root:  npx tsx scripts/test-scenarios.ts
 */
import {
  computeContextualRisk,
  computeReadiness,
  computeProfile,
  applyPolicyGuardrail,
  mfaLabelToLevel,
  MFA_LABEL,
  QUESTIONS,
  type OrgPolicy,
  type MFALevel,
} from '../src/lib/decisionEngine';

const allAnswers = (option: string): Record<number, string> => {
  const a: Record<number, string> = {};
  QUESTIONS.forEach((_, i) => (a[i] = option));
  return a;
};

const HIGH_RISK_INPUTS = {
  role: 'Manager',
  network: 'Public Wi-Fi',
  location: 'Unknown',
  device: 'Unregistered Device',
  sensitivity: 'Confidential',
  login: 'Unfamiliar sign-in location',
};
const LOW_RISK_INPUTS = {
  role: 'Customer',
  network: 'Corporate Network',
  location: 'Known Location',
  device: 'Managed Corporate Device',
  sensitivity: 'Public',
  login: 'Expected login pattern',
};
const HIGH_READINESS = allAnswers('Strongly Agree');
const LOW_READINESS = allAnswers('Strongly Disagree');

const policy = (minMFA: MFALevel): OrgPolicy => ({
  minMFA,
  sensitiveResourceMFA: 'standard',
  privilegedRoleMFA: 'standard',
  policyStatus: 'active',
});

interface Scenario {
  no: number;
  name: string;
  risk: Record<string, string>;
  readiness: Record<number, string>;
  minMFA: MFALevel;
  expectedRisk: 'HIGH' | 'LOW';
  expectedRule: string;
  expectedFinal: MFALevel;
  expectedGuardrail: boolean;
}

const scenarios: Scenario[] = [
  { no: 1, name: 'High risk, low readiness', risk: HIGH_RISK_INPUTS, readiness: LOW_READINESS,
    minMFA: 'standard', expectedRisk: 'HIGH', expectedRule: 'R4', expectedFinal: 'phishing-resistant', expectedGuardrail: false },
  { no: 2, name: 'Low risk, high readiness', risk: LOW_RISK_INPUTS, readiness: HIGH_READINESS,
    minMFA: 'standard', expectedRisk: 'LOW', expectedRule: 'R1', expectedFinal: 'standard', expectedGuardrail: false },
  { no: 3, name: 'Low risk, low readiness', risk: LOW_RISK_INPUTS, readiness: LOW_READINESS,
    minMFA: 'standard', expectedRisk: 'LOW', expectedRule: 'R2', expectedFinal: 'standard', expectedGuardrail: false },
  { no: 4, name: 'Low risk, high readiness, policy minimum phishing-resistant', risk: LOW_RISK_INPUTS, readiness: HIGH_READINESS,
    minMFA: 'phishing-resistant', expectedRisk: 'LOW', expectedRule: 'R1', expectedFinal: 'phishing-resistant', expectedGuardrail: true },
];

let failed = 0;
for (const s of scenarios) {
  const risk = computeContextualRisk(s.risk);
  const ready = computeReadiness(s.readiness);
  const { rule } = computeProfile(risk.level, ready.level);
  const check = applyPolicyGuardrail(mfaLabelToLevel(rule.mfa), policy(s.minMFA));

  const ok =
    risk.level === s.expectedRisk &&
    rule.id === s.expectedRule &&
    check.finalLevel === s.expectedFinal &&
    check.guardrailApplied === s.expectedGuardrail;
  if (!ok) failed++;

  console.log(`Scenario ${s.no}: ${s.name}`);
  console.log(`  Risk       : ${risk.score}/100 (${risk.level})`);
  console.log(`  Readiness  : ${ready.pct}% (${ready.level})`);
  console.log(`  Rule       : ${rule.id} - ${rule.mfa}, ${rule.guidance}`);
  console.log(`  Guardrail  : ${check.guardrailApplied ? 'raised' : 'not used'} -> final ${MFA_LABEL[check.finalLevel]}`);
  console.log(`  Expected   : ${s.expectedRule}, final ${MFA_LABEL[s.expectedFinal]}`);
  console.log(`  Result     : ${ok ? 'PASS' : 'FAIL'}\n`);
}
console.log(`${scenarios.length - failed} of ${scenarios.length} scenarios passed.`);
=======
/**
 * Scenario test for the ZT-MFA Decision Support System.
 * Runs the four scenarios of Table 7 through the real decision engine.
 * Run from the project root:  npx tsx scripts/test-scenarios.ts
 */
import {
  computeContextualRisk,
  computeReadiness,
  computeProfile,
  applyPolicyGuardrail,
  mfaLabelToLevel,
  MFA_LABEL,
  QUESTIONS,
  type OrgPolicy,
  type MFALevel,
} from '../src/lib/decisionEngine';

const allAnswers = (option: string): Record<number, string> => {
  const a: Record<number, string> = {};
  QUESTIONS.forEach((_, i) => (a[i] = option));
  return a;
};

const HIGH_RISK_INPUTS = {
  role: 'Manager',
  network: 'Public Wi-Fi',
  location: 'Unknown',
  device: 'Unregistered Device',
  sensitivity: 'Confidential',
  login: 'Unfamiliar sign-in location',
};
const LOW_RISK_INPUTS = {
  role: 'Customer',
  network: 'Corporate Network',
  location: 'Known Location',
  device: 'Managed Corporate Device',
  sensitivity: 'Public',
  login: 'Expected login pattern',
};
const HIGH_READINESS = allAnswers('Strongly Agree');
const LOW_READINESS = allAnswers('Strongly Disagree');

const policy = (minMFA: MFALevel): OrgPolicy => ({
  minMFA,
  sensitiveResourceMFA: 'standard',
  privilegedRoleMFA: 'standard',
  policyStatus: 'active',
});

interface Scenario {
  no: number;
  name: string;
  risk: Record<string, string>;
  readiness: Record<number, string>;
  minMFA: MFALevel;
  expectedRisk: 'HIGH' | 'LOW';
  expectedRule: string;
  expectedFinal: MFALevel;
  expectedGuardrail: boolean;
}

const scenarios: Scenario[] = [
  { no: 1, name: 'High risk, low readiness', risk: HIGH_RISK_INPUTS, readiness: LOW_READINESS,
    minMFA: 'standard', expectedRisk: 'HIGH', expectedRule: 'R4', expectedFinal: 'phishing-resistant', expectedGuardrail: false },
  { no: 2, name: 'Low risk, high readiness', risk: LOW_RISK_INPUTS, readiness: HIGH_READINESS,
    minMFA: 'standard', expectedRisk: 'LOW', expectedRule: 'R1', expectedFinal: 'standard', expectedGuardrail: false },
  { no: 3, name: 'Low risk, low readiness', risk: LOW_RISK_INPUTS, readiness: LOW_READINESS,
    minMFA: 'standard', expectedRisk: 'LOW', expectedRule: 'R2', expectedFinal: 'standard', expectedGuardrail: false },
  { no: 4, name: 'Low risk, high readiness, policy minimum phishing-resistant', risk: LOW_RISK_INPUTS, readiness: HIGH_READINESS,
    minMFA: 'phishing-resistant', expectedRisk: 'LOW', expectedRule: 'R1', expectedFinal: 'phishing-resistant', expectedGuardrail: true },
];

let failed = 0;
for (const s of scenarios) {
  const risk = computeContextualRisk(s.risk);
  const ready = computeReadiness(s.readiness);
  const { rule } = computeProfile(risk.level, ready.level);
  const check = applyPolicyGuardrail(mfaLabelToLevel(rule.mfa), policy(s.minMFA));

  const ok =
    risk.level === s.expectedRisk &&
    rule.id === s.expectedRule &&
    check.finalLevel === s.expectedFinal &&
    check.guardrailApplied === s.expectedGuardrail;
  if (!ok) failed++;

  console.log(`Scenario ${s.no}: ${s.name}`);
  console.log(`  Risk       : ${risk.score}/100 (${risk.level})`);
  console.log(`  Readiness  : ${ready.pct}% (${ready.level})`);
  console.log(`  Rule       : ${rule.id} - ${rule.mfa}, ${rule.guidance}`);
  console.log(`  Guardrail  : ${check.guardrailApplied ? 'raised' : 'not used'} -> final ${MFA_LABEL[check.finalLevel]}`);
  console.log(`  Expected   : ${s.expectedRule}, final ${MFA_LABEL[s.expectedFinal]}`);
  console.log(`  Result     : ${ok ? 'PASS' : 'FAIL'}\n`);
}
console.log(`${scenarios.length - failed} of ${scenarios.length} scenarios passed.`);
>>>>>>> ad84745 (Update ZT-MFA DSS prototype)
process.exit(failed ? 1 : 0);