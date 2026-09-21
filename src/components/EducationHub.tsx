'use client';

import React, { useState } from 'react';
import { BookOpen, Award, Check, X, ArrowRight, ShieldCheck, HelpCircle, ChevronRight, Clock, AlertTriangle } from 'lucide-react';
import { EDUCATION_ARTICLES, QUIZ_QUESTIONS } from '@/lib/education-data';
import { EducationArticle } from '@/lib/types';

export default function EducationHub() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'fundamentals' | 'investing' | 'security'>('all');
  const [activeArticle, setActiveArticle] = useState<EducationArticle | null>(null);

  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const filteredArticles = selectedCategory === 'all'
    ? EDUCATION_ARTICLES
    : EDUCATION_ARTICLES.filter((a) => a.category === selectedCategory);

  const currentQuestion = QUIZ_QUESTIONS[currentQuizIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <section id="education" className="section-wrapper" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <BookOpen size={14} />
            <span>Bitcoin Academy</span>
          </div>
          <h2 className="section-title">Learn at Your Own Pace</h2>
          <p className="section-subtitle">
            Solid financial literacy is the best hedge against scams and panic-selling. Explore our free foundational guides and test your knowledge.
          </p>
        </div>

        {/* Category Filters */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '2.5rem',
          }}
        >
          {(['all', 'fundamentals', 'investing', 'security'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                background: selectedCategory === cat ? 'var(--brand-btc)' : 'var(--bg-surface)',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-muted)',
                border: '1px solid',
                borderColor: selectedCategory === cat ? 'var(--brand-btc)' : 'var(--border-subtle)',
                transition: 'all 0.15s ease',
              }}
            >
              {cat === 'all' ? 'All Guides' : cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '4.5rem',
          }}
        >
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="glass-card"
              style={{
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span
                    className="pill"
                    style={{
                      background:
                        article.category === 'fundamentals'
                          ? 'rgba(59, 130, 246, 0.12)'
                          : article.category === 'investing'
                          ? 'rgba(236, 121, 107, 0.12)'
                          : 'rgba(16, 185, 129, 0.12)',
                      color:
                        article.category === 'fundamentals'
                          ? 'var(--brand-info)'
                          : article.category === 'investing'
                          ? 'var(--brand-btc)'
                          : 'var(--brand-success)',
                      textTransform: 'capitalize',
                    }}
                  >
                    {article.category}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <Clock size={13} />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  {article.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {article.summary}
                </p>
              </div>

              <div>
                <button
                  onClick={() => setActiveArticle(article)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: 'var(--brand-btc)',
                    cursor: 'pointer',
                  }}
                >
                  <span>Read Key Takeaways</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Knowledge Check Quiz Box */}
        <div
          className="glass-card"
          style={{
            maxWidth: '840px',
            margin: '0 auto',
            padding: '2.5rem',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '0.5rem',
                  background: 'var(--brand-btc)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Award size={18} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Quick Knowledge Check</h3>
            </div>
            {!quizFinished && (
              <span className="pill pill-btc">
                Question {currentQuizIndex + 1} of {QUIZ_QUESTIONS.length}
              </span>
            )}
          </div>

          {!quizFinished ? (
            <div>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                {currentQuestion.question}
              </p>

              {/* Options List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {currentQuestion.options.map((opt, idx) => {
                  let borderStyle = '1px solid var(--border-subtle)';
                  let bgStyle = 'var(--bg-surface)';

                  if (isAnswerSubmitted) {
                    if (idx === currentQuestion.correctIndex) {
                      borderStyle = '1px solid var(--brand-success)';
                      bgStyle = 'var(--brand-success-bg)';
                    } else if (selectedOption === idx) {
                      borderStyle = '1px solid var(--brand-danger)';
                      bgStyle = 'var(--brand-danger-bg)';
                    }
                  } else if (selectedOption === idx) {
                    borderStyle = '1px solid var(--brand-btc)';
                    bgStyle = 'rgba(236, 121, 107, 0.08)';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      style={{
                        padding: '1rem 1.25rem',
                        borderRadius: '0.65rem',
                        textAlign: 'left',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        border: borderStyle,
                        background: bgStyle,
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: isAnswerSubmitted ? 'default' : 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span>{opt}</span>
                      {isAnswerSubmitted && idx === currentQuestion.correctIndex && (
                        <Check size={18} style={{ color: 'var(--brand-success)' }} />
                      )}
                      {isAnswerSubmitted && selectedOption === idx && idx !== currentQuestion.correctIndex && (
                        <X size={18} style={{ color: 'var(--brand-danger)' }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Reveal */}
              {isAnswerSubmitted && (
                <div
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '0.5rem',
                    background: selectedOption === currentQuestion.correctIndex ? 'var(--brand-success-bg)' : 'var(--brand-danger-bg)',
                    marginBottom: '1.5rem',
                    border: '1px solid',
                    borderColor: selectedOption === currentQuestion.correctIndex ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    {selectedOption === currentQuestion.correctIndex ? '✅ Correct!' : '❌ Not quite!'}
                  </div>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="btn btn-primary"
                    style={{ opacity: selectedOption === null ? 0.5 : 1 }}
                  >
                    <span>Check Answer</span>
                  </button>
                ) : (
                  <button onClick={handleNextQuestion} className="btn btn-primary">
                    <span>{currentQuizIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <Award size={48} style={{ color: 'var(--brand-btc)', margin: '0 auto 1rem' }} />
              <h4 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Quiz Complete!
              </h4>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                You scored <strong style={{ color: 'var(--brand-btc)' }}>{score}</strong> out of {QUIZ_QUESTIONS.length}!
                {score === QUIZ_QUESTIONS.length
                  ? ' Fantastic job! You have a firm grasp of core Bitcoin principles.'
                  : ' Good effort! Review our free guides above to sharpen your understanding.'}
              </p>
              <button onClick={handleResetQuiz} className="btn btn-secondary">
                <span>Retake Quiz</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal: Deep Article Breakdown */}
        {activeArticle && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: 'rgba(0, 0, 0, 0.75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              backdropFilter: 'blur(6px)',
            }}
            onClick={() => setActiveArticle(null)}
          >
            <div
              className="glass-card"
              style={{
                maxWidth: '650px',
                width: '100%',
                maxHeight: '85vh',
                overflowY: 'auto',
                padding: '2.5rem',
                position: 'relative',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <span className="pill pill-btc" style={{ textTransform: 'capitalize' }}>
                  {activeArticle.category} &bull; {activeArticle.readTime}
                </span>
                <button
                  onClick={() => setActiveArticle(null)}
                  style={{
                    padding: '0.35rem',
                    borderRadius: '0.35rem',
                    background: 'var(--bg-surface-elevated)',
                    color: 'var(--text-main)',
                  }}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>
                {activeArticle.title}
              </h3>

              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {activeArticle.summary}
              </p>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--brand-btc)', marginBottom: '0.85rem' }}>
                Key Takeaways
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
                {activeArticle.keyPoints.map((pt, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.925rem' }}>
                    <Check size={16} style={{ color: 'var(--brand-success)', flexShrink: 0, marginTop: '3px' }} />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              <div
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '0.5rem',
                  background: 'var(--brand-danger-bg)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                }}
              >
                <AlertTriangle size={18} style={{ color: 'var(--brand-danger)', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                  <strong>Risk Insight:</strong> {activeArticle.riskTip}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
