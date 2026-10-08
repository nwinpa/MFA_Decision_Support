import { RISK_FIELDS, QUESTIONS, LIKERT, computeContextualRisk, computeReadiness, computeProfile, applyPolicyGuardrail, mfaLabelToLevel, type OrgPolicy } from '../src/lib/decisionEngine';

// Fixed example input: high risk, low readiness (default walkthrough)
const risk: Record<string, string> = {};
RISK_FIELDS.forEach(f => { risk[f.id] = f.options[f.options.length - 1].value; });
const ready: Record<number, string> = {};
QUESTIONS.forEach((_, i) => { ready[i] = LIKERT[1]; });
const policy: OrgPolicy = { minMFA: 'step-up', sensitiveResourceMFA: 'standard', privilegedRoleMFA: 'standard', policyStatus: 'active' };

function decide() {
  const r = computeContextualRisk(risk);
  const rd = computeReadiness(ready);
  const p = computeProfile(r.level, rd.level);
  return applyPolicyGuardrail(mfaLabelToLevel(p.rule.mfa), policy);
}

const N = 100000;
for (let i = 0; i < 5000; i++) decide();           // warm-up
const times: number[] = [];
for (let k = 0; k < 5; k++) {                      // 5 repeats
  const t0 = performance.now();
  for (let i = 0; i < N; i++) decide();
  times.push(performance.now() - t0);
}
times.forEach((t, k) => console.log(`Run ${k + 1}: ${N} decisions in ${t.toFixed(1)} ms = ${(t / N * 1000).toFixed(2)} microseconds each`));
const mean = times.reduce((a, b) => a + b, 0) / times.length;
console.log(`Mean: ${(mean / N * 1000).toFixed(2)} microseconds per decision`);
