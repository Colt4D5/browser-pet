<script>
	import { onMount } from 'svelte';
  import { Dino, Background } from './Canvas.svelte.js';
  import greenDino from '$lib/assets/images/DinoSprites - doux 2.png';
  import backgroundImg from '$lib/assets/images/background.jpg';

  let isInitialized = $state(false);
  let petName = $state("");

  let pet;

  let bgCanvas = $state();
  let fgCanvas = $state();

  const canvasSize = {
    width: 400,
    height: 300
  }

  onMount(() => {
    pet = new Dino({ 
      canvas: fgCanvas,
      spritesheet: {
        src: greenDino,
        framesX: 24,
        framesY: 2,
        width: 576,
        height: 48,
        states: {
          idle: [0, 3],
          walk: [4, 10],
          run: [17, 23]
        },
      },
      currentState: "idle",
      position: {
        x: fgCanvas.width / 2,
        y: fgCanvas.height
      },
      name: petName
    });
    const background = new Background({
      canvas: bgCanvas,
      spritesheet: { 
        src: backgroundImg,
        width: 400,
        height: 300,
      },
      position: { x: 0, y: 0 }
    });

    chrome.storage.local.get(['petName'], function(result) {
      petName = result.petName;
      pet.name = petName;
      isInitialized = true;
      pet.isInitialized = true;
    });

    background.draw();
    background.width = canvasSize.width;
    background.height = canvasSize.height;
    pet.width = canvasSize.width;
    pet.height = canvasSize.height;
    pet.animate();
  });

  function handleKeyDown(e) {
    if (!['w','d','s','a'].includes(e.key)) return;
    pet.controls[e.key] = true;
  }

  function handleKeyUp(e) {
    if (!['w','d','s','a'].includes(e.key)) return;
    pet.controls[e.key] = false;
  }

  function setPetName() {
    pet.name = petName;
    isInitialized = true;
    pet.isInitialized = true;

    chrome.storage.local.set({ petName }, function() {
      console.log(`Pet name saved as ${petName}`);
    });
  }
</script>

{#if !isInitialized}
  <div id="popup">
    <p>What would you like to name your pet?</p>
    <input bind:value={petName} />
    <button onclick={setPetName}>Save</button>
  </div>
{/if}

<canvas
  id="bg-canvas"
  bind:this={bgCanvas}
></canvas>

<canvas
  id="canvas"
  bind:this={fgCanvas}
></canvas>

<svelte:window onkeydown={handleKeyDown} onkeyup={handleKeyUp} />

<style>
  #popup {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    z-index: 5;
    background: #fff;
    padding: 1rem;
    border: 3px solid #bbb;
  }
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  #bg-canvas {
    z-index: 1;
  }
  #canvas {
    z-index: 2;
  }
</style>

