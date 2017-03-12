// GameBoard code below
var aliens = [];
var MAXALIENS = 0;

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function Spaceship(game) {
    this.img = ASSET_MANAGER.getAsset("./img/spaceship.png");
    this.game = game;
    this.player = 1;
    this.radius = 20;
    this.visualRadius = 500;
    this.x = 500;
    this.y = 475;
    this.canvasWidth = 1000;
    this.canvasHeight = 500;
    this.speed = 5;
    this.direction = "goright";
    this.shoot = false;
    this.name = "spaceship";
    // this.startTime = game.timer.gameTime;
    this.spawnRate = 5000;
    this.lastSpawn = -1;




};

Spaceship.prototype = new Entity();
Spaceship.prototype.constructor = Spaceship;

Spaceship.prototype.update = function() {
    var time = Date.now();
    if (time > (this.lastSpawn + this.spawnRate)) {
        this.lastSpawn = time;
        var a = new Asteroid(this.game);
        this.game.addEntity(a);
    }
    Entity.prototype.update.call(this);

    // if (this.direction === "goright") {
    //     this.x += this.speed;

    //     if (this.collideRight()) {
    //         this.direction = "goleft";
    //     }
    // }

    // if (this.direction === "goleft") {
    //     this.x -= this.speed;
    //     if (this.collideLeft()) {
    //         this.direction = "goright";
    //     }
    // }

    var entity = null;

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        var rangeX = Math.abs(ent.x - this.x);
        var rangeY = Math.abs(ent.y - this.y);
        if (ent.name === "alien") {
            // this.x = ent.x;
            if (rangeX <= 1000 & rangeY <= 200) {
                if (this.x > ent.x) {
                    // this.direction = "goleft";
                    this.x = ent.x;

                    var bullet = new Bullet(this.game, this);
                    this.game.addEntity(bullet);
                    break;


                } else if (this.x < ent.x) {
                    this.x = ent.x;
                    // this.direction = "goright";
                    var bullet = new Bullet(this.game, this);
                    this.game.addEntity(bullet);
                    break;
                }

            }


        }

    }

}

Spaceship.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "blue"
        // ctx.fillRect(this.x - 20, this.y - 50, 70, 80);
    ctx.drawImage(this.img, this.x - 20, this.y - 50, 70, 80);
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

};

Spaceship.prototype.collide = function(other) {
    return distance(this, other) < this.radius + other.radius;
};

Spaceship.prototype.collideLeft = function() {
    return (this.x - this.radius) < 0;
};

Spaceship.prototype.collideRight = function() {
    return (this.x + this.radius) > this.canvasWidth - 30;
};

Spaceship.prototype.collideTop = function() {
    return (this.y - this.radius) < 0;
};

Spaceship.prototype.collideBottom = function() {
    return (this.y + this.radius) > this.canvasHeight;
};


function AlienShip(game) {
    this.game = game;
    this.player = 1;
    this.radius = 20;
    this.visualRadius = 500;
    this.width = 50;
    this.height = 50;
    this.removeFromWorld = false;
    this.ship1 = ASSET_MANAGER.getAsset("./img/alienship1.png");
    this.ship2 = ASSET_MANAGER.getAsset("./img/alienship2.png");
    this.ship3 = ASSET_MANAGER.getAsset("./img/alienship3.png");
    var shipArr = [this.ship1, this.ship2, this.ship3];
    this.shipImg = shipArr[getRandomInt(0, 3)];
    this.name = "alien";
    // this.x = getRandomInt(0, 1000);
    // this.y = getRandomInt(0, 400);
    this.canvasWidth = 1000;
    this.canvasHeight = 500;
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));

    this.velocity = { x: Math.random() * 500, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
}


AlienShip.prototype.collide = function(other) {
    return distance(this, other) < this.radius + other.radius;
};

AlienShip.prototype.collideLeft = function() {
    return (this.x - this.radius) < 0;
};

AlienShip.prototype.collideRight = function() {
    return (this.x + this.radius) > this.canvasWidth - 50;
};

AlienShip.prototype.collideTop = function() {
    return (this.y - this.radius) < 0;
};

AlienShip.prototype.collideBottom = function() {
    return (this.y + this.radius) > this.canvasHeight - 100;
};
AlienShip.prototype.update = function() {

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = (this.canvasWidth - 50) - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = (this.canvasHeight - 100) - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }
    var removeAlien = this;
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && this.collide(ent) && ent.name === "bullet" ||
            ent !== this && this.collide(ent) && ent.name === "asteroid") {
            this.removeFromWorld = true;
            // removeAlien = ent;
        }

    }

    if (removeAlien.removeFromWorld) {
        for (var i = 0; i < aliens.length; i++) {
            if (aliens[i] === removeAlien) {
                aliens.splice(1, i);
            }

        }
    }

    if (aliens.length < 7) {
        var a = new AlienShip(this.game);
        this.game.addEntity(a);
        aliens.push(a);
    }
    // console.log(aliens.length);
    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;


};

AlienShip.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "white"
        // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(this.shipImg, this.x, this.y, this.width, this.height);
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

};


function Bullet(game, ship) {
    this.game = game;
    this.x = ship.x;
    this.y = ship.y;
    this.player = 1;
    this.radius = 20;
    this.visualRadius = 500;
    this.removeFromWorld = false;
    this.canvasWidth = 1000;
    this.canvasHeight = 500;
    this.width = 2;
    this.height = 5;
    this.name = "bullet";
}

