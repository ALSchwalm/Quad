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
        game.load.script('Frequency', 'js/app/shaders/Frequency.js');
        game.load.script('Time', 'js/app/shaders/Time.js');
    };

    return preload;
});
