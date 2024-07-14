export class Dino {
  constructor({ canvas, spritesheet, currentState, position }) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.controls = {
      w: false,
      d: false,
      s: false,
      a: false,
    };

    this.spritesheet = spritesheet;
    this.sprite = new Image();
    this.sprite.src = this.spritesheet.src;

    this.position = position
    this.direction = 0;
    this.speed = {
      walk: 1.5,
      run: 2.5
    }

    if (spritesheet.isSprite) {
      this.frameWidth = this.spritesheet.width / this.spritesheet.framesX;
      this.frameHeight = this.spritesheet.height / this.spritesheet.framesY;
      this.currentState = currentState;
      this.currentFrame = {
        x: this.spritesheet.states[this.currentState][0],
        y: this.direction
      }
      
      this.counter = 0;
      this.scale = 2;
      
      this.position = {
        x: position.x - (this.frameWidth * this.scale) / 2,
        y: position.y - this.frameHeight * this.scale - 10
      };
    }
  }
  update() {
    if (this.counter % 8 === 0) {
      this.currentFrame.x++
    }
    if (this.currentFrame.x >= this.spritesheet.states[this.currentState][1] || this.currentFrame.x < this.spritesheet.states[this.currentState][0]) {
      this.currentFrame.x = this.spritesheet.states[this.currentState][0];
    }

    if (this.controls.a || this.controls.d) {
      this.position.x += this.controls.a ? -this.speed.walk : this.speed.walk;
      this.direction = this.controls.a ? 1 : 0;
      this.currentFrame.y = this.direction;
      this.currentState = 'walk';
    }

    if (Object.values(this.controls).every(key => key === false)) {
      this.currentState = 'idle';
    }

    this.counter++;
  }
  draw() {
    this.ctx.drawImage(
      this.sprite,
      
      this.frameWidth * this.currentFrame.x,
      this.frameHeight * this.currentFrame.y,
      this.frameWidth,
      this.frameHeight,

      this.position.x,
      this.position.y,
      this.frameWidth * this.scale,
      this.frameHeight * this.scale
    );
  }
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  animate() {
    this.clearCanvas();
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

export class Background {
  constructor({ canvas, spritesheet, position }) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.spritesheet = spritesheet;
    this.sprite = new Image();
    this.sprite.src = this.spritesheet.src;

    this.position = position;
  }
  draw() {
    this.sprite.addEventListener('load', () => {
      this.ctx.drawImage(
        this.sprite,
        this.position.x,
        this.position.y,
        325,
        160
      );
    })
  }
}