/**
 * A module returning a function which will be executed during the 'create'
 * phase of Phaser js startup
 * @module app/state/create
 */
define(["app/grid", "app/generator", "app/background", "app/music", "app/score"],
function(grid, generator, background, music, score){
    "use strict"

    /**
     * Function which will be executed by Phaser after 'preload' is finished
     * @alias module:app/state/create
     *
     * @param {Phaser.Game} game - The current game object
     */
    var create = function(game){
        music.start(game);
        background.start(game);
        grid.display(game);
        generator.start(game);
        score.init(game, grid, generator);
    };
    return create;
});
