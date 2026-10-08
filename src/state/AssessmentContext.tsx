import { createContext, useContext, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import {
  DEFAULT_CONTEXTUAL_ANSWERS,
  DEFAULT_COMPLIANCE_ANSWERS,
  computeContextualRisk,
  computeReadiness,
  computeProfile,
  applyPolicyGuardrail,
  mfaLabelToLevel,
  type ContextualRiskResult,
  type ReadinessResult,
  type ProfileResult,
  type OrgPolicy,
  type PolicyCheckResult,
} from '../lib/decisionEngine';

// Shared, in-memory (session-only) state for the whole assessment journey.
// Lifting this above the page components means answers, policy settings and
// the practitioner's review decision all survive navigating between pages —
// each page previously owned this as local useState, which reset on
// navigation because App.tsx unmounts the outgoing page component.
//
// Nothing here persists across a page refresh (no localStorage/backend) —
// that's intentional for this prototype.

export type PractitionerDecision = 'accept' | 'override' | null;

<<<<<<< HEAD
=======
// One entry in the session decision record, written when a review is submitted.
// Held in memory only: it is cleared when the page is refreshed.
export interface DecisionRecord {
  recordedAt: string; // ISO timestamp
  ruleId: string;
  riskScore: number;
  riskLevel: string;
  readinessPct: number;
  readinessLevel: string;
  ruleMfa: string;
  finalMfa: string;
  guardrailApplied: boolean;
  decision: 'accept' | 'override';
  overrideReason: string;
  comments: string;
}

>>>>>>> ad84745 (Update ZT-MFA DSS prototype)
export interface PractitionerReviewState {
  decision: PractitionerDecision;
  appropriate: boolean | null;
  explanationClear: boolean | null;
  guidanceAppropriate: boolean | null;
  selectedCategories: string[];
  comments: string;
  overrideReason: string;
}

const DEFAULT_PRACTITIONER_REVIEW: PractitionerReviewState = {
  decision: null,
  appropriate: null,
  explanationClear: null,
  guidanceAppropriate: null,
  selectedCategories: [],
  comments: '',
  overrideReason: '',
};

const DEFAULT_ORG_POLICY: OrgPolicy = {
  minMFA: 'standard',
  sensitiveResourceMFA: 'phishing-resistant',
  privilegedRoleMFA: 'phishing-resistant',
  policyStatus: 'active',
};

interface AssessmentContextValue {
  contextualAnswers: Record<string, string>;
  setContextualAnswers: Dispatch<SetStateAction<Record<string, string>>>;
  complianceAnswers: Record<number, string>;
  setComplianceAnswers: Dispatch<SetStateAction<Record<number, string>>>;
  orgPolicy: OrgPolicy;
  setOrgPolicy: Dispatch<SetStateAction<OrgPolicy>>;
  practitionerReview: PractitionerReviewState;
  setPractitionerReview: Dispatch<SetStateAction<PractitionerReviewState>>;
<<<<<<< HEAD
=======
  decisionRecord: DecisionRecord | null;
  setDecisionRecord: Dispatch<SetStateAction<DecisionRecord | null>>;
>>>>>>> ad84745 (Update ZT-MFA DSS prototype)

  // Derived (Layer 3: Decision Logic), recomputed whenever their inputs change.
  contextualRisk: ContextualRiskResult;
  readiness: ReadinessResult;
  profile: ProfileResult;
  policyCheck: PolicyCheckResult;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [contextualAnswers, setContextualAnswers] = useState<Record<string, string>>(DEFAULT_CONTEXTUAL_ANSWERS);
  const [complianceAnswers, setComplianceAnswers] = useState<Record<number, string>>(DEFAULT_COMPLIANCE_ANSWERS);
  const [orgPolicy, setOrgPolicy] = useState<OrgPolicy>(DEFAULT_ORG_POLICY);
  const [practitionerReview, setPractitionerReview] = useState<PractitionerReviewState>(DEFAULT_PRACTITIONER_REVIEW);
<<<<<<< HEAD
=======
  const [decisionRecord, setDecisionRecord] = useState<DecisionRecord | null>(null);
>>>>>>> ad84745 (Update ZT-MFA DSS prototype)

  const contextualRisk = useMemo(() => computeContextualRisk(contextualAnswers), [contextualAnswers]);
  const readiness = useMemo(() => computeReadiness(complianceAnswers), [complianceAnswers]);
  const profile = useMemo(
    () => computeProfile(contextualRisk.level, readiness.level),
    [contextualRisk.level, readiness.level]
  );
  const policyCheck = useMemo(
    () => applyPolicyGuardrail(mfaLabelToLevel(profile.rule.mfa), orgPolicy),
    [profile.rule.mfa, orgPolicy]
  );

  const value: AssessmentContextValue = {
    contextualAnswers,
    setContextualAnswers,
    complianceAnswers,
    setComplianceAnswers,
    orgPolicy,
    setOrgPolicy,
    practitionerReview,
    setPractitionerReview,
<<<<<<< HEAD
=======
    decisionRecord,
    setDecisionRecord,
>>>>>>> ad84745 (Update ZT-MFA DSS prototype)
    contextualRisk,
    readiness,
    profile,
    policyCheck,
  };

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
}

export function useAssessment(): AssessmentContextValue {
  const ctx = useContext(AssessmentContext);
  if (!ctx) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return ctx;
}
