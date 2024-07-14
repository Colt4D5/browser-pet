export class Dino {
  constructor({ canvas, spritesheet, currentState, position, name }) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.name = name;

    this.isInitialized = false;

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
      walk: 1,
      run: 2.5
    }

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
      y: position.y - this.frameHeight * this.scale - 10,
      futureX: Math.random() * this.canvas.width - this.frameWidth
    };

    this.isMoving = false;
    this.interval = Math.random() * 300 + 50;
  }
  update() {
    if (this.counter % 10 === 0) {
      this.currentFrame.x++
    }

    if (this.currentFrame.x >= this.spritesheet.states[this.currentState][1] || this.currentFrame.x < this.spritesheet.states[this.currentState][0]) {
      this.currentFrame.x = this.spritesheet.states[this.currentState][0];
    }

    if (this.counter > this.interval) {
      this.isMoving = true;
      this.currentState = 'walk';
      this.counter = 0;
    }

    if (this.isMoving) {
      this.position.x += this.position.x < this.position.futureX ? this.speed.walk : -this.speed.walk;
      this.direction = this.position.x < this.position.futureX ? 0 : 1;
      this.currentFrame.y = this.direction;
      if (Math.abs(this.position.x - this.position.futureX) < this.speed.walk) {
        this.isMoving = false;
        this.currentState = 'idle';
        this.counter = 0;
        this.interval = Math.random() * 300 + 50;
        this.position.futureX = Math.random() * this.canvas.width - this.frameWidth;
      }
    }

    this.counter++;
  }
  move() {
    if (this.position.x < this.position.futureX) {
      this.position.x += this.speed.walk;
    } else if (this.position.x > this.position. futureX) {
      this.position.x -= this.speed.walk;
    }
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

    this.ctx.fillStyle = '#32CD32';
    this.ctx.font = "14px Pixelify Sans";
    this.ctx.fillText(this.name, this.position.x, this.position.y);
  }
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  animate() {
    this.clearCanvas();
    if (this.isInitialized) {
      this.update();
    }
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