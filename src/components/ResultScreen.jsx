import { useState } from 'react';

export default function ResultScreen({ questions, answers, onRestart }) {
    const [showExplanation, setShowExplanation] = useState({});

    const calculateScore = () => {
        let correctCount = 0;
        questions.forEach(q => {
            const userAnswer = answers[q.id];
            // Check if matches the pre-calculated correct answer text
            // We use the new property _correctAnswerText if available
            // Fallback to old logic if not (though implementation ensures it should be there)
            if (q._correctAnswerText) {
                if (userAnswer === q._correctAnswerText) {
                    correctCount++;
                }
            } else if (userAnswer && userAnswer.startsWith(q.correctAnswer)) {
                // Fallback for legacy behavior
                correctCount++;
            }
        });
        return correctCount;
    };

    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    const toggleExplanation = (id) => {
        setShowExplanation(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="card result-screen">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>퀴즈 완료!</h2>
                <div style={{
                    fontSize: '4rem',
                    fontWeight: '800',
                    color: percentage >= 80 ? 'var(--success)' : percentage >= 50 ? 'var(--warning)' : 'var(--error)',
                    textShadow: '0 0 20px rgba(0,0,0,0.5)'
                }}>
                    {score} / {questions.length}
                </div>
                <p style={{ color: 'var(--text-muted)' }}>총 {percentage}% 점수입니다</p>
            </div>

            <div className="review-section">
                <h3 style={{ marginBottom: '1.5rem' }}>오답 노트 & 해설</h3>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {questions.map((q, index) => {
                        const userAnswer = answers[q.id];
                        let isCorrect = false;
                        if (q._correctAnswerText) {
                            isCorrect = userAnswer === q._correctAnswerText;
                        } else {
                            isCorrect = userAnswer && userAnswer.startsWith(q.correctAnswer);
                        }

                        return (
                            <div key={q.id} style={{
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: 'var(--radius-md)',
                                padding: '1.5rem',
                                borderLeft: `4px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}`
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <span style={{
                                            display: 'inline-block',
                                            background: isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                            color: isCorrect ? 'var(--success)' : 'var(--error)',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '99px',
                                            fontSize: '0.8rem',
                                            fontWeight: '700',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {isCorrect ? '정답' : '오답'}
                                        </span>
                                        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{index + 1}. {q.question}</h4>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                    <p>내가 고른 답: <span style={{ color: isCorrect ? 'var(--success)' : 'var(--error)', fontWeight: '600' }}>{userAnswer}</span></p>
                                    {!isCorrect && <p>정답: <span style={{ color: 'var(--success)', fontWeight: '600' }}>{q._correctAnswerText || q.options.find(o => o.startsWith(q.correctAnswer))}</span></p>}
                                </div>

                                <button
                                    onClick={() => toggleExplanation(q.id)}
                                    style={{
                                        background: 'transparent',
                                        color: 'var(--primary-light)',
                                        fontSize: '0.9rem',
                                        padding: 0,
                                        textDecoration: 'underline'
                                    }}
                                >
                                    {showExplanation[q.id] ? '해설 닫기' : '해설 보기'}
                                </button>

                                {showExplanation[q.id] && (
                                    <div style={{
                                        marginTop: '1rem',
                                        padding: '1rem',
                                        background: 'rgba(0,0,0,0.2)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.5'
                                    }}>
                                        <strong>해설:</strong> {q.explanation}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <button
                    className="btn-primary"
                    onClick={onRestart}
                    style={{ minWidth: '200px' }}
                >
                    다시 풀기
                </button>
            </div>
        </div>
    );
}
