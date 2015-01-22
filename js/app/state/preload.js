/**
 * A module returning a function which will be executed to load game assets
 * @module app/state/preload
 */
define(['app/game'], function(game){
    "use strict"

    /**
     * Function which will be executed by Phaser at start
     * @alias module:app/state/preload
     *
     * @param {Phaser.Game} game - The current game object
     */
    var preload = function(game){
        game.load.audio('attach', 'sounds/attach.wav');
        game.load.audio('destroy', 'sounds/destroy.wav');
    };

    return preload;
});
