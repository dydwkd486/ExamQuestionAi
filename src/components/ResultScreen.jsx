import { useState, useEffect } from 'react';
import { saveQuizResult } from '../utils/storage';

export default function ResultScreen({ questions, answers, onRestart }) {
    const [score, setScore] = useState(0);
    const [showExplanations, setShowExplanations] = useState({});

    useEffect(() => {
        let correctCount = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer || (q._correctAnswerText && answers[q.id] === q._correctAnswerText)) {
                correctCount++;
            } else if (!q._correctAnswerText && answers[q.id] && answers[q.id].startsWith(q.correctAnswer)) {
                // Fallback for when full text wasn't stored but logic implies correctness (unlikely with current logic but safe)
                correctCount++;
            }
        });
        setScore(correctCount);

        // Save result
        // Identify wrong questions with their chapter for retry logic
        const wrongQuestions = questions.filter(q => {
            const userAnswer = answers[q.id];
            if (q._correctAnswerText) {
                return userAnswer !== q._correctAnswerText;
            }
            return !(userAnswer && userAnswer.startsWith(q.correctAnswer));
        }).map(q => ({ id: q.id, chapter: q.chapter }));

        saveQuizResult({
            score: correctCount,
            total: questions.length,
            wrongQuestions
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
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Quiz Results</h2>
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
                    {percentage}% Correct
                </div>
            </div>

            <div className="review-section">
                <h3 style={{ marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                    Review Answers
                </h3>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {questions.map((q, index) => {
                        const userAnswer = answers[q.id];
                        // Logic to check correctness considering legacy data format issues if any
                        const isCorrect = userAnswer === q._correctAnswerText ||
                            (!q._correctAnswerText && userAnswer && userAnswer.startsWith(q.correctAnswer));

                        return (
                            <div key={index} style={{
                                padding: '1.5rem',
                                borderRadius: 'var(--radius-md)',
                                border: `1px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}`,
                                background: isCorrect ? 'rgba(25, 135, 84, 0.05)' : 'rgba(220, 53, 69, 0.05)', // Keep low opacity but use semantic colors if possible, hardcoded valid for tint
                                boxShadow: 'var(--glass-shadow)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>Question {index + 1}</span>
                                    <span style={{
                                        fontWeight: 'bold',
                                        color: isCorrect ? 'var(--success)' : 'var(--error)'
                                    }}>
                                        {isCorrect ? 'Correct' : 'Incorrect'}
                                    </span>
                                </div>
                                <p style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '500' }}>{q.question}</p>

                                <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.95rem' }}>
                                    <div style={{ color: isCorrect ? 'var(--success)' : 'var(--error)' }}>
                                        <strong>Your Answer:</strong> {userAnswer || 'Skipped'}
                                    </div>
                                    {!isCorrect && (
                                        <div style={{ color: 'var(--success)' }}>
                                            <strong>Correct Answer:</strong> {q.options.find(opt => opt.startsWith(q.correctAnswer)) || q.correctAnswer}
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
                                    {showExplanations[index] ? 'Hide Explanation' : 'Show Explanation'}
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
                                        <strong>Explanation:</strong>
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
                    Back to Home
                </button>
            </div>
        </div>
    );
}
