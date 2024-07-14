import Shadow from '$lib/assets/images/shadow.png';

export class Dino {
  constructor({ canvas, spritesheet, currentState, position, name }) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.canvas.width = 400;
    this.canvas.height = 300;

    this.name = name;
    this.health = 100;

    this.colors = {
      success: '#4bb543',
      warning: '#eed202',
      danger: '#ff0000'
    }

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

    this.shadow = new Image();
    this.shadow.src = Shadow;

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
    this.scale = 3;
    
    this.position = {
      x: position.x - (this.frameWidth * this.scale) / 2,
      y: this.canvas.height - this.frameHeight * this.scale - 40,
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
        chrome.storage.local.set({ location: this.position.futureX }, function() {});
      }
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

    this.ctx.drawImage(
      this.shadow,

      this.position.x,
      this.position.y,
      this.shadow.width * this.scale,
      this.shadow.height * this.scale
    )

    this.ctx.fillStyle = this.colors.success;
    this.ctx.font = "bold 24px Pixelify Sans";
    this.ctx.fillText(this.name, this.position.x, this.position.y);
    this.ctx.strokeStyle = '#000';
    this.ctx.strokeText(this.name, this.position.x, this.position.y);

    this.drawHealthBar();
  }
  drawHealthBar() {
    const barLength = 146
    const healthPercentage = Math.ceil(barLength / 100 * this.health);
    
    // Text
    this.ctx.fillStyle = '#fff';
    this.ctx.font = "20px Pixelify Sans";
    this.ctx.fillText('Health:', 8, 18);
    
    // Health
    if (this.health > 50) {
      this.ctx.fillStyle = '#fff';
    } else if (this.health > 25) {
        this.ctx.fillStyle = this.colors.warning;
    } else {
      this.ctx.fillStyle = this.colors.danger;
    }
    this.ctx.font = "bold 20px Pixelify Sans";
    this.ctx.fillText(this.health, 85, 18);

    // Outline
    this.ctx.fillStyle = "#888";
    this.ctx.strokeStyle = "#000";
    this.ctx.beginPath();
    this.ctx.roundRect(8, 22, 150, 8, [6]);
    this.ctx.fill();
    this.ctx.stroke();

    // Health bar
    if (this.health > 50) {
      this.ctx.fillStyle = this.colors.success;
    } else if (this.health > 25) {
        this.ctx.fillStyle = this.colors.warning;
    } else {
      this.ctx.fillStyle = this.colors.danger;
    }
    this.ctx.beginPath();
    this.ctx.roundRect(10, 24, healthPercentage, 4, [6]);
    this.ctx.fill();
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
    this.canvas.width = 400;
    this.canvas.height = 300;

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
        400,
        300
      );
    })
  }
}