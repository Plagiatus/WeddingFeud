<script lang="ts">
    import type { Question } from "#lib/types.js";

    let { data } = $props();
    let questions = $state(data.questions);

    function addQuestion() {
        questions.push({
            accumulated: [],
            replies: [],
            id: crypto.randomUUID(),
            text: "",
        });
    }
    let deletedQuestions: Question[] = $state([]);
    function removeQuestion(question: Question) {
        let index = questions.indexOf(question);
        if (index < 0) return;
        questions.splice(index, 1);
        deletedQuestions.push(question);
    }
</script>

<div class="wrapper">
    <h1>Fragen Editieren</h1>
    <form action="?/save" method="POST">
        {#each questions as question}
            <div class="question-wrapper">
                <input
                    type="text"
                    name={question.id}
                    bind:value={question.text}
                    placeholder="Nenne..."
                />
                <button
                    type="button"
                    class="danger"
                    onclick={() => {
                        removeQuestion(question);
                    }}>Frage löschen</button
                >
            </div>
            {#if question.replies.length > 0}
                <details>
                    <summary>
                        {question.replies.length} Antworten
                    </summary>
                    {#each question.accumulated as reply}
                        <div>{reply.amount}x {reply.reply}</div>
                    {/each}
                </details>
            {/if}
            <hr>
        {/each}
        <div>
            <button type="button" onclick={addQuestion} class="success"
                >Frage hinzufügen</button
            >
        </div>

        {#each deletedQuestions as delQuestion}
            <input type="text" name={delQuestion.id} value={" "} hidden />
        {/each}
        <button>Speichern</button>
    </form>
</div>

<style>
    .wrapper {
        margin: 1em;
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 1em;
    }
    .question-wrapper {
        display: flex;
        gap: 0.3em;
    }
    input {
        flex-grow: 1;
    }

    @media screen and (max-width: 720px) {
        .question-wrapper {
            flex-direction: column;
        }
    }
</style>
