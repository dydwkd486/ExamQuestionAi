const STORAGE_KEY = 'exam_history';
const USER_DATA_KEY = 'user_questions';

export const saveQuizResult = (result) => {
    const history = getQuizHistory();
    // Add timestamp if not present
    const newResult = {
        ...result,
        timestamp: Date.now()
    };
    history.push(newResult);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const getQuizHistory = () => {
    try {
        const history = localStorage.getItem(STORAGE_KEY);
        return history ? JSON.parse(history) : [];
    } catch (e) {
        console.error("Failed to load history", e);
        return [];
    }
};

export const getDistinctIncorrectQuestions = () => {
    const history = getQuizHistory();
    // Map to store unique questions: Key(chapter|id) -> QuestionObject
    const failingQuestionsMap = new Map();

    // Iterate chronologically (oldest to newest) to let later results override earlier ones
    history.forEach(session => {
        // 1. Process wrong questions: Add/Update them in the map
        if (Array.isArray(session.wrongQuestions)) {
            session.wrongQuestions.forEach(q => {
                const uniqueKey = `${q.chapter}|${q.id}`;
                failingQuestionsMap.set(uniqueKey, { id: q.id, chapter: q.chapter });
            });
        }

        // 2. Process correct questions: Remove them from the map if they exist
        // This means if I got it wrong previously but got it right this time, it's cleared.
        if (Array.isArray(session.correctQuestions)) {
            session.correctQuestions.forEach(q => {
                const uniqueKey = `${q.chapter}|${q.id}`;
                failingQuestionsMap.delete(uniqueKey);
            });
        }
    });

    return Array.from(failingQuestionsMap.values());
};

export const saveUserQuestions = (questions) => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(questions));
};

export const getUserQuestions = () => {
    try {
        const data = localStorage.getItem(USER_DATA_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Failed to load user questions", e);
        return [];
    }
};
