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
        game.load.audio('title', 'assets/sounds/title.mp3');
    };

    return preload;
});
