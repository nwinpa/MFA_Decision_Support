import { useState } from 'react';
import { Page } from '../types';
import AssessmentJourney from '../components/AssessmentJourney';
import { useAssessment } from '../state/AssessmentContext';
import { QUESTIONS, LIKERT } from '../lib/decisionEngine';

interface ComplianceReadinessProps {
  navigate: (page: Page) => void;
  currentPage: Page;
}

export default function ComplianceReadiness({ navigate, currentPage }: ComplianceReadinessProps) {
  const { complianceAnswers: answers, setComplianceAnswers: setAnswers, readiness } = useAssessment();
  const [questionPage, setQuestionPage] = useState<1 | 2>(1);

  const { answeredCount, pct: readinessPct, level: readinessLevel } = readiness;
  const readinessColor = readinessPct >= 50 ? '#008A62' : '#1677E8';

  const pageQuestions = questionPage === 1 ? QUESTIONS.slice(0, 8) : QUESTIONS.slice(8, 16);
  const pageOffset = questionPage === 1 ? 0 : 8;

  const QuestionRow = ({ q, i }: { q: string; i: number }) => (
    <div
      className="grid px-5 py-3 items-center transition-colors"
      style={{
        gridTemplateColumns: '2fr repeat(5, 1fr)',
        borderBottom: i < pageQuestions.length - 1 ? '1px solid #F0F4F6' : 'none',
        background: answers[pageOffset + i] ? 'rgba(15,139,131,0.02)' : '#FFFFFF',
      }}
    >
      <div className="flex items-start gap-2.5 pr-4">
        <span
          className="flex-shrink-0 text-xs font-semibold w-7 h-7 rounded-full flex items-center justify-center"
          style={{
            background: answers[pageOffset + i] ? '#0F8B83' : '#F0F4F6',
            color: answers[pageOffset + i] ? '#FFFFFF' : '#66818C',
          }}
        >
          Q{pageOffset + i + 1}
        </span>
        <span className="text-sm leading-snug" style={{ color: '#102631' }}>{q}</span>
      </div>
      {LIKERT.map(option => (
        <div key={option} className="flex justify-center">
          <button
            onClick={() => setAnswers(prev => ({ ...prev, [pageOffset + i]: option }))}
            className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
            style={{
              borderColor: answers[pageOffset + i] === option ? '#0F8B83' : '#DCE8EB',
              background: answers[pageOffset + i] === option ? '#0F8B83' : 'transparent',
            }}
          >
            {answers[pageOffset + i] === option && (
              <div className="w-2 h-2 rounded-full" style={{ background: '#FFFFFF' }} />
            )}
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-5">
      <AssessmentJourney currentPage={currentPage} navigate={navigate} />

      {/* Self-assessment ownership banner */}
      <div
        className="rounded-xl px-4 py-3 flex items-start gap-3"
        style={{ background: '#F0FBF9', border: '1px solid #A7F3D0' }}
      >
        <div className="flex-shrink-0 mt-0.5">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="5" r="3" stroke="#0F8B83" strokeWidth="1.5"/>
            <path d="M2 14C2 11.239 4.686 9 8 9C11.314 9 14 11.239 14 14"
              stroke="#0F8B83" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wider mb-0.5" style={{ color: '#073F40' }}>
            COMPLETED BY EMPLOYEE (SELF-ASSESSMENT)
          </p>
          <p className="text-xs leading-snug" style={{ color: '#66818C' }}>
            Complete all 16 questions below. Your responses are used to determine your MFA
            compliance readiness.
          </p>
        </div>
      </div>

      <div
        className="rounded-xl"
        style={{ background: '#FFFFFF', border: '1px solid #DCE8EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        {/* Card header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid #DCE8EB' }}
        >
          <div>
            <h3 className="text-sm font-semibold" style={{ color: '#102631' }}>
              MFA Compliance Readiness
            </h3>
            <p className="text-xs mt-0.5" style={{ color: '#66818C' }}>
              Questions {questionPage === 1 ? '1–8' : '9–16'} of 16 · Rate your agreement
              with each statement.
            </p>
          </div>

          {/* Prominent progress summary */}
          <div className="flex items-center gap-5">
            <div className="text-right">
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-xl font-bold" style={{ color: '#102631' }}>
                  {answeredCount}
                </span>
                <span className="text-base font-semibold" style={{ color: '#66818C' }}>
                  / 16
                </span>
              </div>
              <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: '#66818C' }}>
                Answered
              </p>
            </div>

            <div
              className="w-px self-stretch"
              style={{ background: '#DCE8EB' }}
            />

            <div className="text-right">
              <p
                className="text-2xl font-bold leading-none"
                style={{ color: answeredCount > 0 ? readinessColor : '#66818C' }}
              >
                {readinessPct}%
              </p>
              <p
                className="text-[10px] font-semibold tracking-widest uppercase mt-0.5"
                style={{ color: answeredCount > 0 ? readinessColor : '#66818C' }}
              >
                Readiness
              </p>
            </div>

            {/* Circular progress ring */}
            <div className="relative" style={{ width: 44, height: 44 }}>
              <svg width="44" height="44" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="#DCE8EB" strokeWidth="4"/>
                <circle
                  cx="22" cy="22" r="18"
                  fill="none"
                  stroke="#0F8B83"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(answeredCount / 16) * 113.1} 113.1`}
                  transform="rotate(-90 22 22)"
                />
              </svg>
              <div
                className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                style={{ color: '#102631' }}
              >
                {answeredCount}
              </div>
            </div>
          </div>
        </div>

        {/* Readiness level strip (visible when some answered) */}
        {answeredCount > 0 && (
          <div
            className="px-5 py-2 flex items-center gap-2"
            style={{
              borderBottom: '1px solid #DCE8EB',
              background: readinessPct >= 50 ? 'rgba(0,138,98,0.04)' : 'rgba(22,119,232,0.04)',
            }}
          >
            <span className="text-xs font-semibold" style={{ color: readinessColor }}>
              {readinessLevel}
            </span>
            <span className="text-xs" style={{ color: '#66818C' }}>
              · based on {answeredCount} answered question{answeredCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Likert column headers */}
        <div
          className="grid px-5 py-2 text-xs font-medium"
          style={{
            gridTemplateColumns: '2fr repeat(5, 1fr)',
            borderBottom: '1px solid #DCE8EB',
            color: '#66818C',
            background: '#F5F8FA',
          }}
        >
          <span>Question</span>
          {LIKERT.map(l => (
            <span key={l} className="text-center">{l}</span>
          ))}
        </div>

        {/* Questions for this page */}
        <div>
          {pageQuestions.map((q, i) => (
            <QuestionRow key={pageOffset + i} q={q} i={i} />
          ))}
        </div>

        {/* Page navigation buttons */}
        <div
          className="flex justify-between items-center px-5 py-4"
          style={{ borderTop: '1px solid #DCE8EB' }}
        >
          {questionPage === 1 ? (
            <button
              onClick={() => navigate('contextual-risk')}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: '#F5F8FA', color: '#66818C', border: '1px solid #DCE8EB' }}
            >
              ← Back to Contextual Risk Assessment
            </button>
          ) : (
            <button
              onClick={() => setQuestionPage(1)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: '#F5F8FA', color: '#66818C', border: '1px solid #DCE8EB' }}
            >
              ← Questions 1–8
            </button>
          )}

          <div className="flex gap-3">
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: '#F5F8FA', color: '#66818C', border: '1px solid #DCE8EB' }}
            >
              Save &amp; Continue Later
            </button>

            {questionPage === 1 ? (
              <button
                onClick={() => setQuestionPage(2)}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{ background: '#0F8B83', color: '#FFFFFF' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#0a7570')}
                onMouseLeave={e => (e.currentTarget.style.background = '#0F8B83')}
              >
                Next: Questions 9–16 →
              </button>
            ) : (
              <>
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ background: '#F5F8FA', color: '#0F8B83', border: '1px solid #0F8B83' }}
                >
                  View Results
                </button>
                <button
                  onClick={() => navigate('risk-compliance-profile')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{ background: '#0F8B83', color: '#FFFFFF' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#0a7570')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#0F8B83')}
                >
                  View Results / Continue →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
