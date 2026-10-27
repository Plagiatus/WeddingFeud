<script lang="ts">
    import { enhance } from "$app/forms";

    let { data, form } = $props();
    let progress: number = $state(0);
    let sent = $state(false);
</script>

{#if progress == 0}
    <div id="stopper" class="cover text-center">
        <div class="grow center">
            <div class="background">
                <h1>STOPP</h1>
                <p>
                    <strong>
                        Dieser Bereich ist nicht für das Brautpaar und deren
                        direkten Familienangehörige (Eltern, Geschwister)!</strong
                    >
                </p>
                <p>
                    Solltet ihr dazu gehören, schließt ihr die Seite jetzt bitte
                    direkt wieder.
                </p>
            </div>
        </div>
        <p>Alle anderen Gäste der Hochzeit klicken bitte hier</p>
        <button
            class="warning"
            onclick={() => {
                progress = 1;
                scrollTo(0, 0);
            }}>Verstanden, weiter</button
        >
    </div>
{:else if progress == 1}
    <div id="explanation" class="cover text-center">
        <div class="grow center">
            <div>
                <h2>Erklärung</h2>
                <p>
                    Wir wollen mit dem Brautpaar das Spiel "Familienduell"
                    spielen und dafür brauchen wir eure Hilfe.
                </p>
                <br />
                <p>
                    Bitte beantwortet die Fragen auf der nächsten Seite kurz und
                    knapp (am besten in einem Wort). Wir sammeln die Antworten
                    und machen daraus ein Quiz für das Brautpaar.
                </p>
                <br />
                <p class="background">
                    <strong>Wichtig:</strong> Jeder sollte seine eigenen Antworten
                    abgeben und nicht die der anderen anschauen, damit wir möglichst
                    unabhängige Antworten bekommen!
                </p>
            </div>
        </div>
        <button
            class=""
            onclick={() => {
                progress = 2;
                scrollTo(0, 0);
            }}>Los geht's!</button
        >
    </div>
{:else if progress == 2}
    <form
        id="questions"
        action="?/save"
        method="post"
        use:enhance={() => {
            sent = true;
        }}
    >
        {#each data.questions as question}
            <div class="question-wrapper">
                <span>{question.text}</span>
                <input
                    type="text"
                    name={question.id}
                    placeholder="Antwort"
                    required
                />
            </div>
        {/each}
        <div class="grow"></div>
        <button type="submit" disabled={sent}>Speichern</button>
    </form>
{/if}
{#if form}
    <div class="message cover text-center">
        Danke, deine Antworten wurden gespeichert. Du kannst das Fenster jetzt
        wieder schließen.
    </div>
{/if}

<style>
    p {
        max-width: 800px;
    }
    #questions,
    .cover {
        padding: 1rem;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
    .cover {
        align-items: center;
        font-size: max(2vw, 1.15em);
    }
    .text-center {
        text-align: center;
    }
    .grow {
        flex-grow: 1;
    }
    .center {
        display: grid;
        place-items: center;
    }
    .background {
        background-color: rgba(255, 166, 0, 0.411);
        padding: 1em;
        border-radius: 0.75rem;
    }
    .question-wrapper {
        display: flex;
        flex-direction: column;
        margin: 1em 0;
    }
    .message {
        color: darkgreen;
        font-size: 1.25em;
        position: sticky;
        inset: 0;
        background-color: white;
    }
</style>
