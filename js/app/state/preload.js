/**
 * A module returning a function which will be executed to load game assets
 * @module app/state/preload
 */
define(function(){
    "use strict"

    /**
     * Function which will be executed by Phaser at start
     * @alias module:app/state/preload
     *
     * @param {Phaser.Game} game - The current game object
     */
    var preload = function(game){
        game.load.audio('attach', 'assets/sounds/attach.wav');
        game.load.audio('destroy', 'assets/sounds/destroy.wav');
        game.load.audio('move', 'assets/sounds/move.wav');
        game.load.audio('rotate', 'assets/sounds/rotate.wav');
        game.load.audio('background1', 'assets/sounds/background1.mp3');
        game.load.audio('background2', 'assets/sounds/background2.mp3');
        game.load.audio('background3', 'assets/sounds/background3.mp3');
        game.load.audio('background4', 'assets/sounds/background4.mp3');
    };

    return preload;
});
