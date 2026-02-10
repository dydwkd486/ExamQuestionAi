import { useState, useRef } from 'react';
import { saveUserQuestions, getUserQuestions } from '../utils/storage';

export default function DataInputScreen({ onBack, onSave }) {
    const [jsonData, setJsonData] = useState('');
    const [existingQuestions, setExistingQuestions] = useState(() => getUserQuestions());
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const promptExample = `다음 형식을 참고해서 새로운 문제 데이터를 JSON 형식으로 만들어줘. 
각 문제는 id, chapter, question, options (5개), correctAnswer (1-5 중 하나), explanation 필드를 가져야 해.

예시 JSON:
[
  {
    "id": 1,
    "chapter": "단원명",
    "question": "문제 내용",
    "options": ["1. 보기1", "2. 보기2", "3. 보기3", "4. 보기4", "5. 보기5"],
    "correctAnswer": "3",
    "explanation": "해설 내용"
  }
]

단원명 내용은 {파이썬 기초} 이고 {10}개의 문제를 만들어줘
`;

    // Extract unique chapters
    const chapters = [...new Set(existingQuestions.map(q => q.chapter))].sort();

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setJsonData(event.target.result);
        };
        reader.readAsText(file);
    };

    const validateJSON = (data) => {
        try {
            const parsed = JSON.parse(data);
            if (!Array.isArray(parsed)) {
                throw new Error("데이터는 배열 형태([])여야 합니다.");
            }
            return parsed;
        } catch (e) {
            setError("올바른 JSON 형식이 아닙니다: " + e.message);
            return null;
        }
    };

    const handleSave = (appendMode = false) => {
        const newData = validateJSON(jsonData);
        if (!newData) return;

        let updatedData;
        if (appendMode) {
            updatedData = [...existingQuestions, ...newData];
        } else {
            if (!window.confirm("기존 데이터가 모두 사라집니다. 새로 저장하시겠습니까?")) return;
            updatedData = newData;
        }

        saveUserQuestions(updatedData);
        setExistingQuestions(updatedData);
        setJsonData('');
        setError(null);
        alert(appendMode ? "데이터가 성공적으로 추가되었습니다!" : "데이터가 성공적으로 교체되었습니다!");
        onSave();
    };

    const handleDeleteChapter = (chapterName) => {
        if (window.confirm(`'${chapterName}' 단원의 모든 문제를 삭제하시겠습니까?`)) {
            const updatedData = existingQuestions.filter(q => q.chapter !== chapterName);
            saveUserQuestions(updatedData);
            setExistingQuestions(updatedData);
            onSave();
        }
    };

    const handleClearAll = () => {
        if (window.confirm("정말 모든 데이터를 삭제하시겠습니까? (로컬 데이터가 초기화됩니다)")) {
            saveUserQuestions([]);
            setExistingQuestions([]);
            onSave();
        }
    };

    return (
        <div className="card data-input-screen">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <button onClick={onBack} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>← 뒤로가기</button>
                <h2 style={{ margin: 0 }}>데이터 관리</h2>
                <div style={{ width: '80px' }}></div>
            </div>

            {/* Existing Chapters Section */}
            {chapters.length > 0 && (
                <div className="chapters-management" style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--surface-highlight)', borderRadius: 'var(--radius-md)' }}>
                    <h3 style={{ fontSize: '1rem', marginTop: 0, marginBottom: '0.8rem', color: 'var(--primary)' }}>📂 현재 보관된 단원 ({chapters.length}개)</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {chapters.map(chapter => (
                            <div key={chapter} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.4rem 0.8rem',
                                background: 'var(--item-bg)',
                                border: '1px solid var(--item-border)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.85rem'
                            }}>
                                <span>{chapter}</span>
                                <button
                                    onClick={() => handleDeleteChapter(chapter)}
                                    style={{
                                        border: 'none',
                                        background: 'none',
                                        color: 'var(--error)',
                                        cursor: 'pointer',
                                        padding: '0 2px',
                                        fontSize: '1rem',
                                        fontWeight: 'bold'
                                    }}
                                    title="단원 삭제"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="prompt-section" style={{
                background: 'var(--surface-highlight)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
                border: '1px solid var(--item-border)'
            }}>
                <h3 style={{ marginTop: 0, fontSize: '1rem', color: 'var(--primary)' }}>💡 데이터 생성 팁 (ChatGPT 활용)</h3>
                <p>아래 프롬프트를 사용하여 데이터를 생성하고 아래 입력창에 붙여넣으세요.</p>
                <pre style={{
                    whiteSpace: 'pre-wrap',
                    background: 'var(--item-bg)',
                    padding: '0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    border: '1px solid var(--item-border-selected)',
                }}>
                    {promptExample}
                </pre>
            </div>

            <div className="input-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold' }}>JSON 데이터 입력</label>
                    <div>
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                        />
                        <button
                            className="btn-secondary"
                            onClick={() => fileInputRef.current.click()}
                            style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                        >
                            📁 파일 불러오기
                        </button>
                    </div>
                </div>

                <textarea
                    value={jsonData}
                    onChange={(e) => setJsonData(e.target.value)}
                    placeholder="JSON 데이터를 여기에 붙여넣거나 파일을 불러오세요..."
                    style={{
                        width: '100%',
                        height: '250px',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--item-border)',
                        background: 'var(--item-bg)',
                        color: 'var(--text-main)',
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        resize: 'vertical',
                        marginBottom: '1rem'
                    }}
                />

                {error && (
                    <div style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                        ⚠️ {error}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <button className="btn-primary" onClick={() => handleSave(true)} style={{ flex: 1.5 }}>
                        ➕ 기존 데이터에 추가
                    </button>
                    <button className="btn-secondary" onClick={() => handleSave(false)} style={{ flex: 1 }}>
                        🔄 새로 고정 (덮어쓰기)
                    </button>
                </div>
                <button className="btn-secondary" onClick={handleClearAll} style={{ width: '100%', color: 'var(--error)', borderColor: 'var(--error)' }}>
                    🗑️ 모든 데이터 초기화
                </button>
            </div>
        </div>
    );
}
