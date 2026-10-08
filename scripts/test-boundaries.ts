/**
 * Boundary tests for the Zero Trust MFA Decision Support System MFA Decision Support Prototype.
 *
 * Purpose: check the exact edge of the two 50% thresholds, the way the four
 * rules combine at those edges, the "guardrail never lowers" property, and the
 * plain-language explanation. These cases were not covered by the earlier
 * scripts (test-decision-matrix, test-final-recommendation-fixed,
 * test-policy-guardrail).
 *
 * Run it with:
 *   npx tsx scripts/test-boundaries.ts
 */
import {
  RISK_FIELDS,
  RISK_SCORES,
  MAX_SCORE,
  RISK_THRESHOLD_PCT,
  READINESS_THRESHOLD_PCT,
  QUESTIONS,
  LIKERT,
  computeContextualRisk,
  computeReadiness,
  computeProfile,
  applyPolicyGuardrail,
  explainRecommendation,
  levelRank,
  MFA_LABEL,
  type MFALevel,
  type OrgPolicy,
} from '../src/lib/decisionEngine';

let pass = 0;
let fail = 0;
function check(ok: boolean, label: string, detail = '') {
  if (ok) { pass++; console.log(`  PASS  ${label}`); }
  else { fail++; console.log(`  FAIL  ${label}${detail ? '  ' + detail : ''}`); }
}
function section(title: string) { console.log(`\n${title}\n${'-'.repeat(title.length)}`); }

// ---------------------------------------------------------------------------
// 1. Risk threshold: every possible combination of the six answers (12,500)
// ---------------------------------------------------------------------------
section('1. Risk threshold (all 12,500 answer combinations)');
const ids = Object.keys(RISK_SCORES);
const optionLists = ids.map(id => Object.keys(RISK_SCORES[id]));
let combos = 0, mismatches = 0;
let rawAtBelow: Record<string, string> | null = null; // raw score 14
let rawAtEdge: Record<string, string> | null = null;  // raw score 15
const edgeRaw = Math.ceil((RISK_THRESHOLD_PCT / 100) * MAX_SCORE); // 15
function walk(i: number, picked: string[]) {
  if (i === ids.length) {
    const answers: Record<string, string> = {};
    ids.forEach((id, k) => (answers[id] = picked[k]));
    const raw = ids.reduce((s, id, k) => s + RISK_SCORES[id][picked[k]], 0);
    const result = computeContextualRisk(answers);
    combos++;
    if ((result.level === 'HIGH') !== (raw >= edgeRaw)) mismatches++;
    if (raw === edgeRaw - 1 && !rawAtBelow) rawAtBelow = answers;
    if (raw === edgeRaw && !rawAtEdge) rawAtEdge = answers;
    return;
  }
  for (const o of optionLists[i]) walk(i + 1, [...picked, o]);
}
walk(0, []);
check(combos === 12500, 'Number of combinations is 12,500', `got ${combos}`);
check(mismatches === 0, `HIGH exactly when raw score >= ${edgeRaw} of ${MAX_SCORE}`, `${mismatches} mismatches`);
check(rawAtBelow !== null && computeContextualRisk(rawAtBelow).score === 47 && computeContextualRisk(rawAtBelow).level === 'LOW',
  'Raw 14 of 30 gives 47% and LOW');
check(rawAtEdge !== null && computeContextualRisk(rawAtEdge).score === 50 && computeContextualRisk(rawAtEdge).level === 'HIGH',
  'Raw 15 of 30 gives exactly 50% and HIGH (threshold is inclusive)');

// ---------------------------------------------------------------------------
// 2. Readiness threshold: every total from 0 to 64 points over 16 answers
// ---------------------------------------------------------------------------
section('2. Readiness threshold (every total from 0 to 64 points)');
function answersWithPoints(points: number): Record<number, string> {
  const a: Record<number, string> = {};
  let left = points;
  for (let i = 0; i < QUESTIONS.length; i++) {
    const v = Math.min(4, left);
    a[i] = LIKERT[v];
    left -= v;
  }
  return a;
}
let rBad = 0;
for (let pts = 0; pts <= QUESTIONS.length * 4; pts++) {
  const r = computeReadiness(answersWithPoints(pts));
  const expectHigh = pts >= (READINESS_THRESHOLD_PCT / 100) * QUESTIONS.length * 4; // 32
  if ((r.level === 'HIGH READINESS') !== expectHigh) rBad++;
}
check(rBad === 0, 'HIGH READINESS exactly when total points >= 32 of 64', `${rBad} mismatches`);
check(computeReadiness(answersWithPoints(31)).pct === 48 && computeReadiness(answersWithPoints(31)).level === 'LOW READINESS',
  '31 of 64 points gives 48% and LOW READINESS');
check(computeReadiness(answersWithPoints(32)).pct === 50 && computeReadiness(answersWithPoints(32)).level === 'HIGH READINESS',
  '32 of 64 points gives exactly 50% and HIGH READINESS (threshold is inclusive)');
const none = computeReadiness({});
check(none.pct === 0 && none.level === 'LOW READINESS', 'No answers gives 0% and LOW READINESS');
// Documents CURRENT behaviour: only answered items are averaged (a known limitation).
const one = computeReadiness({ 0: 'Neutral' });
console.log(`  NOTE  One answer ("Neutral") gives ${one.pct}% and ${one.level}: unanswered items are ignored, not counted as zero.`);

