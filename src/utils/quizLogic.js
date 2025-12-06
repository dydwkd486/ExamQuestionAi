/**
 * Removes "1. ", "2. " etc from the start of an option string.
 */
function cleanOptionText(option) {
    return option.replace(/^[0-9]+\.\s*/, '');
}

/**
 * Shuffles an array in place using Fisher-Yates algorithm.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Prepares questions for a quiz session:
 * 1. Identifies the correct answer text based on the raw "correctAnswer" index.
 * 2. Cleans all option texts (removes prefixes).
 * 3. Shuffles the options.
 * 4. Attaches `_correctAnswerText` to the question object for easy verification.
 * 
 * @param {Array} rawQuestions 
 * @returns {Array} Processed questions
 */
export function prepareQuizQuestions(rawQuestions) {
    // Deep copy to avoid mutating original data
    const questions = JSON.parse(JSON.stringify(rawQuestions));

    return questions.map(q => {
        // q.correctAnswer is usually string "3".
        // q.options is array like ["1. Apple", "2. Banana", "3. Cherry"]

        // Find the correct option string before modification
        // We match based on "Starts with X." or just index if possible.
        // The current data format relies on matching the number at the start.
        const correctOptionIndex = q.options.findIndex(opt => opt.startsWith(q.correctAnswer + '.'));
        const correctOptionRaw = correctOptionIndex !== -1 ? q.options[correctOptionIndex] : null;

        let correctAnswerText = null;
        if (correctOptionRaw) {
            correctAnswerText = cleanOptionText(correctOptionRaw);
        }

        // Clean all options
        const cleanedOptions = q.options.map(cleanOptionText);

        // Shuffle
        const shuffledOptions = shuffleArray([...cleanedOptions]);

        return {
            ...q,
            options: shuffledOptions,
            _correctAnswerText: correctAnswerText
        };
    });
}
