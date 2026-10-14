<script lang="ts">
    import type { AccumulatedReply, GameState, TeamState } from "#lib/types.ts";
    import { enhance } from "$app/forms";
    import { onMount } from "svelte";
    import xIcon from "#lib/assets/x.svg";
    import { postRequest } from "#lib";

    let data = $props();
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

    let team0Key: string = $state(""),
        team1Key: string = $state("");
    function handleKeyDown(ev: KeyboardEvent) {
        if (!team0Key) {
            team0Key = ev.key;
            return;
        }
        if (!team1Key) {
            team1Key = ev.key;
            return;
        }
        if (ev.key == team0Key) {
            postRequest("/game/api/team/pressed", "id=0");
        }
        if (ev.key == team1Key) {
            postRequest("/game/api/team/pressed", "id=1");
        }
    }
</script>

{#if gameState}
    <div
        id="game-page"
        class={{
            team0pressed: gameState.teams[0]?.pressed,
            team1pressed: gameState.teams[1]?.pressed,
        }}
    >
        <div id="question-wrapper">
            {#if gameState?.currentQuestion}
                <div id="question">
                    <span class:hidden-text={!gameState.visibleAnswers[0]}>
                        {gameState.currentQuestion.text}
                    </span>
                </div>
                <div id="answers">
                    {#each answers as answer, i}
                        <div class="answer">
                            <span
                                class:hidden-text={!gameState.visibleAnswers[
                                    i + 1
                                ]}
                                class="answer-text">{answer.reply}</span
                            >
                            <span
                                class:hidden-text={!gameState.visibleAnswers[
                                    i + 1
                                ]}
                                class="answer-points">{answer.amount}</span
                            >
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="question-placeholder">Warte auf Frage...</div>
            {/if}
        </div>

        <div id="teams-wrapper">
            {@render team(gameState.teams[0])}
            <div class="current-points">{gameState.currentPoints}</div>
            {@render team(gameState.teams[1])}
        </div>
        {#if !team0Key || !team1Key}
            <div id="init-overlay">
                <div>
                    {#if !team0Key}
                        Buzzer für Team Braut
                    {:else if !team1Key}
                        Buzzer für Team Bräutigam
                    {/if}
                </div>
            </div>
        {/if}
    </div>
{/if}

<svelte:window onkeydown={handleKeyDown} />

{#snippet team(team: TeamState)}
    <div class="team-wrapper">
        <div class="team-info" class:pressed={team.pressed}>
            <span class="team-name">Team {team.name}</span>
            <span class="team-points">{team.points}</span>
        </div>
        <div class="xs">
            {#each { length: 3 } as x, i}
                <img
                    class="x"
                    src={xIcon}
                    alt=""
                    class:hidden={i >= team.mistakes}
                />
            {/each}
        </div>
    </div>
{/snippet}

<style>
    #game-page {
        --color: #f6f2e7;
        --highlight: #416a60;
        background-color: var(--color);
        height: 100vh;
        font-size: max(1em, 2vw);
        padding: 1rem;
    }
    #question-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        text-transform: uppercase;
        color: var(--highlight);
    }
    #question {
        font-size: 2em;
        text-align: center;
        background-color: var(--highlight);
        color: var(--color);
        margin-bottom: 1rem;
        padding: 0.25em 0;
    }
    #answers {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        font-size: 1.5em;
    }
    .answer {
        display: flex;
        flex-direction: row;
        border: 1px solid var(--highlight);
    }
    .answer-text {
        padding: 0.375rem 0.75rem;
        flex-grow: 1;
    }
    .answer-points {
        width: 2.5em;
        padding: 0.375rem 0.75rem;
        background-color: #416a60;
        color: var(--color);
        text-align: center;
    }
    .hidden-text {
        visibility: hidden;
    }

    #teams-wrapper {
        display: grid;
        grid-template-columns: 1fr 2fr 1fr;
        margin-top: 1rem;
    }

    .team-wrapper {
        display: flex;
        flex-direction: column;
    }
    .team-info {
        padding: 1em;
        background-color: var(--highlight);
        color: var(--color);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.2rem;
    }
    .team-info.pressed {
        background-color: #b87c2f;
    }
    .team-points {
        display: block;
        font-size: 5em;
    }
    .current-points {
        display: flex;
        align-items: start;
        justify-content: center;
        font-size: 2em;
        color: var(--highlight);
    }

    .xs {
        display: flex;
        flex-direction: row;
        justify-content: center;
        background-color: var(--color);
    }
    .x {
        width: 3em;
        filter: brightness(0) saturate(100%) invert(36%) sepia(41%)
            saturate(313%) hue-rotate(115deg) brightness(94%) contrast(92%);
        /* background-color: var(--color); */
    }
    .x.hidden {
        display: none;
    }

    #init-overlay {
        position: absolute;
        inset: 0;
        background-color: #00000050;
        display: grid;
        place-items: center;
    }
    #init-overlay div {
        background-color: var(--color);
        color: var(--highlight);
        padding: 2rem;
    }
</style>
