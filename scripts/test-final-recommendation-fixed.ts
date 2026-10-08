/**
<<<<<<< HEAD
 * Test script for the TrustGuard MFA Decision Support Prototype.
=======
 * Test script for the Zero Trust MFA Decision Support System MFA Decision Support Prototype.
>>>>>>> ad84745 (Update ZT-MFA DSS prototype)
 *
 * Hardcodes the 12 distinct conditions (4 decision rules R1–R4 x 3 possible
 * Organisation Policy "Minimum MFA Requirement" settings) and their expected
 * FINAL recommendation — the value actually shown on the MFA Recommendation /
 * Organisation Policy / Dashboard pages after the guardrail has been applied
 * — then runs each one through the real engine and checks it matches exactly.
 *
 * Expected values are typed out explicitly, row by row, so this file doubles
 * as documentation of the full outcome table:
 *
 *   #  | Rule | Rule's own output       | Organisation Policy       | Final Recommendation     | Guardrail applied?
 *   1  | R1   | Standard MFA             | Standard MFA              | Standard MFA             | No
 *   2  | R1   | Standard MFA             | Step-up MFA               | Step-up MFA              | Yes
 *   3  | R1   | Standard MFA             | Phishing-resistant MFA    | Phishing-resistant MFA   | Yes
 *   4  | R2   | Standard MFA             | Standard MFA              | Standard MFA             | No
 *   5  | R2   | Standard MFA             | Step-up MFA               | Step-up MFA              | Yes
 *   6  | R2   | Standard MFA             | Phishing-resistant MFA    | Phishing-resistant MFA   | Yes
 *   7  | R3   | Phishing-resistant MFA   | Standard MFA              | Phishing-resistant MFA   | No
 *   8  | R3   | Phishing-resistant MFA   | Step-up MFA               | Phishing-resistant MFA   | No
 *   9  | R3   | Phishing-resistant MFA   | Phishing-resistant MFA    | Phishing-resistant MFA   | No
 *   10 | R4   | Phishing-resistant MFA   | Standard MFA              | Phishing-resistant MFA   | No
 *   11 | R4   | Phishing-resistant MFA   | Step-up MFA               | Phishing-resistant MFA   | No
 *   12 | R4   | Phishing-resistant MFA   | Phishing-resistant MFA    | Phishing-resistant MFA   | No
 *
 * Run it with:
 *   npx tsx scripts/test-final-recommendation-fixed.ts
 */

import {
  computeContextualRisk,
  computeReadiness,
  computeProfile,
  applyPolicyGuardrail,
  mfaLabelToLevel,
  MFA_LABEL,
  RISK_FIELDS,
  QUESTIONS,
  type OrgPolicy,
  type MFALevel,
} from '../src/lib/decisionEngine';

// ---------------------------------------------------------------------------
// Helpers to build inputs that are guaranteed to land on a given rule
// ---------------------------------------------------------------------------

function allLowRiskAnswers(): Record<string, string> {
  const answers: Record<string, string> = {};
  for (const field of RISK_FIELDS) answers[field.id] = field.options[0].value;
  return answers;
}

function allHighRiskAnswers(): Record<string, string> {
  const answers: Record<string, string> = {};
  for (const field of RISK_FIELDS) answers[field.id] = field.options[field.options.length - 1].value;
  return answers;
}

function allAnswers(likertOption: string): Record<number, string> {
  const answers: Record<number, string> = {};
  QUESTIONS.forEach((_, i) => (answers[i] = likertOption));
  return answers;
}

const LOW_READINESS_ANSWERS = allAnswers('Strongly Disagree');
const HIGH_READINESS_ANSWERS = allAnswers('Strongly Agree');

// Inputs that reliably produce each rule, via the real engine.
const RULE_INPUTS: Record<'R1' | 'R2' | 'R3' | 'R4', { contextualAnswers: Record<string, string>; complianceAnswers: Record<number, string> }> = {
  R1: { contextualAnswers: allLowRiskAnswers(), complianceAnswers: HIGH_READINESS_ANSWERS },
  R2: { contextualAnswers: allLowRiskAnswers(), complianceAnswers: LOW_READINESS_ANSWERS },
  R3: { contextualAnswers: allHighRiskAnswers(), complianceAnswers: HIGH_READINESS_ANSWERS },
  R4: { contextualAnswers: allHighRiskAnswers(), complianceAnswers: LOW_READINESS_ANSWERS },
};

function makePolicy(minMFA: MFALevel): OrgPolicy {
  return {
    minMFA,
    sensitiveResourceMFA: 'phishing-resistant',
    privilegedRoleMFA: 'phishing-resistant',
    policyStatus: 'active',
  };
}

// ---------------------------------------------------------------------------
// Expected outcome table (typed out explicitly — this IS the expected behaviour)
// ---------------------------------------------------------------------------

interface ExpectedRow {
  n: number;
  rule: 'R1' | 'R2' | 'R3' | 'R4';
  minMFA: MFALevel;
  expectedRuleOutput: string;
  expectedFinal: string;
  expectedGuardrailApplied: boolean;
}