// ---------------------------------------------------------------------------
// 3. Rules at the edges of both thresholds
// ---------------------------------------------------------------------------
section('3. Rules at the edges of both thresholds');
function riskAnswers(raw: number): Record<string, string> {
  // find any combination with this raw score
  let found: Record<string, string> | null = null;
  const go = (i: number, picked: string[], sum: number) => {
    if (found) return;
    if (i === ids.length) { if (sum === raw) { found = {}; ids.forEach((id, k) => (found![id] = picked[k])); } return; }
    for (const o of optionLists[i]) go(i + 1, [...picked, o], sum + RISK_SCORES[id_(i)][o]);
  };
  const id_ = (i: number) => ids[i];
  go(0, [], 0);
  return found!;
}
const cases: [number, number, string][] = [
  [15, 31, 'R4'], // risk exactly 50% (HIGH), readiness 48% (LOW)
  [15, 32, 'R3'], // both exactly at threshold (HIGH, HIGH)
  [14, 31, 'R2'], // both just below (LOW, LOW)
  [14, 32, 'R1'], // risk just below, readiness at threshold (LOW, HIGH)
];
for (const [raw, pts, expected] of cases) {
  const risk = computeContextualRisk(riskAnswers(raw));
  const ready = computeReadiness(answersWithPoints(pts));
  const rule = computeProfile(risk.level, ready.level).rule.id;
  check(rule === expected, `Risk ${risk.score}% + readiness ${ready.pct}% gives ${expected}`, `got ${rule}`);
}

// ---------------------------------------------------------------------------
// 4. Policy guardrail never lowers a recommendation
// ---------------------------------------------------------------------------
section('4. Policy guardrail never lowers a recommendation (all 9 combinations)');
const levels: MFALevel[] = ['standard', 'step-up', 'phishing-resistant'];
let lowered = 0;
for (const ruleLevel of levels) {
  for (const minMFA of levels) {
    const policy: OrgPolicy = { minMFA, sensitiveResourceMFA: 'phishing-resistant', privilegedRoleMFA: 'phishing-resistant', policyStatus: 'active' };
    const { finalLevel } = applyPolicyGuardrail(ruleLevel, policy);
    if (levelRank[finalLevel] < levelRank[ruleLevel] || levelRank[finalLevel] < levelRank[minMFA]) lowered++;
  }
}
check(lowered === 0, 'Final level is never below the rule result or the policy minimum', `${lowered} cases lowered`);

// ---------------------------------------------------------------------------
// 5. Explanation matches the computed result
// ---------------------------------------------------------------------------
section('5. Explanation text matches the computed result');
const defaultHigh = { role: 'Manager', network: 'Public Wi-Fi', location: 'Unknown', device: 'Unregistered Device', sensitivity: 'Confidential', login: 'Unfamiliar sign-in location' };
const riskA = computeContextualRisk(defaultHigh);
const readyA = computeReadiness(answersWithPoints(20));
const profA = computeProfile(riskA.level, readyA.level);
const policyStd: OrgPolicy = { minMFA: 'standard', sensitiveResourceMFA: 'phishing-resistant', privilegedRoleMFA: 'phishing-resistant', policyStatus: 'active' };
const checkStd = applyPolicyGuardrail('phishing-resistant', policyStd);
const exA = explainRecommendation(defaultHigh, riskA, readyA, profA, policyStd, checkStd);
check(exA.riskDrivers.length === riskA.highRiskFields.length, 'Lists every high-risk answer');
check(exA.riskDrivers.every(d => Object.values(defaultHigh).includes(d.value)), 'High-risk answers quote the user\'s own values');
check(exA.riskLine.includes(`${riskA.score}%`) && exA.riskLine.includes(riskA.level), 'Risk line shows the score and level');
check(exA.readinessLine.includes(`${readyA.pct}%`) && exA.readinessLine.includes('LOW'), 'Readiness line shows the score and level');
check(exA.ruleLine.includes(profA.rule.id), 'Rule line names the applied rule');
check(exA.policyLine.includes('no change was needed'), 'Policy line says no change when the minimum is met');
const policyPR: OrgPolicy = { ...policyStd, minMFA: 'phishing-resistant' };
const lowRisk = { role: 'Customer', network: 'Corporate Network', location: 'Known Location', device: 'Managed Corporate Device', sensitivity: 'Public', login: 'Expected login pattern' };
const riskB = computeContextualRisk(lowRisk);
const readyB = computeReadiness(answersWithPoints(60));
const profB = computeProfile(riskB.level, readyB.level);
const checkPR = applyPolicyGuardrail('standard', policyPR);
const exB = explainRecommendation(lowRisk, riskB, readyB, profB, policyPR, checkPR);
check(profB.rule.id === 'R1' && exB.riskDrivers.length === 0, 'Scenario B: rule R1 and no high-risk answers');
check(exB.policyLine.includes('raised to ' + MFA_LABEL['phishing-resistant']), 'Policy line says the recommendation was raised when the guardrail fires');

console.log(`\n${'='.repeat(70)}\nResult: ${pass} passed, ${fail} failed\n${'='.repeat(70)}`);
if (fail > 0) process.exitCode = 1;
