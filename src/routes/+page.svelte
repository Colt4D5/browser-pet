<script>
  import { Dino, Background } from './Canvas.svelte.js';
  // import dino from '$lib/assets/images/DinoSprites - vita.png';
  import greenDino from '$lib/assets/images/DinoSprites - doux 2.png';
  import backgroundImg from '$lib/assets/images/background.jpg';

  let pet;

  let bgCanvas = $state();
  let fgCanvas = $state();

  const canvasSize = {
    width: 400,
    height: 300
  }

  $effect(() => {
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
        isSprite: true
      },
      currentState: "idle",
      position: {
        x: fgCanvas.width / 2,
        y: fgCanvas.height
      }
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
    
    background.draw();
    background.width = canvasSize.width;
    background.height = canvasSize.height;
    pet.width = canvasSize.width;
    pet.height = canvasSize.height;
    pet.animate();
  })

  function handleKeyDown(e) {
    if (!['w','d','s','a'].includes(e.key)) return;
    pet.controls[e.key] = true;
  }

  function handleKeyUp(e) {
    if (!['w','d','s','a'].includes(e.key)) return;
    pet.controls[e.key] = false;
  }
</script>

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
  :global(body) {
    background-color: #555;
    outline: 2px solid lime;
    overflow: hidden;
    position: relative;
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

