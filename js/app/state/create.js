/**
 * A module returning a function which will be executed during the 'create'
 * phase of Phaser js startup
 * @module app/state/create
 */
define(["app/grid", "app/generator"], function(grid, generator){
    "use strict"

    /**
     * Function which will be executed by Phaser after 'preload' is finished
     * @alias module:app/state/create
     *
     * @param {Phaser.Game} game - The current game object
     */
    var create = function(game){
        grid.display(game);
        generator.start(game);
     
        var text = "Score: 0";
        var style = { font: "20px Arial", fill: "#fff", align: "center" };

        this.game.score = 0;
        this.game.scoreBoard = this.game.add.text(this.game.world.centerX + 150, 27, text, style);

   };
    return create;
});
