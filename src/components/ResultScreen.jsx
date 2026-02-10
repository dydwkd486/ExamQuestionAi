import { useState, useEffect } from 'react';
import { saveQuizResult } from '../utils/storage';

export default function ResultScreen({ questions, answers, onRestart }) {
    const [score, setScore] = useState(0);
    const [showExplanations, setShowExplanations] = useState({});

    useEffect(() => {
        let correctCount = 0;
        const wrongQuestions = [];
        const correctQuestions = [];

        questions.forEach(q => {
            const userAnswer = answers[q.id];
            let isCorrect = false;

            if (q._correctAnswerText) {
                isCorrect = userAnswer === q._correctAnswerText;
            } else if (!q._correctAnswerText && userAnswer && userAnswer.startsWith(q.correctAnswer)) {
                isCorrect = true;
            }

            if (isCorrect) {
                correctCount++;
                correctQuestions.push({ id: q.id, chapter: q.chapter });
            } else {
                wrongQuestions.push({ id: q.id, chapter: q.chapter });
            }
        });

        setScore(correctCount);

        saveQuizResult({
            score: correctCount,
            total: questions.length,
            wrongQuestions,
            correctQuestions
        });

    }, []); // Run once on mount

    const toggleExplanation = (index) => {
        setShowExplanations(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const percentage = Math.round((score / questions.length) * 100);

    return (
        <div className="card result-screen">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>퀴즈 결과</h2>
                <div style={{
                    fontSize: '4rem',
                    fontWeight: '800',
                    color: 'var(--primary)',
                    marginBottom: '0.5rem'
                }}>
                    {score} / {questions.length}
                </div>
                <div style={{
                    fontSize: '1.25rem',
                    color: percentage >= 80 ? 'var(--success)' : percentage >= 60 ? 'var(--warning)' : 'var(--error)',
                    fontWeight: '600'
                }}>
                    {percentage >= 60 ? '합격입니다! 🎉' : '불합격입니다 😢'} ({percentage}%)
                </div>
            </div>

            <div className="review-section">
                <h3 style={{ marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                    정답 확인
                </h3>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {questions.map((q, index) => {
                        const userAnswer = answers[q.id];
                        // Logic to check correctness
                        const isCorrect = userAnswer === q._correctAnswerText ||
                            (!q._correctAnswerText && userAnswer && userAnswer.startsWith(q.correctAnswer));

                        return (
                            <div key={index} style={{
                                padding: '1.5rem',
                                borderRadius: 'var(--radius-md)',
                                border: `1px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}`,
                                background: isCorrect ? 'var(--bg-color)' : 'rgba(220, 53, 69, 0.05)',
                                boxShadow: 'var(--glass-shadow)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>문제 {index + 1}</span>
                                    <span style={{
                                        fontWeight: 'bold',
                                        color: isCorrect ? 'var(--success)' : 'var(--error)'
                                    }}>
                                        {isCorrect ? '정답' : '오답'}
                                    </span>
                                </div>
                                <p style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '500' }}>{q.question}</p>

                                <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.95rem' }}>
                                    <div style={{ color: isCorrect ? 'var(--success)' : 'var(--error)' }}>
                                        <strong>내가 고른 답:</strong> {userAnswer || '선택하지 않음'}
                                    </div>
                                    {!isCorrect && (
                                        <div style={{ color: 'var(--success)' }}>
                                            <strong>정답:</strong> {q._correctAnswerText || q.options.find(opt => opt.startsWith(q.correctAnswer)) || q.correctAnswer}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => toggleExplanation(index)}
                                    className="btn-outline"
                                    style={{
                                        fontSize: '0.9rem',
                                        padding: '0.5rem 1rem',
                                        borderColor: 'var(--surface-highlight)',
                                        color: 'var(--text-muted)'
                                    }}
                                >
                                    {showExplanations[index] ? '해설 닫기' : '해설 보기'}
                                </button>

                                {showExplanations[index] && (
                                    <div style={{
                                        marginTop: '1rem',
                                        padding: '1rem',
                                        background: 'var(--surface-highlight)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.6',
                                        color: 'var(--text-main)'
                                    }}>
                                        <strong>해설:</strong>
                                        <div style={{ marginTop: '0.5rem' }}>{q.explanation}</div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <button
                    className="btn-primary"
                    onClick={onRestart}
                    style={{ fontSize: '1.1rem', padding: '1rem 3rem' }}
                >
                    홈으로 돌아가기
                </button>
            </div>
        </div>
    );
}
