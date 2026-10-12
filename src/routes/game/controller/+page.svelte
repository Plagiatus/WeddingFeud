<script lang="ts">
    import type { AccumulatedReply, GameState } from "#lib/types.ts";
    import { enhance } from "$app/forms";
    import { onMount } from "svelte";
    import visibility from "#lib/assets/visibility.svg";
    import visibilityOff from "#lib/assets/visibility_off.svg";
    import xIcon from "#lib/assets/x.svg";

    let data = $props();
    $inspect(data);
    let gameState: GameState = $state(data.gameState);
    async function getGameData() {
        const response = await fetch("/game/api/data");
        gameState = await response.json();
    }
    let interval: NodeJS.Timeout;
    onMount(() => {
        if (interval) clearInterval(interval);
        interval = setInterval(getGameData, 1000);
        getGameData();
    });
    let answers: AccumulatedReply[] = $derived.by(() => {
        if (!gameState?.currentQuestion) return [];
        return gameState.currentQuestion.accumulated.slice(0, 6);
    });
    let additionalAnswers: AccumulatedReply[] = $derived.by(() => {
        if (!gameState?.currentQuestion) return [];
        return gameState.currentQuestion.accumulated.slice(6);
    });
</script>

<div class="margin-container">
    {#if gameState}
        <form
            action="/game/api/"
            method="post"
            use:enhance
            class="question-control"
        >
            <button class="secondary" formaction="/game/api/prev"
                >Vorherige Frage</button
            >
            <button class="primary" formaction="/game/api/next"
                >Nächste Frage</button
            >
        </form>
        <div class="question-amount">
            {#if gameState.currentQuestion}
                {gameState.questionAmount[0] + 1} / {gameState
                    .questionAmount[1]}
            {/if}
        </div>

        <div id="question-wrapper">
            {#if gameState?.currentQuestion}
                <form
                    id="question"
                    method="POST"
                    action="/game/api/toggle-visibility"
                    use:enhance
                >
                    <button
                        aria-label="toggle visibility"
                        class={[
                            "reveal-button",
                            "question-button",
                            gameState.visibleAnswers[0]
                                ? "primary"
                                : "secondary",
                        ]}
                    >
                        <span class="answer-text">
                            {gameState.currentQuestion.text}
                        </span>
                        {#if gameState.visibleAnswers[0]}
                            <img src={visibilityOff} alt="" />
                        {:else}
                            <img src={visibility} alt="" />
                        {/if}
                    </button>
                    <input type="number" value="0" name="id" hidden />
                </form>
                <div id="answers">
                    {#each answers as answer, i}
                        {@const visible = gameState.visibleAnswers[i + 1]}
                        <form
                            class="answer"
                            method="POST"
                            action="/game/api/toggle-visibility"
                            use:enhance
                        >
                            <input
                                type="number"
                                value={i + 1}
                                name="id"
                                hidden
                            />
                            <button
                                class={[
                                    "reveal-button",
                                    visible ? "primary" : "secondary",
                                ]}
                            >
                                <span class="answer-text">{answer.reply}</span>
                                <span class="answer-points"
                                    >{answer.amount}</span
                                >
                                {#if visible}
                                    <img src={visibilityOff} alt="" />
                                {:else}
                                    <img src={visibility} alt="" />
                                {/if}
                            </button>
                        </form>
                    {/each}
                    <div class="round-points">
                        <span>Rundenpunke</span>
                        <span>{gameState.currentPoints}</span>
                    </div>
                    {#if additionalAnswers.length > 0}
                        <details class="additional-replies">
                            <summary>Weitere Antworten</summary>
                            {#each additionalAnswers as reply}
                                <div class="additional-reply">
                                    <span>{reply.reply}</span>
                                    <span>{reply.amount}</span>
                                </div>
                            {/each}
                        </details>
                    {/if}
                </div>
            {:else}
                <div class="question-placeholder">Warte auf Frage...</div>
            {/if}
        </div>
        <div id="teams-wrapper">
            {#each gameState.teams as team, t}
                <form
                    action="/game/api/team"
                    method="post"
                    use:enhance
                    class="team-wrapper"
                    class:pressed={team.pressed}
                >
                    <span class="team-name">Team {team.name}</span>
                    <span class="team-points">{team.points}</span>
                    <div>
                        {#each { length: 3 } as x, i}
                            <button
                                class={[
                                    i < team.mistakes ? "danger" : "secondary",
                                    "x" + i,
                                ]}
                                formaction={i < team.mistakes
                                    ? "/game/api/team/mistake/remove"
                                    : "/game/api/team/mistake/add"}
                            >
                                <img src={xIcon} alt="" />
                            </button>
                        {/each}
                    </div>
                    <button class="success" formaction="/game/api/team/won"
                        >Runde Gewonnen</button
                    >
                    <input type="number" name="id" value={t} hidden />
                </form>
            {/each}
        </div>
    {/if}
</div>

<!-- {JSON.stringify(gameState)} -->

<style>
    .margin-container {
        padding: 1rem;
    }
    .question-control {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.25rem;
    }
    .question-amount {
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
    }

    .reveal-button {
        display: flex;
        flex-direction: row;
        gap: 1em;
        width: 100%;
        text-align: left;
        margin: 0.25rem 0;
        text-transform: capitalize;
        padding: 0;
        padding-right: 0.75rem;
    }

    .question-button {
        font-size: 1.25em;
    }
    .answer-text {
        flex-grow: 1;
        padding: 0.375rem 0.75rem;
    }

    .answer-points {
        padding: 0.375rem 0.75rem;
        background-color: rgba(0, 0, 0, 0.1);
    }

    .round-points,
    .additional-reply {
        padding: 0.375rem 0.75rem;
        padding-right: calc(24px + 0.75rem + 0.75rem + 1em);
        display: flex;
        justify-content: space-between;
    }
    .round-points {
        font-weight: bold;
    }

    #teams-wrapper {
        display: grid;
        grid-template-columns: 1fr 1fr;
        margin-top: 2rem;
        gap: 1rem;
    }
    .team-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.2rem;
        border-radius: 0.375rem;
    }
    .pressed {
        background-color: rgb(27, 192, 27);
        color: #fff;
    }
    .team-points {
        display: block;
        font-size: 2em;
    }
    .x0,
    .x1,
    .x2 {
        border-radius: 0;
    }
    .x0 {
        border-top-left-radius: 0.375rem;
        border-bottom-left-radius: 0.375rem;
    }
    .x2 {
        border-top-right-radius: 0.375rem;
        border-bottom-right-radius: 0.375rem;
    }
    .additional-replies {
        font-size: 0.75rem;
        border: 1px solid #6c757d;
        border-radius: 0.375rem;
        text-transform: capitalize;
    }
    .additional-replies summary {
        background-color: #6c757d;
        color: #fff;
        padding: 0.375rem 0.75rem;
    }
</style>
