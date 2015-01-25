/**
 * A module returning a function which will be executed during the 'create'
 * phase of Phaser js startup
 * @module app/state/create
 */
define(["app/grid", "app/generator", "app/background", "app/music"],
function(grid, generator, background, music){
    "use strict"

    /**
     * Function which will be executed by Phaser after 'preload' is finished
     * @alias module:app/state/create
     *
     * @param {Phaser.Game} game - The current game object
     */
    var create = function(game){
        music.start(game, 'background1');
        background.start(game);
        grid.display(game);
        generator.start(game);
    };
    return create;
});
