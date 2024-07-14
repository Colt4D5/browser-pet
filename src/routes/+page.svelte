<script>
	import { onMount } from 'svelte';
  import { Dino, Background } from './Canvas.svelte.js';
  import SettingsIcon from '$lib/assets/images/settings-icon.svg?raw';
  import greenDino from '$lib/assets/images/DinoSprites - doux 2.png';
  import backgroundImg from '$lib/assets/images/background.jpg';

  let isInitialized = $state(false);
  let settingsOpen = $state(false);
  let petName = $state("");

  let pet;

  let bgCanvas = $state();
  let fgCanvas = $state();

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

    chrome.storage.local.get(['location'], function(result) {
      if ('location' in result) {
        pet.position.x = result.location;
      }
    });

    background.draw();
    background.width = 400;
    background.height = 300;
    pet.width = 400;
    pet.height = 300;
    pet.animate();
  });

  function updatePetName() {
    pet.name = petName;
    chrome.storage.local.set({ petName }, function() {
      console.log(`Pet name saved as ${petName}`);
    });
    settingsOpen = false;
  }

  function setPetName() {
    pet.name = petName;
    isInitialized = true;
    pet.isInitialized = true;

    chrome.storage.local.set({ petName }, function() {
      console.log(`Pet name saved as ${petName}`);
    });
  }

  function toggleSettings() {
    settingsOpen = true;
  }
</script>

{#if !isInitialized}
  <div class="popup">
    <p>What would you like to name your pet?</p>
    <input bind:value={petName} />
    <button onclick={setPetName}>Save</button>
  </div>
{:else}
  <button id="settings-btn" onclick={toggleSettings}>
    {@html SettingsIcon}
  </button>
{/if}

{#if settingsOpen}
  <div id="overlay" onclick={() => settingsOpen = false}></div>
  <div class="popup">
    <p>What would you like to name your pet?</p>
    <input bind:value={petName} />
    <button onclick={updatePetName}>Save</button>
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

<style>
  .popup {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    z-index: 3;
    background: #fff;
    padding: 1rem;
    border: 3px solid #bbb;
  }
  #overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(0 0 0 / 0.7);
    z-index: 2;
  }
  #settings-btn {
    background-color: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    position: absolute;
    right: 1rem;
    top: 1rem;
    color: #fff;
    z-index: 3;
  }
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 400px;
    height: 300px;
  }
  #bg-canvas {
    z-index: -1;
  }
</style>

