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
        {#each questions as question, i}
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
                    <input
                        type="checkbox"
                        id={"showQuestions" + i}
                        class="replies-toggle"
                        hidden
                    />
                    <label
                        for={"showQuestions" + i}
                        class="show-toggle reply-toggle"
                    >
                        Ansehen
                    </label><label
                        for={"showQuestions" + i}
                        class="edit-toggle reply-toggle"
                    >
                        Bearbeiten
                    </label>
                    <div class="accumulated">
                        {#each question.accumulated as reply}
                            <div>{reply.amount}x {reply.reply}</div>
                        {/each}
                    </div>
                    <textarea
                        name={question.id + ".replies"}
                        value={question.replies.join("\n")}
                        class="replies"
                    ></textarea>
                </details>
            {/if}
            <hr />
        {/each}
        <div>
            <button type="button" onclick={addQuestion} class="success"
                >Frage hinzufügen</button
            >
        </div>

        {#each deletedQuestions as delQuestion}
            <input type="text" name={delQuestion.id} value={" "} hidden />
        {/each}
        <button type="submit">Speichern</button>
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

    .reply-toggle {
        display: inline-block;
        padding: 0.375rem 0.75rem;
        background-color: #6c757d;
        cursor: pointer;
        /* border-radius: 0.375rem; */
        color: #fff;
    }
    .edit-toggle {
        border-top-right-radius: 0.375rem;
        border-bottom-right-radius: 0.375rem;
    }
    .show-toggle {
        border-top-left-radius: 0.375rem;
        border-bottom-left-radius: 0.375rem;
    }
    .replies-toggle:not(:checked) ~ .show-toggle,
    .replies-toggle:checked ~ .edit-toggle {
        background-color: #0d6efd;
    }

    .replies-toggle:not(:checked) ~ .replies {
        display: none;
    }
    .replies-toggle:checked ~ .accumulated {
        display: none;
    }
    .replies {
        display: block;
        margin-top: 0.5em;
    }

    @media screen and (max-width: 720px) {
        .question-wrapper {
            flex-direction: column;
        }
    }
</style>
