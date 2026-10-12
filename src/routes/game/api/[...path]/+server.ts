import { gameState, nextQuestion, teamWonRound, toggleVisibility } from '#lib/game.ts';
import type { RequestHandler } from '@sveltejs/kit';

const getRequestHandlers = new Map<string, () => Response | Promise<Response>>(
    [
        ["data", () => Response.json(gameState)]
    ]
);
const postRequestHandlers = new Map<string, (request?: any) => Response | Promise<Response>>(
    [
        ["next", () => Response.json(nextQuestion(1))],
        ["prev", () => Response.json(nextQuestion(-1))],
        ["toggle-visibility", async (request) => Response.json(await toggleVisibilityRequest(request))],
        ["team/mistake/add", async (request) => Response.json(await mistakeRequest(request, 1))],
        ["team/mistake/remove", async (request) => Response.json(await mistakeRequest(request, -1))],
        ["team/won", async (request) => Response.json(await wonRequest(request))],
    ]
);

export async function GET({ params, request }) {
    // console.log(params.path);
    if (getRequestHandlers.has(params.path)) {
        return await getRequestHandlers.get(params.path)!();
    }
    return Response.json({}, { status: 204 });
}

export async function POST({ params, request }) {
    // console.log(params.path, await request.json());
    if (postRequestHandlers.has(params.path)) {
        return postRequestHandlers.get(params.path)!(request);
    }
    return Response.json({}, { status: 204 });
}


async function toggleVisibilityRequest(request: Request) {
    let text = await request.text();
    let id: number = parseInt(text.split("=")[1]);
    if (isNaN(id)) return gameState;

    toggleVisibility(id);
    return gameState;
}

async function mistakeRequest(request: Request, change: number) {
    let id = await getIdFromRequest(request);
    if (id >= 0) {
        gameState.teams[id].mistakes = Math.min(Math.max(gameState.teams[id].mistakes + change, 0), 3);
    }
    return gameState;
}

async function wonRequest(request: Request) {
    let id = await getIdFromRequest(request);
    if (id >= 0)
        teamWonRound(id)
    return gameState;
}

async function getIdFromRequest(request: Request) {
    let text = await request.text();
    let id: number = parseInt(text.split("=")[1]);
    if (isNaN(id))
        id = -1;
    return id;
}