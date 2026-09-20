import { useState } from 'react';
import { Page } from './types';
import { AssessmentProvider } from './state/AssessmentContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ContextualRisk from './pages/ContextualRisk';
import ComplianceReadiness from './pages/ComplianceReadiness';
import RiskComplianceProfile from './pages/RiskComplianceProfile';
import DecisionRules from './pages/DecisionRules';
import OrganisationPolicy from './pages/OrganisationPolicy';
import MFARecommendation from './pages/MFARecommendation';
import PractitionerReview from './pages/PractitionerReview';
import EvaluationFeedback from './pages/EvaluationFeedback';

const SIDEBAR_W = 240;
const HEADER_H = 60;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    const props = { navigate, currentPage };
    switch (currentPage) {
      case 'dashboard': return <Dashboard {...props} />;
      case 'contextual-risk': return <ContextualRisk {...props} />;
      case 'compliance-readiness': return <ComplianceReadiness {...props} />;
      case 'risk-compliance-profile': return <RiskComplianceProfile {...props} />;
      case 'decision-rules': return <DecisionRules {...props} />;
      case 'organisation-policy': return <OrganisationPolicy navigate={navigate} />;
      case 'mfa-recommendation': return <MFARecommendation {...props} />;
      case 'practitioner-review': return <PractitionerReview {...props} />;
      case 'evaluation-feedback': return <EvaluationFeedback {...props} />;
    }
  };

  return (
    <AssessmentProvider>
      <div className="min-h-screen" style={{ background: '#F5F8FA' }}>
        <Sidebar currentPage={currentPage} navigate={navigate} />
        <Header currentPage={currentPage} />

        <main
          style={{
            marginLeft: SIDEBAR_W,
            paddingTop: HEADER_H + 24,
            paddingBottom: 32,
            paddingLeft: 24,
            paddingRight: 24,
            minHeight: '100vh',
          }}
        >
          {renderPage()}
        </main>
      </div>
    </AssessmentProvider>
  );
}
