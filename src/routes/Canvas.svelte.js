import Shadow from '$lib/assets/images/shadow.png';

export class Dino {
  constructor({ canvas, spritesheet, currentState, position, name }) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.canvas.width = 400;
    this.canvas.height = 300;

    this.name = name;
    this.hunger = 100;
    this.health = 100;
    this.isReplenishing = false;

    chrome.storage.local.get(['lastMeal'], function(result) {
      if (!('lastMeal' in result)) {
        chrome.storage.local.set({ lastMeal: Date.now() }, function() {});
      }
    });

    this.food = [];

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

    this.gravity = 0.2;

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

    if (this.isReplenishing && this.counter % 4 === 0) {
      this.replenishHealth();
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

    this.drawFood();

    this.drawHealthBar();
    this.drawHungerBar();
  }
  drawFood() {
    this.food.forEach(food => {
      this.updateFood(food);
      this.ctx.beginPath();
      this.ctx.arc(food.x, food.y, food.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = '#f00';
      this.ctx.fill();
      this.ctx.closePath();
    })
  }
  updateFood(food) {
    if (food.yVel < 8 && !food.isGrounded) {
      food.yVel += this.gravity;
    }
    food.y += food.yVel;

    if (food.y > this.canvas.height - 50) {
      food.yVel *= -1;
      food.yVel -= food.yVel * 0.4;
    }

    if (food.yVel < 0.5 && food.yVel > -0.5 && food.y > this.canvas.height - 55 && food.y < this.canvas.height - 45) {
      food.yVel = 0;
      food.isGrounded = true;
    }
  }
  drawHealthBar() {
    const barLength = 146
    const healthPercentage = Math.ceil(barLength / 100 * this.health);
    
    // Text
    this.ctx.fillStyle = '#fff';
    this.ctx.font = "20px Pixelify Sans";
    this.ctx.fillText('Health:', 8, 18);
    
    // Health
    if (this.health >= 50) {
      this.ctx.fillStyle = '#fff';
    } else if (this.health >= 25) {
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
    if (this.health >= 50) {
      this.ctx.fillStyle = this.colors.success;
    } else if (this.health >= 25) {
        this.ctx.fillStyle = this.colors.warning;
    } else {
      this.ctx.fillStyle = this.colors.danger;
    }
    this.ctx.beginPath();
    this.ctx.roundRect(10, 24, healthPercentage, 4, [6]);
    this.ctx.fill();
    chrome.storage.local.get(['lastMeal'], (result) => {
      if ('lastMeal' in result) {
        this.calculateHealth(result.lastMeal);
      }
    });
  }
  drawHungerBar() {
    const barLength = 146
    const hungerPercentage = Math.ceil(barLength / 100 * this.hunger);
    
    // Text
    this.ctx.fillStyle = '#fff';
    this.ctx.font = "20px Pixelify Sans";
    this.ctx.fillText('Hunger:', 8, 46);
    
    // Health
    if (this.hunger >= 25) {
      this.ctx.fillStyle = '#fff';
    } else if (this.hunger >= 5) {
        this.ctx.fillStyle = this.colors.warning;
    } else {
      this.ctx.fillStyle = this.colors.danger;
    }
    this.ctx.font = "bold 20px Pixelify Sans";
    this.ctx.fillText(this.hunger, 85, 46);

    // Outline
    this.ctx.fillStyle = "#888";
    this.ctx.strokeStyle = "#000";
    this.ctx.beginPath();
    this.ctx.roundRect(8, 50, 150, 8, [6]);
    this.ctx.fill();
    this.ctx.stroke();

    // hunger bar
    if (this.hunger >= 25) {
      this.ctx.fillStyle = this.colors.success;
    } else if (this.hunger >= 5) {
        this.ctx.fillStyle = this.colors.warning;
    } else {
      this.ctx.fillStyle = this.colors.danger;
    }
    this.ctx.beginPath();
    this.ctx.roundRect(10, 52, hungerPercentage, 4, [6]);
    this.ctx.fill();
    chrome.storage.local.get(['lastMeal'], (result) => {
      if ('lastMeal' in result) {
        this.calculateHunger(result.lastMeal);
      }
    });
  }
  calculateHealth(timestamp) {
    const now = Date.now();
    const elapsed = now - timestamp;
    const hour = 3600000; // 1 hour in milliseconds
    const day = 86400000; // 24 hours in milliseconds
    // const hour = 36; // test time
    // const day = 240000; // test time

    if (this.hunger > 0) {
      this.health = 100; // Full health if less than 1 hour has passed
    } else if (elapsed >= day) {
      this.health = 0; // No health if 24 hours or more have passed
    } else {
      // Linear decrease from 100 to 0 over 23 hours
      const healthLoss = 100 * (elapsed - hour) / (day - hour);
      this.health = Math.round(100 - healthLoss);
    }
  }
  calculateHunger(lastMealTimestamp) {
    const now = Date.now();
    const elapsed = now - lastMealTimestamp;
    const threeHours = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

    if (elapsed <= 0) {
        this.hunger = 100; // Just ate, maximum hunger
    } else if (elapsed >= threeHours) {
        this.hunger = 0; // Minimum hunger after 3 hours
    } else {
        // Linear decrease from 100 to 0 over 3 hours
        const hungerDecrease = 100 * elapsed / threeHours;
        this.hunger = Math.round(100 - hungerDecrease);
    }
}
  giveFood() {
    const radius = Math.random() * 5 + 4;
    const x = Math.random() * this.canvas.width;
    const y = radius * -1;
    this.food.push({ x, y, radius, xVel: 0, yVel: 0, isGrounded: false });

    chrome.storage.local.set({ lastMeal: Date.now() }, function() {});

    this.isReplenishing = true;
  }
  replenishHealth() {
    if (this.health < 100) {
      this.health++;
    }
    if (this.hunger < 100) {
      this.hunger++;
    }
    if (this.health === 100 && this.hunger === 100) {
      this.isReplenishing = false;
    }
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