/**
 * Loads all question data from individual JSON files in the chapters directory.
 * Uses Vite's import.meta.glob feature.
 * @returns {Array} Array of all question objects merged together.
 */
import { getUserQuestions } from './storage';

/**
 * Loads all question data.
 * Prioritizes user questions from localStorage.
 * Also attempts to load from chapters directory if files exist.
 * @returns {Array} Array of all question objects merged together.
 */
export function loadAllQuestions() {
    const userQuestions = getUserQuestions();

    const modules = import.meta.glob('../data/chapters/*.json', { eager: true });
    let fileQuestions = [];

    for (const path in modules) {
        const data = modules[path].default;
        if (Array.isArray(data)) {
            fileQuestions = [...fileQuestions, ...data];
        }
    }

    // Combine both, but user questions usually replace or augment
    return [...userQuestions, ...fileQuestions];
}
