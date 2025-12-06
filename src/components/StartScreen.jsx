import { useState } from 'react';

export default function StartScreen({ chapters, onStart }) {
    const [selectedChapters, setSelectedChapters] = useState([]);
    const [questionCount, setQuestionCount] = useState(20);

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
                        background: selectedChapters.length === chapters.length ? 'rgba(var(--primary-hue), 70%, 60%, 0.3)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${selectedChapters.length === chapters.length ? 'var(--primary)' : 'var(--surface-highlight)'}`,
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-main)',
                        width: '100%',
                        fontWeight: '600'
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
                            background: selectedChapters.includes(chapter) ? 'rgba(var(--primary-hue), 70%, 60%, 0.3)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${selectedChapters.includes(chapter) ? 'var(--primary)' : 'var(--surface-highlight)'}`,
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-main)',
                            width: '100%'
                        }}
                    >
                        {selectedChapters.includes(chapter) ? '✔ ' : ''}{chapter}
                    </button>
                ))}
            </div>

            <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label style={{ fontWeight: '600', color: 'var(--text-main)' }}>문제 수 선택</label>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{questionCount}문제</span>
                </div>
                <input
                    type="range"
                    min="5"
                    max="20"
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
                    style={{ opacity: selectedChapters.length === 0 ? 0.5 : 1, width: '100%', fontSize: '1.1rem' }}
                >
                    문제 풀기 시작
                </button>
            </div>
        </div>
    );
}
