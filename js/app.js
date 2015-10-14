// Initial global app variables
var app = {};
app.BUG_MIN_X_LOCATION = -200; // Min X staring location of the enemies
app.BUG_MAX_X_LOCATION = -60; // Max X staring location of the enemies
app.level = 0; // Initial starting level
app.score = 0; // Initial score
app.NUMBER_OF_FIELD_ROWS = 6;
app.NUMBER_OF_FIELD_COLUMNS = 5;
app.TITLE_SIZE = 101;
app.ENEMY_WIDTH = 101;
app.BOARD_WIDTH = app.NUMBER_OF_FIELD_COLUMNS * app.TITLE_SIZE; // X dimension of the board
app.BOARD_HEIGHT = app.NUMBER_OF_FIELD_ROWS * app.TITLE_SIZE; // Y dimension of the board
app.STEP_SIZE_X = app.TITLE_SIZE; // step size in the X dimension
app.STEP_SIZE_Y = app.TITLE_SIZE * 0.9; // step size in the Y dimension


// Created a level object with an array of levels and level settings
var levelSettings = {
    "levels": [
        {
            "numberOfEnemies": 3, // Total number of enemies
            "bugMinSpeed": 50, // Min speed of enemies
            "bugMaxSpeed": 250, // Max speed of enemies
            "nextLevelScore": 2 // Number of points you need to score to proceed to next level. For testing purposes I kept it low.
        },
        {
            "numberOfEnemies": 4,
            "bugMinSpeed": 70,
            "bugMaxSpeed": 350,
            "nextLevelScore": 2
        }
    ]
};


// Function to display and update the score on the page
app.updateGameDetails = function (totalScore, playerLevel) {
    'use strict';
    $("#showScore").html(totalScore); // Shows the score
    $("#showLevel").html(playerLevel + 1); // Adding + 1 to not start the game from level 0. That would be a bit silly right?
    $("#showTotalLevels").html(levelSettings.levels.length); // Shows the total number of levels
};
// Start showing the score and level when the game starts
app.updateGameDetails(app.score, app.level);