Bullet.prototype.update = function() {
    this.y -= 2;

    if (this.y <= -this.canvasHeight) {
        this.removeFromWorld = true;
    }

    // if(aliens < MAXALIENS) {}
    // for (var i = 0; i < this.game.entities.length; i++) {
    //     var ent = this.game.entities[i];
    //     if (ent !== this && this.collide(ent) && ent.name === "alien") {
    //         this.removeFromWorld = true;

    //     }
    // }

};

Bullet.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "orange"
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillRect(this.x + 30, this.y, this.width, this.height);
    ctx.fill();
    ctx.closePath();
};

Bullet.prototype.collide = function(other) {
    return distance(this, other) < this.radius + other.radius;
};

Bullet.prototype.collideLeft = function() {
    return (this.x - this.radius) < 0;
};

Bullet.prototype.collideRight = function() {
    return (this.x + this.radius) > this.canvasWidth - 30;
};

Bullet.prototype.collideTop = function() {
    return (this.y - this.radius) < 0;
};

Bullet.prototype.collideBottom = function() {
    return (this.y + this.radius) > this.canvasHeight;
};


function Asteroid(game) {
    this.game = game;
    this.width = 100;
    this.height = 100;
    this.removeFromWorld = false;
    this.player = 1;
    this.radius = 20;
    this.visualRadius = 500;
    this.asteroid1 = ASSET_MANAGER.getAsset("./img/a1.png");
    this.asteroid2 = ASSET_MANAGER.getAsset("./img/a2.png");
    this.asteroid3 = ASSET_MANAGER.getAsset("./img/a3.png");
    var shipArr = [this.asteroid1, this.asteroid2, this.asteroid3];
    this.img = shipArr[getRandomInt(0, 3)];
    this.name = "asteroid";
    this.x = 0;
    this.y = 0;
    this.x2 = 1000;
    this.y2 = 500;
    this.dx = this.x2 - this.x;
    this.dy = this.y2 - this.y;
    this.angle = Math.atan2(this.dy, this.dx);
    this.speed = 5;
    this.b_dy = Math.sin(this.angle) * this.speed;
    this.b_dx = Math.cos(this.angle) * this.speed;
}
Asteroid.prototype.update = function() {
    this.x += this.b_dx;
    this.y += this.b_dy;

    if (this.collideRight() || this.collideBottom()) {
        this.removeFromWorld = true;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        // console.log("here");
        // console.log(ent.name);
        // console.log(this.collide(ent));
        if (this.collide(ent) && ent.name === "alien") {
            // console.log("collided!");
            ent.removeFromWorld = true;
        }

    }
};


Asteroid.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.closePath();
};

Asteroid.prototype.collide = function(other) {
    return distance(this, other) < this.radius + other.radius;
};

Asteroid.prototype.collideLeft = function() {
    return (this.x - this.radius) < 0;
};

Asteroid.prototype.collideRight = function() {
    return (this.x + this.radius) > this.canvasWidth - 30;
};

Asteroid.prototype.collideTop = function() {
    return (this.y - this.radius) < 0;
};

Asteroid.prototype.collideBottom = function() {
    return (this.y + this.radius) > this.canvasHeight;
};



function Background(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.canvasWidth = 1000;
    this.canvasHeight = 500;
    this.removeFromWorld = false;
    this.img = ASSET_MANAGER.getAsset("./img/background.jpg");
    this.temp = y;
    // body...
}

Background.prototype.update = function() {
    this.y += 1;

    if (this.y >= this.canvasHeight) {
        this.y = 0;
    }
    // if (this.y < -this.canvasHeight) {
    //     this.y = 0;
    //     this.x = 0;
    //     var newBackground = new Background(this.game, this.x, this.y);
    //     this.game.entities.unshift(newBackground);
    //     this.removeFromWorld = true;

    // }
};

Background.prototype.draw = function(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.canvasWidth, this.canvasHeight);
    ctx.drawImage(this.img, this.x, this.y - this.canvasHeight, this.canvasWidth, this.canvasHeight);
};

// the "main" code begins here
var friction = 1;
var acceleration = 1000000;
var maxSpeed = 75;

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");
ASSET_MANAGER.queueDownload("./img/background.jpg");
ASSET_MANAGER.queueDownload("./img/spaceship.png");
ASSET_MANAGER.queueDownload("./img/alienship1.png");
ASSET_MANAGER.queueDownload("./img/alienship2.png");
ASSET_MANAGER.queueDownload("./img/alienship3.png");
ASSET_MANAGER.queueDownload("./img/a1.png");
ASSET_MANAGER.queueDownload("./img/a2.png");
ASSET_MANAGER.queueDownload("./img/a3.png");


ASSET_MANAGER.downloadAll(function() {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    var gameEngine = new GameEngine();
    var ship = new Spaceship(gameEngine);
    var background = new Background(gameEngine, 0, 0);
    gameEngine.addEntity(background);
    gameEngine.addEntity(ship);
    MAXALIENS = getRandomInt(10, 50);
    for (var i = 0; i < MAXALIENS; i++) {
        var alien = new AlienShip(gameEngine);
        gameEngine.addEntity(alien);
        aliens.push(alien);

    }

    gameEngine.init(ctx);
    gameEngine.start();
});


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
