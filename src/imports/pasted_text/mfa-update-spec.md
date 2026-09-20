UPDATE THE EXISTING ZERO TRUST MFA DECISION SUPPORT PROTOTYPE.

IMPORTANT:
Do NOT redesign the existing application.

Preserve the current:
• dark teal / green visual theme
• sidebar
• top header
• typography
• cards
• buttons
• spacing
• 7-step progress indicator
• existing navigation
• existing contextual-risk dropdown data
• existing 16 MFA Compliance Readiness questions

The purpose of this update is ONLY to improve alignment between the
existing UI workflow and the five-layer conceptual framework.

====================================================
1. KEEP THE EXISTING 7-STEP UI WORKFLOW
====================================================

The workflow remains exactly:

1 — Contextual Risk Assessment
2 — MFA Compliance Readiness
3 — Risk–Compliance Profile
4 — Decision Rules
5 — MFA Recommendation
6 — Practitioner Review
7 — Evaluation & Feedback

Do NOT create additional workflow steps.

Organisation Policy is NOT a numbered workflow step.

====================================================
2. CONTEXTUAL RISK ASSESSMENT
====================================================

Keep the existing contextual factors:

• User Role
• Network Context
• Location Context
• Device Type
• Resource Sensitivity
• Login Behaviour

Keep all existing dropdown data.

In each dropdown, show ONLY the selected value.

Example:

User Role
[ Manager ▼ ]
● Low Risk

Do NOT display:

Manager (Low Risk)

because the risk classification is already displayed underneath.

Use:

● Low Risk

in green/teal.

Use:

▲ High Risk

in red.

Do this consistently for all six contextual factors.

The final Contextual Risk classification must be binary:

LOW
or
HIGH

There is NO Medium Risk.

====================================================
3. MFA COMPLIANCE READINESS
====================================================

Keep the name:

MFA Compliance Readiness

Keep:

COMPLETED BY EMPLOYEE (SELF-ASSESSMENT)

Keep the existing 16 questions and their exact wording.

The questionnaire may remain split into:

Questions 1–8 of 16

and

Questions 9–16 of 16

Both pages remain:

Step 2 of 7

At completion, clearly show the derived result:

MFA COMPLIANCE READINESS

LOW READINESS

or

HIGH READINESS

The readiness result must be binary.

Do NOT introduce Medium Readiness.

The readiness percentage may also be displayed, but LOW/HIGH should
be visually prominent.

====================================================
4. RISK–COMPLIANCE PROFILE
====================================================

Make the relationship between the previous two assessments explicit.

At the top of the profile content show:

Contextual Risk
HIGH

+

MFA Compliance Readiness
LOW

↓

Risk–Compliance Profile
HIGH RISK / LOW READINESS

Then display the existing 2 × 2 matrix.

The matrix must contain exactly:

High Risk / Low Readiness
High Risk / High Readiness
Low Risk / Low Readiness
Low Risk / High Readiness

There is NO Medium Risk or Medium Readiness.

For the current example highlight:

HIGH RISK / LOW READINESS

====================================================
5. DECISION RULES
====================================================

Keep exactly four decision rules:

R1
Low Risk + High Readiness
→ Standard MFA
→ Minimal Friction

R2
Low Risk + Low Readiness
→ Standard MFA
→ Supportive Guidance

R3
High Risk + High Readiness
→ Step-up MFA
→ Security-Focused Explanation

R4
High Risk + Low Readiness
→ Step-up MFA
→ Salient Warning + Simple Guidance

For the current example:

Contextual Risk:
HIGH

MFA Compliance Readiness:
LOW

Profile:
HIGH RISK / LOW READINESS

Applied Rule:
R4

Highlight R4.

IMPORTANT:
Use the term:

Step-up MFA

Do NOT use:

Strong / Step-up MFA

anywhere in the application.

====================================================
6. ORGANISATION POLICY AS A GUARDRAIL
====================================================

Keep Organisation Policy as a separate sidebar page.

Do NOT add Organisation Policy to the 7-step progress indicator.

Represent its logical role as:

Decision Rule Result
        ↓
Organisation Policy Guardrail
        ↓
Final MFA Recommendation

The organisation policy defines minimum MFA requirements and may
strengthen a recommendation where required.

The final recommendation must not be weaker than the configured
organisation policy requirement.

====================================================
7. MFA RECOMMENDATION
====================================================

Update the MFA Recommendation screen so that the two decision outputs
are visually separated.

SECTION 1:

MFA RECOMMENDATION

Step-up MFA

Rule R4 applied


SECTION 2:

ORGANISATION POLICY CHECK

✓ Policy requirements satisfied

Supporting text:

The recommendation has been checked against the organisation's
configured minimum MFA requirements.


SECTION 3:

USER GUIDANCE

Salient Warning + Simple Guidance

Supporting message:

This sign-in has been identified as high risk. Additional
authentication is required to continue.

IMPORTANT:

MFA Recommendation and User Guidance are related but separate outputs.

Do not combine them into one value.

====================================================
8. PRACTITIONER REVIEW
====================================================

Keep:

Step 6 of 7

Add/retain the ownership indicator:

COMPLETED BY AUTHORISED SECURITY PRACTITIONER

The practitioner review should clearly display:

Contextual Risk:
HIGH

MFA Compliance Readiness:
LOW

Risk–Compliance Profile:
HIGH RISK / LOW READINESS

Decision Rule:
R4

MFA Recommendation:
Step-up MFA

User Guidance:
Salient Warning + Simple Guidance

Allow the practitioner to review:

• Is the MFA recommendation appropriate?
• Is the explanation clear?
• Is the user guidance appropriate?
• Accept recommendation / Override

If Override is selected, allow a reason/comment to be recorded.

====================================================
9. EVALUATION & FEEDBACK
====================================================

Keep:

Step 7 of 7

Keep evaluation measures such as:

• Recommendation Acceptance
• MFA Appropriateness
• Explanation Clarity
• User Guidance Appropriateness

Add a small section:

FEEDBACK FOR SYSTEM REFINEMENT

Supporting text:

Practitioner and evaluation feedback can be used to refine decision
rules, explanations and user guidance.

This represents the refinement feedback loop in the conceptual
framework.

Do NOT imply that the system automatically changes decision rules.

====================================================
10. CONCEPTUAL FRAMEWORK ALIGNMENT
====================================================

The existing 7 UI steps operationalise the five conceptual layers:

LAYER 1
Contextual Factors
→ Contextual Risk Assessment

LAYER 2
Behavioural Assessment
→ MFA Compliance Readiness

LAYER 3
Decision Logic
→ Risk–Compliance Profile
→ Decision Rules

ORGANISATION POLICY
→ Guardrail applied before final recommendation

LAYER 4
Decision Output
→ MFA Recommendation
→ User Guidance / Nudge

LAYER 5
Review & Evaluation
→ Practitioner Review
→ Evaluation & Feedback
→ System refinement feedback

Do NOT display "Layer 1", "Layer 2", etc. prominently on every
application screen.

The layers are the conceptual architecture.

The 7 steps are the user-facing operational workflow.

====================================================
11. DO NOT CHANGE
====================================================

Do not regenerate or redesign the entire application.

Do not change:
• existing colour theme
• existing component style
• existing sidebar structure
• existing contextual dropdown values
• existing 16 questionnaire questions
• existing navigation behaviour
• existing 7-step workflow

Do not add:
• Medium Risk
• Medium Readiness
• extra assessment steps
• extra decision rules

This is a LOGIC, TERMINOLOGY AND TRACEABILITY UPDATE to the existing
prototype, not a visual redesign.