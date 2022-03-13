const canvas = document.querySelector('.my-canvas');
const ctx = canvas.getContext('2d');

console.log(canvas);

// set canvas dimensions 
canvas.width = 1120;
canvas.height = 560;

// gravity
let gravity = 2;

// distance
let distance = 0;

class Player {
    constructor() {
        this.height = 50;
        this.width = 50;
        this.touchedSurface = false;
        this.upJumpReleased = false;
        this.falling = false;
        this.hitPlatformBottom = false;
        this.position = {
            x: 305,
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
            this.upJumpReleased = true;
            this.touchedSurface = true;
        }
    }
}

class Platform {
    constructor({topImgSource, bottomImgSource = null, positionX, positionY, numberOfPlatforms}) {
        this.topImage = new Image();
        this.bottomImage = new Image();
        this.topImgSource = topImgSource;
        this.bottomImgSource = bottomImgSource;
        this.width = 0;
        this.height = 0;
        this.touchedSurface = false;
        this.upJumpReleased = false;
        this.numberOfPlatforms = numberOfPlatforms;
        this.position = {
            x: positionX,
            y: positionY
        }
        this.velocity = {
            x: 2,
            y: 2
        }
    }

    draw () {
        this.topImage.src = this.topImgSource;
        this.bottomImage.src = this.bottomImgSource;
        this.width = this.topImage.width;
        this.height = this.bottomImage.height;
        ctx.drawImage(this.topImage, this.position.x, this.position.y, this.width, this.height); 
        ctx.drawImage(this.bottomImage, this.position.x, this.position.y + this.height, this.width, this.height);         
    }

    update () {
        this.draw();
    }
}

class TopPlatform extends Platform {
    draw () {
        this.topImage.src = this.topImgSource;
        this.bottomImage.src = this.bottomImgSource;
        this.width = this.topImage.width;
        this.height = this.topImage.height;
        ctx.drawImage(this.topImage, this.position.x, this.position.y, this.width, this.height); 
    }
}


const platformSprites = {
    grassMid: "/platformerGraphicsDeluxe_Updated/Tiles/grassMid.png",
    grassCenter: "/platformerGraphicsDeluxe_Updated/Tiles/grassCenter.png"

}

// bottom platforms creation

const platforms = [];
let platFormsStart = 0;

function createPlatforms ({num, gapWith}) {
    platFormsStart += gapWith;
    for(let i = 0; i < num; i++) {
        platforms.push(new Platform({topImgSource: platformSprites.grassMid, bottomImgSource: platformSprites.grassCenter, positionX: platFormsStart, positionY: 430}));
        platFormsStart += 70;
    }
}

const platFormParameters = [{num: 8, gapWith: 0}, {num: 14, gapWith: 400}, {num: 8, gapWith: 250}, {num: 20, gapWith: 250}, {num: 8, gapWith: 250},{num: 15, gapWith: 250}, {num: 8, gapWith: 200}, {num: 20, gapWith: 250}];

platFormParameters.forEach(param => {
    createPlatforms(param);
});

// top platforms creation
const topPlatforms = [];
let topPlatformStart = 100;

const topPlatform = new TopPlatform({topImgSource: platformSprites.grassMid, positionX: 700, positionY: 200})

// create player
const player = new Player();

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

    // update top platforms
    topPlatform.update();

    if(player.position.y + player.height + player.velocity.y >= topPlatform.position.y && player.position.y <= topPlatform.position.y - 1 && player.position.x + player.width >= topPlatform.position.x && player.position.x <= topPlatform.position.x + topPlatform.width && player.velocity.y > 0) {
        player.velocity.y = 0;
        player.touchedSurface = true;
    }

    // update platforms
    platforms.forEach(platform => {
        platform.update();
        // top of platform 
        if(player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.y <= platform.position.y - 1 && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width && player.velocity.y > 0) {
            player.velocity.y = 0;
            player.touchedSurface = true;
        }
    })

    if (keys.right) {
        if (player.position.x < 700) {
            player.position.x += 5;
        } else {
            platforms.forEach(platform => {
                platform.position.x -= 5;
            });

            topPlatform.position.x -= 5;
        }

        distance += 5;
    
    }

    // continue here solving the problem of near start behaviour

    if (keys.left) {

        if (distance > 300) {
            if (player.position.x > 300) {
                player.position.x -= 5;
            } else {
                platforms.forEach(platform => {
                    platform.position.x += 5;
                });
    
                topPlatform.position.x +=5;
            }
            distance -= 5;
        } else {
            player.position.x -= 5;
            distance -= 5;
        }


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

