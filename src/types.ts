export type Page =
  | 'dashboard'
  | 'contextual-risk'
  | 'compliance-readiness'
  | 'risk-compliance-profile'
  | 'decision-rules'
  | 'organisation-policy'
  | 'mfa-recommendation'
  | 'practitioner-review'
  | 'evaluation-feedback';

export interface NavigateProps {
  navigate: (page: Page) => void;
  currentPage: Page;
}
