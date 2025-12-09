import { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import { loadAllQuestions } from './utils/questionLoader';

import { prepareQuizQuestions } from './utils/quizLogic';

function App() {
  const [step, setStep] = useState('start'); // 'start', 'quiz', 'result'
  const [questionsData, setQuestionsData] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    // Load questions on mount
    const data = loadAllQuestions();
    setQuestionsData(data);
  }, []);

  // Theme support
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    // Prevent accidental navigation during quiz
    const handleBeforeUnload = (e) => {
      if (step === 'quiz') {
        e.preventDefault();
        e.returnValue = ''; // Trigger browser confirmation dialog
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [step]);

  // Extract unique chapters
  const availableChapters = [...new Set(questionsData.map(q => q.chapter))].sort();

  const handleStart = (selectedChapters, questionCount = 20, isRetryMode = false) => {
    let questions;

    if (isRetryMode) {
      // In retry mode, selectedChapters is the array of {id, chapter}
      const wrongQs = selectedChapters;
      questions = questionsData.filter(q =>
        wrongQs.some(wq => wq.id === q.id && wq.chapter === q.chapter)
      );
    } else {
      // Normal mode: Filter questions based on chapter selection
      questions = questionsData.filter(q => selectedChapters.includes(q.chapter));
    }

    // Shuffle and slice to user selected count (default 20)
    const shuffledQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, questionCount);

    // Prepare questions (clean options and shuffle them within each question)
    const preparedQuestions = prepareQuizQuestions(shuffledQuestions);

    setFilteredQuestions(preparedQuestions);
    setStep('quiz');
  };

  const handleQuizFinish = (answers) => {
    setUserAnswers(answers);
    setStep('result');
  };

  const handleRestart = () => {
    setStep('start');
    setFilteredQuestions([]);
    setUserAnswers({});
  };

  const handleLogoClick = () => {
    if (step === 'quiz') {
      const confirmLeave = window.confirm("정말 이동하시겠습니까? 현재 진행 상황이 초기화됩니다.");
      if (!confirmLeave) return;
    }
    handleRestart();
  };

  return (
    <div className="app-container" style={{ position: 'relative' }}>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 onClick={handleLogoClick} style={{ cursor: 'pointer' }}>Exam Question AI</h1>
      </header>

      <main>
        {step === 'start' && (
          <StartScreen
            chapters={availableChapters}
            onStart={handleStart}
          />
        )}

        {step === 'quiz' && (
          <QuizScreen
            questions={filteredQuestions}
            onFinish={handleQuizFinish}
          />
        )}

        {step === 'result' && (
          <ResultScreen
            questions={filteredQuestions}
            answers={userAnswers}
            onRestart={handleRestart}
          />
        )}
      </main>

      <footer style={{
        textAlign: 'center',
        marginTop: '3rem',
        color: 'var(--text-muted)',
        fontSize: '0.8rem'
      }}>
        © 2025 Exam Question AI. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