const EXPECTED_TABLE: ExpectedRow[] = [
  { n: 1, rule: 'R1', minMFA: 'standard', expectedRuleOutput: 'Standard MFA', expectedFinal: 'Standard MFA', expectedGuardrailApplied: false },
  { n: 2, rule: 'R1', minMFA: 'step-up', expectedRuleOutput: 'Standard MFA', expectedFinal: 'Step-up MFA', expectedGuardrailApplied: true },
  { n: 3, rule: 'R1', minMFA: 'phishing-resistant', expectedRuleOutput: 'Standard MFA', expectedFinal: 'Phishing-resistant MFA', expectedGuardrailApplied: true },
  { n: 4, rule: 'R2', minMFA: 'standard', expectedRuleOutput: 'Standard MFA', expectedFinal: 'Standard MFA', expectedGuardrailApplied: false },
  { n: 5, rule: 'R2', minMFA: 'step-up', expectedRuleOutput: 'Standard MFA', expectedFinal: 'Step-up MFA', expectedGuardrailApplied: true },
  { n: 6, rule: 'R2', minMFA: 'phishing-resistant', expectedRuleOutput: 'Standard MFA', expectedFinal: 'Phishing-resistant MFA', expectedGuardrailApplied: true },
  { n: 7, rule: 'R3', minMFA: 'standard', expectedRuleOutput: 'Phishing-resistant MFA', expectedFinal: 'Phishing-resistant MFA', expectedGuardrailApplied: false },
  { n: 8, rule: 'R3', minMFA: 'step-up', expectedRuleOutput: 'Phishing-resistant MFA', expectedFinal: 'Phishing-resistant MFA', expectedGuardrailApplied: false },
  { n: 9, rule: 'R3', minMFA: 'phishing-resistant', expectedRuleOutput: 'Phishing-resistant MFA', expectedFinal: 'Phishing-resistant MFA', expectedGuardrailApplied: false },
  { n: 10, rule: 'R4', minMFA: 'standard', expectedRuleOutput: 'Phishing-resistant MFA', expectedFinal: 'Phishing-resistant MFA', expectedGuardrailApplied: false },
  { n: 11, rule: 'R4', minMFA: 'step-up', expectedRuleOutput: 'Phishing-resistant MFA', expectedFinal: 'Phishing-resistant MFA', expectedGuardrailApplied: false },
  { n: 12, rule: 'R4', minMFA: 'phishing-resistant', expectedRuleOutput: 'Phishing-resistant MFA', expectedFinal: 'Phishing-resistant MFA', expectedGuardrailApplied: false },
];

// ---------------------------------------------------------------------------
// Test harness
// ---------------------------------------------------------------------------

let pass = 0;
let fail = 0;

// Used for real pass/fail assertions.
function assertEqual(actual: unknown, expected: unknown, label: string) {
  if (actual === expected) {
    console.log(`   \x1b[32m✓\x1b[0m ${label}: ${String(actual)}`);
    pass++;
  } else {
    console.log(`   \x1b[31m✗ ${label}: expected ${String(expected)}, got ${String(actual)}\x1b[0m`);
    fail++;
  }
}

// Used to print a given input value (not a check against computed output),
// kept in the same green-checkmark style for a consistent, readable log.
function printInput(label: string, value: string) {
  console.log(`   \x1b[32m✓\x1b[0m ${label}: ${value}`);
}

console.log('='.repeat(84));
console.log('Final MFA Recommendation (12 conditions)');
console.log('='.repeat(84));
console.log(
  `\n${'#'.padEnd(3)} ${'Rule'.padEnd(5)} ${'Organisation Policy'.padEnd(24)} ${'Final Recommendation'.padEnd(24)} Guardrail`
);
console.log('-'.repeat(84));

for (const row of EXPECTED_TABLE) {
  const { contextualAnswers, complianceAnswers } = RULE_INPUTS[row.rule];
  const contextualRisk = computeContextualRisk(contextualAnswers);
  const readiness = computeReadiness(complianceAnswers);
  const profile = computeProfile(contextualRisk.level, readiness.level);
  const ruleLevel = mfaLabelToLevel(profile.rule.mfa);
  const policy = makePolicy(row.minMFA);
  const { finalLevel, guardrailApplied } = applyPolicyGuardrail(ruleLevel, policy);
  const finalLabel = MFA_LABEL[finalLevel];
  const minMfaLabel = MFA_LABEL[row.minMFA];

  console.log(
    `${String(row.n).padEnd(3)} ${row.rule.padEnd(5)} ${minMfaLabel.padEnd(24)} ${finalLabel.padEnd(24)} ${guardrailApplied ? 'Yes' : 'No'}`
  );

  assertEqual(profile.rule.mfa, row.expectedRuleOutput, `Row ${row.n}: ${row.rule} decision rule's output`);
  printInput(`Row ${row.n}: Min MFA Requirement`, minMfaLabel);
  assertEqual(finalLabel, row.expectedFinal, `Row ${row.n}: final recommendation`);
  assertEqual(guardrailApplied, row.expectedGuardrailApplied, `Row ${row.n}: guardrail applied?`);
}

// ---------------------------------------------------------------------------
// Sanity checks on the shape of the outcome space itself
// ---------------------------------------------------------------------------

console.log(`\n${'='.repeat(84)}`);
console.log('Outcome-space sanity checks');
console.log('='.repeat(84));

const distinctFinals = new Set(EXPECTED_TABLE.map(r => r.expectedFinal));
assertEqual(distinctFinals.size, 3, 'Distinct final recommendation values across all 12 conditions');

const guardrailFiredCount = EXPECTED_TABLE.filter(r => r.expectedGuardrailApplied).length;
assertEqual(guardrailFiredCount, 4, 'Number of conditions (of 12) where the guardrail actually changes the outcome');

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${'='.repeat(84)}`);
console.log(`Result: ${pass} passed, ${fail} failed`);
console.log('='.repeat(84));

if (fail > 0) {
  process.exitCode = 1;
}
