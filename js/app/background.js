/**
 * A module which displays a background for the game
 * @module app/background
 */
define(["app/config", "app/visualizer"],
function(config, Visualizer){

    /**
     * A class which displays a background for the game
     * @constructor
     * @alias module:app/background
     */
    var Background = function(){}

    /**
     * Start displaying the background
     *
     * @param {Phaser.Game} game - A reference to the current game object
     */
    Background.prototype.start = function(game) {
        this.game = game;

        this.music = this.game.add.audio('background1', 1, true);
        this.music.play();

        this.visualizer = new Visualizer(game, this.music);
    }

    /**
     * Update the background
     */
    Background.prototype.update = function(){
        this.visualizer.draw();
    }

    return new Background();

})
