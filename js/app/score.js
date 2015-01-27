/**
 * @module app/score
 */
define(['app/config'], function(config){
    "use strict"

    /**
     * Score constructor
     */
    var Score = function() {
        this.board = 0;
        this.current = 0;
        this.level = 0;
    }

    /**
     * Initialize score
     */
    Score.prototype.init = function(game, grid, generator) {
        var text = "Level: 1\nScore: 0";
        var style = { 
            font: "20px Arial",
            fill: "#fff", 
            align: "left",
            shadowColor: "#000000",
            shadowOffsetX: 1,
            shadowOffsetY: 1 
        };
        this.board = game.add.text(game.world.centerX + 150, 27, text, style);
        this.grid = grid;
        this.generator = generator;
    }

    /**
     * Get current score.
     */
    Score.prototype.getCurrent = function() {
        return this.current;
    }

    /**
     * Get current level.
     */
    Score.prototype.getLevel = function() {
        return this.level;
    }

    /**
     * Update the scoreboard and level.
     */
    Score.prototype.update = function(clearCount) {
        var points = Math.pow(clearCount, config.points[this.level]);
        var levelDisplay = this.level + 1;
        this.current += Math.floor(points);
        this.board.text = "Level: " + levelDisplay + "\nScore: " + this.current;
        this.calcLevel();
    }

    /**
     * Calculate what level we are on now.
     */
    Score.prototype.calcLevel = function() {
        for (var i = config.checkpoints.length - 1; i >= 0; i--) {
            if (this.current >= config.checkpoints[i]) {
                if (this.level < i + 1) {
                    this.level = i + 1;
                    this.generator.updateCurrentQuadLevel(this.level);
                    this.update(0, this.level);
                    this.grid.clearAll();
                }
                return this.level;
            }
        }
        return 0;
    }

    return new Score();

});
