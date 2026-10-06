/**
 * Test script for the Organisation Policy guardrail in the TrustGuard
 * MFA Decision Support Prototype.
 *
 * The guardrail (applyPolicyGuardrail in src/lib/decisionEngine.ts) makes
 * sure the FINAL MFA recommendation is never weaker than the organisation's
 * configured "Minimum MFA Requirement" — it can only ever ELEVATE what the
 * decision rule (R1–R4) produced, never lower it.
 *
 *   guardrailApplied = levelRank[policy.minMFA] > levelRank[ruleMfaLevel]
 *   finalLevel       = guardrailApplied ? policy.minMFA : ruleMfaLevel
 *
 *   levelRank: standard = 1, step-up = 2, phishing-resistant = 3
 *
 * This script:
 *   1. Runs all 4 decision rules (R1–R4) through the real engine to get each
 *      rule's natural MFA output (Standard MFA for R1/R2, Phishing-resistant
 *      MFA for R3/R4).
 *   2. Checks each rule's output against all 3 possible "Minimum MFA
 *      Requirement" policy settings (Standard / Step-up / Phishing-resistant)
 *      — 12 combinations — and asserts whether the guardrail should fire.
 *   3. Separately exercises the one MFA tier the current RULES table never
 *      produces on its own (Step-up MFA) directly against
 *      applyPolicyGuardrail(), so all 3×3 = 9 tier combinations are covered,
 *      not just the ones R1–R4 happen to produce today.
 *
 * Run it with:
 *   npx tsx scripts/test-policy-guardrail.ts
 *
 * (npx fetches tsx automatically if it isn't installed yet — see the
 * project README for details, or run `pnpm add -D tsx` to install it
 * as a proper dev dependency.)
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
// Helpers (same corner-building helpers as scripts/test-decision-matrix.ts)
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

function makePolicy(minMFA: MFALevel): OrgPolicy {
  return {
    minMFA,
    sensitiveResourceMFA: 'phishing-resistant', // not used by the guardrail yet — kept realistic
    privilegedRoleMFA: 'phishing-resistant',
    policyStatus: 'active',
  };
}

// ---------------------------------------------------------------------------
// Test harness
// ---------------------------------------------------------------------------

let pass = 0;
let fail = 0;

function assertEqual(actual: unknown, expected: unknown, label: string) {
  if (actual === expected) {
    console.log(`    \x1b[32m✓\x1b[0m ${label}: ${String(actual)}`);
    pass++;
  } else {
    console.log(`    \x1b[31m✗ ${label}: expected ${String(expected)}, got ${String(actual)}\x1b[0m`);
    fail++;
  }
}

const MFA_OPTIONS: MFALevel[] = ['standard', 'step-up', 'phishing-resistant'];

// ---------------------------------------------------------------------------
// Part 1 — R1–R4 rule outputs vs. every policy minimum
// ---------------------------------------------------------------------------

console.log('='.repeat(74));
console.log('Organisation Policy guardrail — R1–R4 rule outputs vs. policy minimum');
console.log('='.repeat(74));

const ruleScenarios = [
  { id: 'R1', contextualAnswers: allLowRiskAnswers(), complianceAnswers: HIGH_READINESS_ANSWERS },
  { id: 'R2', contextualAnswers: allLowRiskAnswers(), complianceAnswers: LOW_READINESS_ANSWERS },
  { id: 'R3', contextualAnswers: allHighRiskAnswers(), complianceAnswers: HIGH_READINESS_ANSWERS },
  { id: 'R4', contextualAnswers: allHighRiskAnswers(), complianceAnswers: LOW_READINESS_ANSWERS },
];

for (const scenario of ruleScenarios) {
  const contextualRisk = computeContextualRisk(scenario.contextualAnswers);
  const readiness = computeReadiness(scenario.complianceAnswers);
  const profile = computeProfile(contextualRisk.level, readiness.level);
  const ruleLevel = mfaLabelToLevel(profile.rule.mfa);

  console.log(`\n${scenario.id} — rule output: ${profile.rule.mfa} (${ruleLevel})`);

  for (const minMFA of MFA_OPTIONS) {
    const policy = makePolicy(minMFA);
    const { finalLevel, guardrailApplied } = applyPolicyGuardrail(ruleLevel, policy);

    // Guardrail should fire exactly when the minimum outranks the rule's own output.
    const rank: Record<MFALevel, number> = { standard: 1, 'step-up': 2, 'phishing-resistant': 3 };
    const expectedApplied = rank[minMFA] > rank[ruleLevel];
    const expectedFinal = expectedApplied ? minMFA : ruleLevel;

    console.log(`  Minimum MFA Requirement = ${MFA_LABEL[minMFA]}`);
    assertEqual(guardrailApplied, expectedApplied, '    Guardrail applied?');
    assertEqual(finalLevel, expectedFinal, '    Final recommendation');
    // The final result must NEVER rank below the rule's own output either.
    assertEqual(rank[finalLevel] >= rank[ruleLevel], true, '    Final never weaker than rule output');
    // ...and never below the configured minimum.
    assertEqual(rank[finalLevel] >= rank[minMFA], true, '    Final never weaker than policy minimum');
  }
}

// ---------------------------------------------------------------------------
// Part 2 — full 3x3 tier matrix (covers Step-up MFA too, which R1–R4 never
// produce on their own but which the Organisation Policy page still offers)
// ---------------------------------------------------------------------------

console.log(`\n${'='.repeat(74)}`);
console.log('Full 3x3 tier matrix (rule output x policy minimum)');
console.log('='.repeat(74));

const rank: Record<MFALevel, number> = { standard: 1, 'step-up': 2, 'phishing-resistant': 3 };

for (const ruleLevel of MFA_OPTIONS) {
  for (const minMFA of MFA_OPTIONS) {
    const policy = makePolicy(minMFA);
    const { finalLevel, guardrailApplied } = applyPolicyGuardrail(ruleLevel, policy);
    const expectedApplied = rank[minMFA] > rank[ruleLevel];
    const expectedFinal = expectedApplied ? minMFA : ruleLevel;

    const label = `rule=${MFA_LABEL[ruleLevel]} (${ruleLevel})  vs  minimum=${MFA_LABEL[minMFA]} (${minMFA})`;
    console.log(`\n${label}`);
    assertEqual(guardrailApplied, expectedApplied, 'Guardrail applied?');
    assertEqual(finalLevel, expectedFinal, 'Final recommendation');
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${'='.repeat(74)}`);
console.log(`Result: ${pass} passed, ${fail} failed`);
console.log('='.repeat(74));

if (fail > 0) {
  process.exitCode = 1;
}
