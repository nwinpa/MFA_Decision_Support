/**
<<<<<<< HEAD
 * Test script for the TrustGuard MFA Decision Support Prototype.
=======
 * Test script for the Zero Trust MFA Decision Support System MFA Decision Support Prototype.
>>>>>>> ad84745 (Update ZT-MFA DSS prototype)
 *
 * Exercises all 4 cells of the Risk–Compliance decision matrix (Table 3 of the
 * conceptual framework) end-to-end through the real decision engine
 * (src/lib/decisionEngine.ts) — no UI needed.
 *
 * For each of the 4 quadrants it:
 *   1. Builds a set of Contextual Risk answers and Compliance Readiness answers
 *      that should land in that quadrant.
 *   2. Runs them through computeContextualRisk() and computeReadiness().
 *   3. Runs the results through computeProfile() to get the matched rule (R1–R4).
 *   4. Asserts the resulting rule id, MFA type, and guidance match Table 3.
 *   5. Also runs the Organisation Policy guardrail against each quadrant.
 *
 * Run it with:
 *   npx tsx scripts/test-decision-matrix.ts
 *
 * (tsx runs the .ts file directly — no build step or extra install needed
 * beyond `pnpm install`, since npx will fetch tsx on first use.)
 */

import {
  computeContextualRisk,
  computeReadiness,
  computeProfile,
  applyPolicyGuardrail,
  MFA_LABEL,
  RISK_FIELDS,
  LIKERT,
  QUESTIONS,
  type OrgPolicy,
} from '../src/lib/decisionEngine';

// ---------------------------------------------------------------------------
// Helpers to build answer sets that are guaranteed to land in a given corner
// ---------------------------------------------------------------------------

// Lowest-risk option for every contextual field (first option in RISK_FIELDS).
function allLowRiskAnswers(): Record<string, string> {
  const answers: Record<string, string> = {};
  for (const field of RISK_FIELDS) {
    answers[field.id] = field.options[0].value; // first option is always Low Risk
  }
  return answers;
}

// Highest-risk option for every contextual field (last option in RISK_FIELDS).
function allHighRiskAnswers(): Record<string, string> {
  const answers: Record<string, string> = {};
  for (const field of RISK_FIELDS) {
    answers[field.id] = field.options[field.options.length - 1].value; // last option is always High Risk
  }
  return answers;
}

// All 16 questions answered with the same Likert option.
function allAnswers(likertOption: string): Record<number, string> {
  const answers: Record<number, string> = {};
  QUESTIONS.forEach((_, i) => {
    answers[i] = likertOption;
  });
  return answers;
}

const LOW_READINESS_ANSWERS = allAnswers('Strongly Disagree'); // -> 0%   -> LOW READINESS
const HIGH_READINESS_ANSWERS = allAnswers('Strongly Agree'); // -> 100% -> HIGH READINESS

// ---------------------------------------------------------------------------
// Test harness
// ---------------------------------------------------------------------------

let pass = 0;
let fail = 0;

function assertEqual(actual: unknown, expected: unknown, label: string) {
  if (actual === expected) {
    console.log(`  \x1b[32m✓\x1b[0m ${label}: ${String(actual)}`);
    pass++;
  } else {
    console.log(`  \x1b[31m✗ ${label}: expected ${String(expected)}, got ${String(actual)}\x1b[0m`);
    fail++;
  }
}

interface Scenario {
  name: string;
  contextualAnswers: Record<string, string>;
  complianceAnswers: Record<number, string>;
  expectedRiskLevel: 'LOW' | 'HIGH';
  expectedReadinessLevel: 'LOW READINESS' | 'HIGH READINESS';
  expectedRuleId: 'R1' | 'R2' | 'R3' | 'R4';
  expectedMfa: string;
}

