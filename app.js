const canvas = document.querySelector('.my-canvas');
const ctx = canvas.getContext('2d');

console.log(canvas);

// set canvas dimensions 
canvas.width = 1120;
canvas.height = 560;

// gravity
let gravity = 2;

class Player {
    constructor() {
        this.height = 50;
        this.width = 50;
        this.touchedSurface = false;
        this.upJumpReleased = false;
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
    }

    draw () {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update () {
        this.draw();
        if (this.position.y + this.height + this.velocity.y < canvas.height) {
            this.position.y += this.velocity.y;
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
            this.touchedSurface = true;
        }
    }
}

class Platform {
    constructor({positionX, positionY, width, height}) {
        this.width = width;
        this.height = height;
        this.touchedSurface = false;
        this.upJumpReleased = false;
        this.position = {
            x: positionX,
            y: positionY
        }
        // this.velocity = {
        //     x: 0,
        //     y: 0
        // }
    }

    draw () {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update () {
        this.draw();
    }
}

//create player
const player = new Player();

const platforms = [new Platform({positionX: 200, positionY: 350, width: 300, height: 30})]


// keys state
const keys = {
    right: false,
    left: false
}

function animate () {
    requestAnimationFrame(animate);

    // fill and clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // update player
    player.update();

    // update platforms
    platforms.forEach(platform => {
        platform.update();
        if(player.position.y + player.height >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0;
            // graviwdty = 0;
            player.touchedSurface = true;
        }
    })

    if (keys.right) {
        player.position.x += 5;
    }

    if (keys.left) {
        player.position.x -= 5;
    }

    
}

animate();

// event listener for keydown 
window.addEventListener('keydown', ({key}) => {

    console.log(key);

    switch(key.toLocaleLowerCase()) {
        case 'w':
          if (player.touchedSurface && player.upJumpReleased) {
              player.velocity.y -= 40;
              player.touchedSurface = false;
              player.upJumpReleased = false;
          }
          break;
        case 'a':
          keys.left = true;
          break;
        case 'd':
          keys.right = true;
          break;
        default:
          // code block
      }
});

// event listener for keyup 
window.addEventListener('keyup', ({key}) => {

    console.log(key);

    switch(key.toLocaleLowerCase()) {
        case 'w':
          player.upJumpReleased = true;
          break;
        case 'a':
          keys.left = false;
          break;
        case 'd':
          keys.right = false;
          break;
        default:
          // code block
      }
});

