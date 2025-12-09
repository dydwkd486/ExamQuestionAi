const STORAGE_KEY = 'exam_history';

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
    const wrongQuestions = [];
    const seen = new Set();

    // Iterate in reverse to prioritize recent errors if we wanted (though Set handles uniqueness)
    history.forEach(session => {
        if (Array.isArray(session.wrongQuestions)) {
            session.wrongQuestions.forEach(q => {
                // q should contain { id, chapter } at minimum
                const uniqueKey = `${q.chapter}|${q.id}`;
                if (!seen.has(uniqueKey)) {
                    seen.add(uniqueKey);
                    // We only need identifying info to find it later
                    wrongQuestions.push({ id: q.id, chapter: q.chapter });
                }
            });
        }
    });

    return wrongQuestions;
};