const scenarios: Scenario[] = [
  {
    name: 'Low Risk / High Readiness  →  R1',
    contextualAnswers: allLowRiskAnswers(),
    complianceAnswers: HIGH_READINESS_ANSWERS,
    expectedRiskLevel: 'LOW',
    expectedReadinessLevel: 'HIGH READINESS',
    expectedRuleId: 'R1',
    expectedMfa: 'Standard MFA',
  },
  {
    name: 'Low Risk / Low Readiness   →  R2',
    contextualAnswers: allLowRiskAnswers(),
    complianceAnswers: LOW_READINESS_ANSWERS,
    expectedRiskLevel: 'LOW',
    expectedReadinessLevel: 'LOW READINESS',
    expectedRuleId: 'R2',
    expectedMfa: 'Standard MFA',
  },
  {
    name: 'High Risk / High Readiness →  R3',
    contextualAnswers: allHighRiskAnswers(),
    complianceAnswers: HIGH_READINESS_ANSWERS,
    expectedRiskLevel: 'HIGH',
    expectedReadinessLevel: 'HIGH READINESS',
    expectedRuleId: 'R3',
    expectedMfa: 'Phishing-resistant MFA',
  },
  {
    name: 'High Risk / Low Readiness  →  R4',
    contextualAnswers: allHighRiskAnswers(),
    complianceAnswers: LOW_READINESS_ANSWERS,
    expectedRiskLevel: 'HIGH',
    expectedReadinessLevel: 'LOW READINESS',
    expectedRuleId: 'R4',
    expectedMfa: 'Phishing-resistant MFA',
  },
];

console.log('='.repeat(70));
<<<<<<< HEAD
console.log('TrustGuard — Risk–Compliance Decision Matrix test (R1–R4)');
=======
console.log('Zero Trust MFA Decision Support System — Risk–Compliance Decision Matrix test (R1–R4)');
>>>>>>> ad84745 (Update ZT-MFA DSS prototype)
console.log('='.repeat(70));

for (const scenario of scenarios) {
  console.log(`\n${scenario.name}`);
  console.log('-'.repeat(scenario.name.length));

  const contextualRisk = computeContextualRisk(scenario.contextualAnswers);
  const readiness = computeReadiness(scenario.complianceAnswers);
  const profile = computeProfile(contextualRisk.level, readiness.level);

  console.log(`  Contextual risk score: ${contextualRisk.score}/100`);
  console.log(`  Readiness score:       ${readiness.pct}%`);

  assertEqual(contextualRisk.level, scenario.expectedRiskLevel, 'Contextual risk level');
  assertEqual(readiness.level, scenario.expectedReadinessLevel, 'Readiness level');
  assertEqual(profile.rule.id, scenario.expectedRuleId, 'Matched rule');
  assertEqual(profile.rule.mfa, scenario.expectedMfa, 'MFA recommendation');
}

// ---------------------------------------------------------------------------
// Organisation Policy guardrail — confirm the final recommendation is never
// weaker than the configured minimum, for every quadrant.
// ---------------------------------------------------------------------------

console.log(`\n${'='.repeat(70)}`);
console.log('Organisation Policy guardrail (minimum = Phishing-resistant MFA)');
console.log('='.repeat(70));

const strictPolicy: OrgPolicy = {
  minMFA: 'phishing-resistant',
  sensitiveResourceMFA: 'phishing-resistant',
  privilegedRoleMFA: 'phishing-resistant',
  policyStatus: 'active',
};

for (const scenario of scenarios) {
  const contextualRisk = computeContextualRisk(scenario.contextualAnswers);
  const readiness = computeReadiness(scenario.complianceAnswers);
  const profile = computeProfile(contextualRisk.level, readiness.level);
  const ruleLevel = profile.rule.mfa === 'Standard MFA' ? 'standard' : 'phishing-resistant';
  const policyCheck = applyPolicyGuardrail(ruleLevel, strictPolicy);

  console.log(`\n${scenario.name}`);
  console.log(`  Rule output:       ${profile.rule.mfa}`);
  console.log(`  Final (guarded):   ${MFA_LABEL[policyCheck.finalLevel]}`);
  assertEqual(MFA_LABEL[policyCheck.finalLevel], 'Phishing-resistant MFA', 'Final recommendation is never weaker than policy minimum');
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${'='.repeat(70)}`);
console.log(`Result: ${pass} passed, ${fail} failed`);
console.log('='.repeat(70));

if (fail > 0) {
  process.exitCode = 1;
}
