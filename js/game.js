var scene = {
    size: {
        x: 48 * 8,
        y: 48 * 8
    }
}

var config = {
    type: Phaser.AUTO,
    backgroundColor:0xc7f0d8,
    scale: {
        //mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'thegame',
        width: scene.size.x,
        height: scene.size.y
    },
    physics: {
        default: 'arcade',
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }

};

var game = new Phaser.Game(config);

// Global variables
// INPUTs
let keys;
// OBJECTs
let car;
let barrel;

// OBJECT PARAMETERs
let speed;

// TEXT
let score;
let highscore;
let txtScore;

// MISC
let keydown;
let gamestart;

function preload()
{
    this.load.image('car', 'images/car.png');
    // this.load.spritesheet('car', 'images/cars.png', { frameWidth: 64, frameHeight: 64 });

    this.load.image('barrel', 'images/barrel.png');
}

function create()
{
    highscore = 0;

    // INPUTs
    keys = {
        space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };

    car = this.physics.add.sprite(scene.size.x/2, scene.size.y/2, 'car');
    car.setImmovable(true);


    barrel = this.physics.add.sprite(scene.size.x/2, scene.size.y/4, 'barrel');
    barrel.setImmovable(true);

    this.physics.add.collider(car, barrel, collect, null, this);

    txtScore = this.add.text(8, 8, 'Score: 0', {color: '#43523d'});

    restart();
}

function restart()
{
    score = 0;
    updateScore(0);
    speed = 100;
    keydown = false;
    gamestart = false;

    car.setPosition(scene.size.x/2, scene.size.y/2);
    randomPlacement();

    car.setVelocity(0,0);
    car.setAngle(0);
}

function update()
{
    if (gamestart){
        movement();
        
        // OUT OF BOUNDS
        if (car.getBounds().left < 0 ||
            car.getBounds().right > scene.size.x ||
            car.getBounds().top < 0 ||
            car.getBounds().bottom > scene.size.y)
        {
            restart();
        }
        
    }
    else if (keys.space.isDown)
    {
        gamestart = true;
    }
}

function movement()
{
    // Turning
    if (keys.D.isDown)
    {
        if (!keydown)
        {
            car.setAngle(car.angle + 90);
        }
        keydown = true;
    }
    else if (keys.A.isDown)
    {
        if (!keydown)
        {
            car.setAngle(car.angle - 90);
        }
        keydown = true;
    }
    else
    {
        keydown = false
    }

    // Direction of movement
    switch(car.angle)
    {
        case 0:
            car.setVelocityX(speed);
            car.setVelocityY(0);
            break;
        case 90:
            car.setVelocityX(0);
            car.setVelocityY(speed);
            break;
        case -180:
            car.setVelocityX(-speed);
            car.setVelocityY(0);
            break;
        case -90:
            car.setVelocityX(0);
            car.setVelocityY(-speed);
    }
}

function updateScore(inc)
{
    score += inc;
    highscore = Math.max(score, highscore);
    txtScore.text = 'Score: ' + score + '\nHighscore: ' + highscore;
}

function collect()
{
    updateScore(1);
    randomPlacement();
    speed += 10;
}

function randomPlacement()
{
    var gap = 8 * 8;

    var x = Phaser.Math.Between(gap, scene.size.x - gap);
    var y = Phaser.Math.Between(gap, scene.size.y - gap);

    if (Math.abs(car.x - x) < gap 
        && Math.abs(car.y - y) < gap)
    {
        randomPlacement();
    }
    else
    {
        barrel.setPosition(x ,y);
    }
    
}
