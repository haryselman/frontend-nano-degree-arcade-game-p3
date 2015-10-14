frontend-nanodegree-arcade-game
===============================

1) Running the Game
Open the index.html file (in root folder) in your browser to load the game. You can also decide to host the game on a webserver to make it avalable to other players / users.

2) Playing the game
The game is played by using the Up, Down, Left & Right arrow keys to move the player.
The aim for the player is to reach water by crossing the road. Each time you have crossed the road you will score 1 point.
Beware of the bug enemies however. Every time you bump into one your position is reset to the original player location and 2 points are deduced from the total.

The game has levels. If you are interested in adding more levels or change the difficulty of the game you can adjust the levelSettings object in the js/app.js file.
See below for the standard configuration. To add more levels you can add an extra level object to the levels arrays.
If you finish the last level the game can be reset and you can start all over again. Good luck playing!

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