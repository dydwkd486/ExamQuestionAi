import { useState, useEffect } from 'react';

export default function QuizScreen({ questions, onFinish }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [selectedOption, setSelectedOption] = useState(null);
    const [showMap, setShowMap] = useState(false);

    const currentQuestion = questions[currentIndex];
    const totalQuestions = questions.length;
    const progress = ((currentIndex + 1) / totalQuestions) * 100;

    // Sync selected option when moving between questions
    useEffect(() => {
        if (currentQuestion) {
            setSelectedOption(answers[currentQuestion.id] || null);
        }
    }, [currentIndex, currentQuestion, answers]);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        // Auto-save answer on selection so it persists even if we jump around
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
    };

    const handleNext = () => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onFinish(answers);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const jumpToQuestion = (index) => {
        setCurrentIndex(index);
        setShowMap(false);
    };

    return (
        <div className="card quiz-screen" style={{ position: 'relative' }}>
            {/* Header with Navigation Map Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{
                    color: 'var(--primary-light)',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    Question {currentIndex + 1} of {totalQuestions}
                </span>
                <button
                    onClick={() => setShowMap(!showMap)}
                    className="btn-outline"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                >
                    {showMap ? '지도 닫기' : '전체 지도'}
                </button>
            </div>

            {/* Question Map Panel */}
            {showMap && (
                <div style={{
                    marginBottom: '2rem',
                    padding: '1rem',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: 'var(--radius-md)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
                    gap: '0.5rem'
                }}>
                    {questions.map((q, idx) => (
                        <button
                            key={q.id}
                            onClick={() => jumpToQuestion(idx)}
                            style={{
                                padding: '0.5rem',
                                background: currentIndex === idx ? 'var(--primary)' : answers[q.id] ? 'var(--surface-highlight)' : 'transparent',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '4px',
                                color: 'var(--text-main)',
                                cursor: 'pointer',
                                fontWeight: currentIndex === idx ? 'bold' : 'normal'
                            }}
                        >
                            {idx + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => onFinish(answers)}
                        style={{
                            gridColumn: '1 / -1',
                            marginTop: '0.5rem',
                            background: 'var(--error)',
                            border: 'none',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        지금 종료하고 결과 보기
                    </button>
                </div>
            )}

            <div className="progress-bar-container" style={{
                width: '100%',
                height: '6px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '3px',
                marginBottom: '2rem',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'var(--primary)',
                    transition: 'width 0.3s ease'
                }} />
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                    marginTop: '0.5rem',
                    fontSize: '1.5rem',
                    fontWeight: '700'
                }}>
                    {currentQuestion.question}
                </h3>
            </div>

            <div className="options-list" style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                {currentQuestion.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleOptionSelect(option)}
                        style={{
                            padding: '1.2rem',
                            textAlign: 'left',
                            background: selectedOption === option
                                ? 'rgba(var(--primary-hue), 70%, 60%, 0.2)'
                                : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${selectedOption === option ? 'var(--primary)' : 'var(--surface-highlight)'}`,
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-main)',
                            width: '100%',
                            fontSize: '1rem',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <span style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: `2px solid ${selectedOption === option ? 'var(--primary)' : 'var(--text-muted)'}`,
                            marginRight: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            {selectedOption === option && <div style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '50%' }} />}
                        </span>
                        {option}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                    className="btn-outline"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
                >
                    이전 문제
                </button>

                <button
                    className="btn-primary"
                    onClick={handleNext}
                >
                    {currentIndex === totalQuestions - 1 ? '결과 보기' : '다음 문제'}
                </button>
            </div>
        </div>
    );
}
