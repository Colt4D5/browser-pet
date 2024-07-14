<script>
  let { children } = $props();
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap" rel="stylesheet">
</svelte:head>

{@render children()}

<style>
  :global(body) {
    background-color: #555;
    outline: 2px solid lime;
    overflow: hidden;
    position: relative;
  }
  :global(h1, h2, h3, h4, h5, h6, p, li, span, input, button, div) {
    font-family: "Pixelify Sans", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
  }
</style>