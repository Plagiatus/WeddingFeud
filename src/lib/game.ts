import { getQuestions } from '#lib/data.ts';
import type { GameState } from '#lib/types.ts';

let currentQuestionIndex: number = -1;
export const gameState: GameState = {
    currentPoints: 0,
    currentQuestion: undefined,
    questionAmount: [0, getQuestions().length],
    visibleAnswers: [],
    teams: [
        { name: "Braut", mistakes: 0, points: 0 },
        { name: "Bräutigam", mistakes: 0, points: 0 },
    ]
}

export function nextQuestion(dir: number = 1) {
    let questions = getQuestions();
    currentQuestionIndex = (currentQuestionIndex + Math.sign(dir)) % questions.length;
    if (isNaN(currentQuestionIndex)) currentQuestionIndex = 0;
    gameState.currentQuestion = questions[currentQuestionIndex];
    // console.log("next question", questions, currentQuestionIndex, currentState);
    gameState.visibleAnswers = [];
    gameState.currentPoints = 0;
    gameState.teams.forEach(t => { t.mistakes = 0; t.pressed = false; });
    gameState.questionAmount = [currentQuestionIndex, questions.length];
    return gameState;
};


export function toggleVisibility(id: number) {
    gameState.visibleAnswers[id] = !gameState.visibleAnswers[id];
    let reply = gameState.currentQuestion?.accumulated[id - 1];
    if (reply) {
        if (gameState.visibleAnswers[id]) {
            gameState.currentPoints += reply.amount;
        } else {
            gameState.currentPoints -= reply.amount;

        }
    }
}

export function teamWonRound(id: number) {
    gameState.teams[id].points += gameState.currentPoints;
    gameState.currentPoints = 0;
}

export function teamPressed(id: number) {
    let pressed: boolean = false;
    gameState.teams.forEach((t) => pressed = pressed || !!t.pressed);
    if (pressed) return;
    gameState.teams[id].pressed = true;
    setTimeout(() => { gameState.teams[id].pressed = false }, 5000);
}