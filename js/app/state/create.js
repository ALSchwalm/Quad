/**
 * A module returning a function which will be executed during the 'create'
 * phase of Phaser js startup
 * @module app/state/create
 */
define(["app/grid", "app/score", "app/generator", "app/background"],
    function(grid, score, generator, background){
        "use strict"

        /**
         * Function which will be executed by Phaser after 'preload' is finished
         * @alias module:app/state/create
         *
         * @param {Phaser.Game} game - The current game object
         */
        var create = function(game){
            grid.display(game);
            background.start(game);
            generator.start(game);
            score.init(game, grid, generator);
            
            game.scoreboard = score;
            game.generator = generator;
        };

        return create;
});
