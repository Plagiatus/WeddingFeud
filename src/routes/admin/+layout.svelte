<script lang="ts">
	let { children } = $props();
</script>

<header>
    <nav>
        <a href="/game">Spielen</a>
        <a href="/game/controller">Kontrolle</a>
        <a href="/admin/edit">Fragen</a>
    </nav>
</header>

{@render children()}

<style>
    header {
        background-color: aliceblue;
        padding: 0.5em;
    }

    header a {
        text-decoration: none;
        color: black;
        background-color: #d7ecff;

        padding: 0.2em 0.35em;
    }
</style>