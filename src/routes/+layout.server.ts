import { getQuestions } from "#lib/data.ts";

export const load = async () => {
    return {questions: getQuestions()}
};