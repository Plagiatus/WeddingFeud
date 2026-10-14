import * as fs from "fs";

const filePath = "questions.json"
import type { Question } from "./types";

let questions: Question[] = []

export function setQuestionsData(q: Question[]) {
    questions = q;
    saveQuestions();
}


export function getQuestions() {
    // console.log(questions);
    return questions;
}

export function loadQuestionsFromFile() {
    if (!fs.existsSync(filePath)) return;
    let rawData = fs.readFileSync(filePath, { encoding: "utf-8" });
    try {
        setQuestionsData(JSON.parse(rawData));
        console.log("Questions loaded.")
    } catch (error) {
        console.error("Cannot read file at", filePath);
    }
}

export function saveQuestions() {
    fs.writeFileSync(filePath, JSON.stringify(questions));
}

export function addOrModifyQuestion(id: string, text: string) {
    text = text.trim();
    if (!text) {
        let index = questions.findIndex((v) => v.id === id);
        if (index >= 0) {
            questions.splice(index, 1);
            saveQuestions();
        }
        return;
    }
    let existingQuestion = questions.find((v) => v.id === id);
    if (existingQuestion) {
        existingQuestion.text = text;
    } else {
        questions.push({ id, text, replies: [], accumulated: [] })
    }
    saveQuestions();
}

export function setReplies(id: string, replies: string[]) {
    let question = questions.find((v) => v.id === id);
    if (!question) return;
    question.replies = replies;
    accumulate(question);
    saveQuestions;
}

export function addReply(id: string, reply: string) {
    reply = reply.trim();
    if (!reply) return;
    let question = questions.find((v) => v.id === id);
    if (!question) return;
    question.replies.push(reply);
    accumulate(question);
    saveQuestions();
}

function accumulate(question: Question) {
    let map = new Map<string, number>()
    for (let reply of question.replies) {
        reply = reply.toLowerCase();
        let amount = 0;
        if (map.has(reply))
            amount = map.get(reply) ?? 0;
        map.set(reply, amount + 1);
    }
    question.accumulated = [];
    for (let reply of map.keys()) {
        question.accumulated.push({ reply, amount: map.get(reply) ?? 0 });
    }
    question.accumulated.sort((a, b) => b.amount - a.amount)
}