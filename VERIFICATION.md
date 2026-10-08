# Verification steps

These steps confirm (1) the project builds cleanly, and (2) the decision logic is wired
correctly end-to-end — i.e. changing your inputs on Contextual Risk / Compliance
Readiness actually changes every downstream page, rather than always showing the
original HIGH-Risk/LOW-Readiness example.

## A. Build checks

```bash
pnpm install
npx tsc --noEmit     # should report no errors
pnpm build           # should complete with "✓ built in ...ms" and no errors
pnpm dev             # start the app at the printed local URL
```

## B. Default (worked) example

On first load, without changing anything:

| Page | Expected |
|---|---|
| Dashboard | CURRENT RISK: **HIGH**, COMPLIANCE READINESS: **LOW**, RISK–COMPLIANCE PROFILE: **HIGH RISK / LOW READINESS**, MFA RECOMMENDATION: **PHISHING-RESISTANT MFA** |
| Contextual Risk | Risk Score ≈ 73/100, **HIGH** |
| Compliance Readiness | Readiness ≈ 34%, **LOW READINESS** |
| Risk–Compliance Profile | Top-left quadrant marked **CURRENT PROFILE** |
| Decision Rules | **R4** row highlighted "Applied," MFA = Phishing-resistant MFA |
| MFA Recommendation | Section 1 shows **Phishing-resistant MFA**, Rule R4 applied |
| Organisation Policy | Decision Rule Result: Phishing-resistant MFA · Rule R4; "Policy requirements satisfied" (default minimum is Standard) |

## C. Low-risk / high-readiness path (confirms the engine actually recomputes)

1. Go to **Contextual Risk**. Set every dropdown to its first (lowest-risk) option:
   - User Role → Customer
   - Network Context → Corporate Network
   - Location Context → Known Location
   - Device Type → Managed Corporate Device
   - Resource Sensitivity → Public
   - Login Behaviour → Expected login pattern

   ✅ Risk Score should drop to **LOW** (well under 50).

2. Go to **Compliance Readiness**. Answer all 16 questions **"Strongly Agree"** (both
   Q1–8 and Q9–16 sub-pages).

   ✅ Readiness should show **100%**, **HIGH READINESS**.

3. Go to **Risk–Compliance Profile**.

   ✅ The **bottom-right** quadrant ("LOW RISK / HIGH READINESS") should now be marked
   CURRENT PROFILE, not the original top-left one.

4. Go to **Decision Rules**.

   ✅ **R1** should now be highlighted "Applied," with MFA = **Standard MFA**, Guidance =
   **Minimal Friction**.

5. Go to **MFA Recommendation**.

   ✅ Section 1 should show **Standard MFA**, "Rule R1 applied." Section 3 guidance should
   read the Minimal Friction message.

6. Go to **Dashboard**.

   ✅ All four status cards should reflect the new LOW/HIGH/R1/Standard MFA outcome —
   not the original example.

## D. State persists across navigation

1. On Contextual Risk, change one dropdown (e.g. User Role → System Administrator).
2. Navigate to Dashboard, then back to Contextual Risk.

   ✅ Your selection (System Administrator) should still be selected — it should **not**
   have reset to the default.

3. Repeat for Compliance Readiness: answer a few questions, navigate away and back
   (including switching to the other question sub-page and back).

   ✅ Previously-answered questions should remain answered, and the "X / 16 Answered"
   counter should reflect the combined total across both sub-pages.

## E. Organisation Policy guardrail

1. Go to **Organisation Policy**.
2. Set **Minimum MFA Requirement** to **Phishing-resistant MFA**.
3. Go back to **Contextual Risk** and set all dropdowns to low-risk (as in step C above),
   and **Compliance Readiness** to all "Strongly Agree" — this makes the decision rule
   R1 (Standard MFA).
4. Return to **Organisation Policy**.

   ✅ "Decision Rule Result" should show **Standard MFA · Rule R1**, but "Final
   Recommendation" should show **Phishing-resistant MFA**, and the amber "Guardrail
   elevated recommendation" panel should be visible — confirming the final recommendation
   is never weaker than the configured organisation minimum.
5. Go to **MFA Recommendation**.

   ✅ Section 2 (Organisation Policy Check) should show the "⚠ Guardrail elevated
   recommendation" message, explaining that R1 proposed Standard MFA but the policy
   minimum raised it to Phishing-resistant MFA.

## F. Practitioner Review → Evaluation & Feedback carry-through

1. On **Practitioner Review**, select **Override**, fill in an override reason, answer
   the three Yes/No questions, and add a practitioner comment.
2. Submit and land on **Evaluation & Feedback**.

   ✅ "Practitioner decision" should read **Overridden**, and the Practitioner Comments
   panel should show the exact comment you typed (not the original placeholder text).

If all of A–F pass, the decision engine, shared state, and every downstream page are
correctly wired end-to-end.
<<<<<<< HEAD
=======

## Changes after the Round 2 and Round 3 ChatGPT interviews

1. **"Why this recommendation" panel** (MFA Recommendation screen): shows the risk score and threshold, the high-risk answers, the readiness score and threshold, the rule applied and the policy check. It only describes values the engine already computes (`explainRecommendation` in `src/lib/decisionEngine.ts`).
2. **Required override reason and session decision record** (Practitioner Review and Evaluation screens): Submit is disabled until a decision is chosen, and an override needs a written reason. A decision record is shown on the Evaluation screen. It is held in memory only and is cleared on refresh.
3. **Boundary tests** (`scripts/test-boundaries.ts`, 21 checks): all 12,500 risk answer combinations, every readiness total from 0 to 64 points, the four rules at both 50% edges, the guardrail never lowering a result, and the explanation text. Run with `npx tsx scripts/test-boundaries.ts`.

Known behaviour documented by the new tests: unanswered readiness items are ignored, not counted as zero (one "Neutral" answer gives 50% and HIGH READINESS).
>>>>>>> ad84745 (Update ZT-MFA DSS prototype)
