# ZTrustGuard - Zero Trust MFA Decision Support Prototype

An interactive prototype for the research project **"Decision Support for Zero Trust MFA
Compliance in Banking."** It implements the five-layer conceptual framework end-to-end:
contextual risk and compliance-readiness inputs are scored, combined into a 2×2
risk-compliance profile, matched to one of four decision rules, checked against an
organisation policy guardrail, and turned into an MFA recommendation and user guidance
message — all recomputed live as you change your inputs.

Built with React 19, TypeScript, Vite, and Tailwind CSS v4.

## 1. How to run it

**Prerequisites:** Node.js 18+ and `pnpm` (or `npm`).

Run these as two separate commands (not chained with `&&`) — see the
[Windows/PowerShell note](#windows--powershell-note) below if you're on Windows.

```bash
# 1. Install dependencies
pnpm install
# (or: npm install)
```

```bash
# 2. Start the dev server
pnpm dev
# (or: npm run dev)
```

Then open the URL Vite prints (typically `http://localhost:5173`).

Other commands:

```bash
pnpm build      # production build → dist/
pnpm preview    # serve the production build locally
```

### Windows / PowerShell note

Windows PowerShell (the default shell in older Windows terminals — not the same as
"Command Prompt"/`cmd.exe`, and not PowerShell 7+) does **not** support `&&` to chain
commands; you'll see `The token '&&' is not a valid statement separator`. Fixes:

- Just run each command on its own line (`pnpm install`, then `pnpm dev`), **or**
- Chain them with `;` instead: `pnpm install; pnpm dev`, **or**
- Use `cmd.exe`, Git Bash, WSL, or PowerShell 7+ (`pwsh`), which all support `&&`.

No backend, database, or environment variables are required — everything runs client-side
in the browser, and the app resets to its default example whenever the page is refreshed
(see [Data & persistence](#4-data--persistence) below).

## 2. Project structure

```
src/
  App.tsx                     Routing shell — sidebar/header + page switch
  types.ts                    Page enum shared across the app
  components/
    Sidebar.tsx, Header.tsx   Global chrome, shown on every page
    AssessmentJourney.tsx     The clickable "Step X of 7" journey strip
  lib/
    decisionEngine.ts         All scoring + decision logic (single source of truth)
  state/
    AssessmentContext.tsx     Shared in-memory state (useAssessment() hook)
  pages/
    Dashboard.tsx              Overview + status cards
    ContextualRisk.tsx         Step 1 — 6 contextual-risk dropdowns
    ComplianceReadiness.tsx    Step 2 — 16-question Likert self-assessment
    RiskComplianceProfile.tsx  Step 3 — 2×2 risk/readiness matrix
    DecisionRules.tsx          Step 4 — R1–R4 rule table
    MFARecommendation.tsx      Step 5 — recommendation + policy check + guidance
    PractitionerReview.tsx     Step 6 — accept/override review
    EvaluationFeedback.tsx     Step 7 — outcome summary
    OrganisationPolicy.tsx     Sidebar-only settings page (not a numbered step)
```

`src/lib/decisionEngine.ts` is the important file if you want to check or change the
logic: it holds the contextual-risk fields and scoring table, the 16 readiness questions,
the four decision rules (Table 3 of the conceptual framework), and the organisation-policy
guardrail. Every page imports from here rather than keeping its own copy.

## 3. User guide — walking through the app

The app opens on the **Dashboard**, pre-loaded with a worked example (HIGH contextual
risk / LOW compliance readiness) so every page has something meaningful to show before
you've entered anything yourself.

1. **Dashboard** — Four status cards summarise the current Contextual Risk, Compliance
   Readiness, Risk–Compliance Profile, and MFA Recommendation. Click **Start assessment**
   or any step in "Your assessment journey" to jump to that page.

2. **Step 1 — Contextual Risk Assessment** — Six dropdowns (User Role, Network Context,
   Location Context, Device Type, Resource Sensitivity, Login Behaviour). Each option is
   pre-classified Low/High Risk. Changing a dropdown immediately recalculates the Risk
   Score (0–100%) and the binary HIGH/LOW classification shown on the right.

3. **Step 2 — MFA Compliance Readiness** — 16 statements answered on a five-point Likert
   scale, split across two sub-pages (Q1–8, Q9–16 — still one assessment, still "Step 2 of
   7"). Answers on both pages are kept in the same shared state, so switching between the
   two sub-pages (or navigating away and back) doesn't lose anything. The readiness
   percentage and binary HIGH/LOW READINESS result update as you answer.

4. **Step 3 — Risk–Compliance Profile** — Your Contextual Risk and Compliance Readiness
   levels are combined into one of four quadrants of the 2×2 matrix. The matching
   quadrant is highlighted as "CURRENT PROFILE," with an interpretation and a "Profile
   Summary" side panel showing both scores as ring charts.

5. **Step 4 — Decision Rules** — The rule table (R1–R4) is shown with the rule that
   matches your current profile highlighted and marked "Applied." The side panel shows a
   flow diagram from your risk/readiness inputs → the matched rule → the resulting MFA
   type.

6. **Organisation Policy** (sidebar, not a numbered step) — Set the organisation's
   Minimum MFA Requirement, Sensitive Resource MFA, and Privileged Role MFA (Standard /
   Step-up / Phishing-resistant). The "Guardrail Logic" panel shows the real decision-rule
   result, whether the policy guardrail elevates it, and the final recommendation. Try
   raising Minimum MFA Requirement above the current rule's output to see the guardrail
   trigger.

7. **Step 5 — MFA Recommendation** — Three separated sections: the final MFA
   recommendation (after the policy guardrail), the organisation policy check result, and
   the user-facing guidance message for the applied rule.

8. **Step 6 — Practitioner Review** — Review the full assessment summary, then Accept or
   Override the recommendation, answer three appropriateness questions, pick feedback
   categories, and add comments. Selecting Override reveals a required reason field. Your
   decision carries through to the next step.

9. **Step 7 — Evaluation & Feedback** — Shows a feedback summary reflecting your actual
   practitioner decision, MFA type, rule, and profile, plus your practitioner comment
   (or the override reason, if you overrode without a comment). Illustrative
   acceptance-rate metrics remain static placeholders (no real historical data source
   exists in this prototype). **Return to Dashboard** to start again or try a different
   scenario.

### Trying a different scenario end-to-end

To see the low-risk path: on Contextual Risk, pick the first (lowest-risk) option in
every dropdown; on Compliance Readiness, answer every question "Strongly Agree" or
"Agree" on both sub-pages. You should see Risk–Compliance Profile move to **Low Risk /
High Readiness**, Decision Rules highlight **R1**, and MFA Recommendation show
**Standard MFA**.

## 4. Data & persistence

All assessment answers, organisation policy settings, and the practitioner's review
decision live in a shared React context (`AssessmentProvider`) for the browser session
only:

- ✅ Survives navigating between pages (Dashboard → Contextual Risk → Dashboard →
  Contextual Risk keeps your selections)
- ❌ Does **not** survive a page refresh, and there is no backend or database — this is
  intentional for a prototype. The "Save & Continue Later" buttons are visual only.

## 5. Known limitations / deliberately out of scope

- **R1's MFA label** reads "Standard MFA" rather than the conceptual framework's "Approved
  low-friction MFA" (Table 3) — pending a written justification for that distinction.
- The Evaluation & Feedback page's four rate metrics (Recommendation Acceptance Rate,
  etc.) are illustrative placeholders; there's no historical data store to compute them
  from in this prototype.
- No authentication, multi-user support, or real backend — this is a single-session,
  client-only decision-support demonstrator for the thesis.

## 6. Verification checklist

See [VERIFICATION.md](./VERIFICATION.md) for a step-by-step script to confirm the app
builds and the decision logic behaves correctly end-to-end.