// Enemies our player must avoid
var Enemy = function () {
    'use strict';
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.initializeEnemy();
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Made function outside the enemey class as it might be reused for other purposes like placing coin's on the lanes.
app.randomLane = function () {
    'use strict';
    var lane = {
        one: 60,
        two: 143,
        three: 226
    };
    var lanes = [lane.one, lane.two, lane.three];
    return lanes[Math.round(Math.random() * 3)];
};

// This function initializes the start location, lane and speed of the enemy.
Enemy.prototype.initializeEnemy = function () {
    'use strict';
    this.x = Math.round(Math.random() * (app.BUG_MAX_X_LOCATION - app.BUG_MIN_X_LOCATION)) + app.BUG_MIN_X_LOCATION;
    // Enemy is reset to a random lane
    this.y = app.randomLane();
    // randomSpeed function sets a random speed (with min / max boundaries) for this.bugsSpeed
    this.randomSpeed(app.level);
};

Enemy.prototype.randomSpeed = function (level) {
    'use strict';
    this.bugSpeed = Math.round(Math.random() * (levelSettings.levels[level].bugMaxSpeed - levelSettings.levels[level].bugMinSpeed)) + levelSettings.levels[level].bugMinSpeed;
};


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    'use strict';
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // The following declaration updates x coordinate of the enemy.
    this.x = this.x + this.bugSpeed * dt;
    // If the bug is outside the board viewport of the game it re-initializes the enemy and starts over
    if (this.x > (app.NUMBER_OF_FIELD_COLUMNS * app.TITLE_SIZE)) {
        // re-initializes the enemy to the new starting position and speed with a random delay between a defined min and max.
        this.initializeEnemy();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    'use strict';
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];


// Instantiate enemies
app.createEnemies = function () {
    'use strict';
    // First Empty the allEnemies array when starting a new level to avoid just creating too many enemies :)
    allEnemies = [];
    // Create enemies based on the level settings of numberOfEnemies
    for (var i = 0; i < levelSettings.levels[app.level].numberOfEnemies; i++) {
        // Creating new enemies and pushing them into the allEnemies array
        allEnemies.push(new Enemy());
    }
};
// function to initiate the game for the first time for level 0
app.createEnemies();

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function () {
    'use strict';
    // Play initial place coordinate
    this.resetPlayer();
    this.playerWidth = 80; // Used player width for determining the collission between the player and the enemy on X
    this.playerHeight = 90; // Used player Height for determining the collission between the player and the enemy on Y
    this.sprite = 'images/char-boy.png';
};

// Function that handles the keyboard input
Player.prototype.handleInput = function (keyBoardInput) {
    'use strict';
    // If left arrow is pressed && the player is not on the border left of the board the key press results in a negative stepSize X
    if (keyBoardInput === 'left' && this.x > 0) {
        this.x -= app.STEP_SIZE_X;
        // If left right is pressed && the player is not on the border right of the board the key press results in a stepSize X
    } else if (keyBoardInput === 'right' && this.x < (app.BOARD_WIDTH - app.TITLE_SIZE)) {
        this.x += app.STEP_SIZE_X;
        // If up right is pressed
    } else if (keyBoardInput === 'up') {
        // checks if player Y location is smaller than the size of one tile (Water tile). If true it adds one point to the score.
        if (this.y < app.TITLE_SIZE) {
            app.score++; // Updates the score with +1
            app.updateGameDetails(app.score, app.level); // Updated the game details with the score and level
            // If condition checks if the score is big enough to proceed to the next level if there are still levels to go
            if (app.score === levelSettings.levels[app.level].nextLevelScore && app.level < (levelSettings.levels.length - 1)) {
                app.level++; // Proceeds to the next level
                app.createEnemies(); // Call the function to create enemies for the next level
                app.score = 0; // Resets the score to 0 for the new level
                app.updateGameDetails(app.score, app.level); // Update the score and level
                // Else if condition checks if there are still levels to go. If not you get an allert and start the game again.
            } else if (app.score === levelSettings.levels[app.level].nextLevelScore && app.level === (levelSettings.levels.length - 1)) {
                app.level = 0; // Resets the game to level 0
                app.score = 0; // Resets the score back to 0
                app.createEnemies(); // Creates the Enemies for level 0
                app.updateGameDetails(app.score, app.level); // updates the score and level
                // Simpel alert message is shown when there are no more levels left to play. Game can be restarted by the user.
                alert("Hurray, you defeated all the enemies!. Click OK to start all over again");
            }
            this.resetPlayer(); // Player is reset when reaching the water
            return null;
        }
        this.y -= app.STEP_SIZE_Y; // If you didn't reach the water you can still go up a tile
        // Checks when the user press the down arrow if the player within the board range
    } else if (keyBoardInput === 'down' && this.y < (app.BOARD_HEIGHT - 2 * app.TITLE_SIZE)) {
        this.y += app.STEP_SIZE_Y;
    } else {
        return null; // If other keys are pressed... it doesn't return anything
    }
};

// Didn't use the update function for the player.
Player.prototype.update = function() {

};

// This function draws the player on the screen.
Player.prototype.render = function() {
    'use strict';
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Function to reset the player to its original position
Player.prototype.resetPlayer = function() {
    'use strict';
    // Starting position is based on the number of columns on the board. Added in this way to have the
    // option to add additional columns when reaching certain game levels and the player would still me centered
    this.x = (Math.floor(app.NUMBER_OF_FIELD_COLUMNS / 2) * app.TITLE_SIZE);
    this.y = app.BOARD_HEIGHT - 2 * app.TITLE_SIZE;
};


// Place the player object in a variable called player
var player = new Player();

// The checkCollisions fuctions is called in the engine.js file and checks if the enemy and the player collided.
// Upon collision we minus the score by two and reset the players location to the starting point.
app.checkCollisions = function (){
    'use strict';
    //console.log(allEnemies);
    // Here we loop through array of enemies
    for (var i = 0; i < levelSettings.levels[app.level].numberOfEnemies; i++) {
        //console.log(allEnemies[i].y);
        // Here we determine the x coordinate of the left side of the player
        var leftXLocationPlayer = player.x + (app.TITLE_SIZE - player.playerWidth);
        // Here we determine the x coordinate of the right side of the player
        var rightXLocationPlayer = player.x + player.playerWidth;
        // Here we check if the player and the enemy are within the same lane range of each enemy in the allEnemies array.
        if ((player.y - allEnemies[i].y) < 0 && (player.y - allEnemies[i].y) > -player.playerHeight) {
            // Here we check if the player and the enemy are touching each other on th x axel.
            if (((allEnemies[i].x + app.ENEMY_WIDTH) - leftXLocationPlayer) > 0 && ((rightXLocationPlayer) - allEnemies[i].x) > 0) {
                // Oh nohhhh the player collided with one of the enemies and its location is reset and the score is lowered by -2.
                app.score = app.score - 2;
                // Updating the score on the page
                app.updateGameDetails(app.score, app.level);
                // Resetting the players position
                player.resetPlayer();
            }
        }
    }
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});



