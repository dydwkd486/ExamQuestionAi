/**
 * Loads all question data from individual JSON files in the chapters directory.
 * Uses Vite's import.meta.glob feature.
 * @returns {Array} Array of all question objects merged together.
 */
export function loadAllQuestions() {
    const modules = import.meta.glob('../data/chapters/*.json', { eager: true });
    let allQuestions = [];

    for (const path in modules) {
        const data = modules[path].default;
        if (Array.isArray(data)) {
            allQuestions = [...allQuestions, ...data];
        }
    }

    return allQuestions;
}
