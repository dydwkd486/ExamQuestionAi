import { useState, useEffect } from 'react';
import { getDistinctIncorrectQuestions } from '../utils/storage';

export default function StartScreen({ chapters, onStart, onManageData }) {
    const [selectedChapters, setSelectedChapters] = useState([]);
    const [questionCount, setQuestionCount] = useState(20);
    const [wrongQuestions, setWrongQuestions] = useState([]);

    useEffect(() => {
        setWrongQuestions(getDistinctIncorrectQuestions());
    }, []);

    const toggleChapter = (chapter) => {
        setSelectedChapters(prev =>
            prev.includes(chapter)
                ? prev.filter(c => c !== chapter)
                : [...prev, chapter]
        );
    };

    const toggleAll = () => {
        if (selectedChapters.length === chapters.length) {
            setSelectedChapters([]);
        } else {
            setSelectedChapters([...chapters]);
        }
    };

    const handleStart = () => {
        if (selectedChapters.length > 0) {
            onStart(selectedChapters, questionCount);
        }
    };

    const handleRetryStart = () => {
        if (wrongQuestions.length > 0) {
            // Pass wrong questions as the first argument, length as count, and true for retry flag
            onStart(wrongQuestions, wrongQuestions.length, true);
        }
    };

    return (
        <div className="card start-screen">
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>학습할 단원을 선택하세요</h2>

            <div className="chapter-list" style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    className={`chapter-item ${selectedChapters.length === chapters.length ? 'selected' : ''}`}
                    onClick={toggleAll}
                    style={{
                        padding: '1rem',
                        textAlign: 'left',
                        background: selectedChapters.length === chapters.length ? 'var(--item-bg-selected)' : 'var(--item-bg)',
                        border: `1px solid ${selectedChapters.length === chapters.length ? 'var(--item-border-selected)' : 'var(--item-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        color: selectedChapters.length === chapters.length ? 'var(--primary)' : 'var(--text-main)',
                        width: '100%',
                        fontWeight: '600',
                        boxShadow: 'var(--glass-shadow)',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {selectedChapters.length === chapters.length ? '✔ 전체 선택 해제' : '전체 선택'}
                </button>

                {chapters.map(chapter => (
                    <button
                        key={chapter}
                        onClick={() => toggleChapter(chapter)}
                        style={{
                            padding: '1rem',
                            textAlign: 'left',
                            background: selectedChapters.includes(chapter) ? 'var(--item-bg-selected)' : 'var(--item-bg)',
                            border: `1px solid ${selectedChapters.includes(chapter) ? 'var(--item-border-selected)' : 'var(--item-border)'}`,
                            borderRadius: 'var(--radius-md)',
                            color: selectedChapters.includes(chapter) ? 'var(--primary)' : 'var(--text-main)',
                            width: '100%',
                            boxShadow: 'var(--glass-shadow)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {selectedChapters.includes(chapter) ? '✔ ' : ''}{chapter}
                    </button>
                ))}
            </div>

            <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--surface-highlight)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label style={{ fontWeight: '600', color: 'var(--text-main)' }}>문제 수 선택</label>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{questionCount}문제</span>
                </div>
                <input
                    type="range"
                    min="5"
                    max="80"
                    step="1"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary)' }}
                />
            </div>

            <div style={{ textAlign: 'center' }}>
                <button
                    className="btn-primary"
                    onClick={handleStart}
                    disabled={selectedChapters.length === 0}
                    style={{ opacity: selectedChapters.length === 0 ? 0.5 : 1, width: '100%', fontSize: '1.1rem', marginBottom: '1rem' }}
                >
                    문제 풀기 시작
                </button>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <button
                        onClick={onManageData}
                        style={{
                            flex: 1,
                            padding: '0.8rem',
                            background: 'var(--surface-highlight)',
                            color: 'var(--primary)',
                            border: '1px solid var(--primary)',
                            borderRadius: '99px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        데이터 관리
                    </button>

                    {wrongQuestions.length > 0 && (
                        <button
                            onClick={handleRetryStart}
                            style={{
                                flex: 1,
                                padding: '0.8rem',
                                background: 'transparent',
                                color: 'var(--error)',
                                border: '1px solid var(--error)',
                                borderRadius: '99px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            오답 세션 ({wrongQuestions.length})
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
