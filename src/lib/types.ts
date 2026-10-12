export type AccumulatedReply = {
    reply: string,
    amount: number,
}

export type Question = {
    text: string,
    id: string, 
    replies: string[],
    accumulated: AccumulatedReply[],
}

export type TeamState = {
    name: string,
    points: number,
    mistakes: number,
    pressed?: boolean,
}

export type GameState = {
    currentQuestion?: Question,
    currentPoints: number,
    questionAmount: [number, number],
    visibleAnswers: boolean[],
    teams: TeamState[],
}