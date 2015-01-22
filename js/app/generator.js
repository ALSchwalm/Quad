/**
 * A singleton which spawns quads at random times and locations
 * @module app/generator
 */
define(["app/config", "app/quad", "app/grid"],
function(config, Quad, grid){
    "use strict"

    /**
     * @constructor
     * @alias module:app/generator
     */
    var Generator = function() {
        /**
         * The current level of the game
         * @type {number}
         */
        this.level = 1;

        /**
         * A list of quads currently 'waiting' (that is, which have not been dropped)
         * @type {Quad[]}
         */
        this.waitingQuads = [];

        /**
         * A list of quads currently falling
         * @type {Quad[]}
         */
        this.fallingQuads = [];

        /**
         * Timer which causes the waiting quads to drop when fired
         *
         * @type {Phaser.Timer}
         */
        this.dropTimer = null;

        this.timerGraphic = null;

        this.directions = [
            "top",
            "left",
            "right",
            "bottom",
        ];

        // Minus 1 because the cells are 0 index
        this.centerCell = Math.floor(config.grid.numCells/2)-1;
    }

    /**
     * Generate a random Quad
     * @todo account for level and prevent overlap
     *
     * @param {Phaser.Game} game - Reference to the current game
     */
    Generator.prototype.genRandomQuad = function(game){
        return new Quad(game, "top", this.centerCell, this.level);
    };

    /**
     * Begin 'dropping' quads
     *
     * @param {Phaser.Game} game - Reference to the current game
     * @todo This function is largely a placeholder
     */
    Generator.prototype.start = function(game) {
        this.game = game;
        this.dropTimer = this.game.time.create(false);
        this.dropTimer.loop(config.generator.defaultWait*Phaser.Timer.SECOND,
                            this.drop.bind(this));
        this.timerGraphic = this.game.add.graphics();
        var self=this;

        //TODO: This should probably go somewhere else
        var centerQuad = new Quad(game).positionAt({
            x: self.centerCell,
            y: self.centerCell
        }).unbreakable();

        this.spawn();
        return this;
    }

    /**
     * Spawn a new quad (or group of quads)
     */
    Generator.prototype.spawn = function() {
        // Simple, temporary logic. Spawn a new quad every few seconds
        var quad = this.genRandomQuad(this.game);
        this.waitingQuads.push(quad);
        quad.display();
        this.dropTimer.start();
    }

    /**
     * Drop all waiting quads onto the game grid
     */
    Generator.prototype.drop = function() {
        this.dropTimer.stop(false);
        this.waitingQuads.map(function(quad){
            this.fallingQuads.push(quad);
            quad.drop();
            quad.onDropComplete.push(function(){
                var index = this.fallingQuads.indexOf(quad);
                this.fallingQuads.splice(index, 1);
                this.spawn();
            }.bind(this));
        }.bind(this));
        this.waitingQuads = [];
        return this;
    }

    /**
     * Show where waiting blocks would be placed
     */
    Generator.prototype.highlightPath = function() {
        this.waitingQuads.map(function(quad){
            quad.highlightPath();
        })
        return this;
    }

    /**
     * Update the generator graphics. This should be called from the
     * Phaser update callback function.
     */
    Generator.prototype.update = function() {
        this.drawTimerGraphics();
    }

    /**
     * Draw the graphics showing the time remaining before the next drop
     */
    Generator.prototype.drawTimerGraphics = function() {
        this.timerGraphic.clear();
        var percentElapsed =
                this.dropTimer.ms/(config.generator.defaultWait*1000)
        if (percentElapsed > 1)
            percentElapsed = 1;
        else if (percentElapsed < 0)
            percentElapsed = 0;

        var percentRemaining = 1-percentElapsed;
        var point = grid.coordToPoint(grid.middle);

        this.timerGraphic.lineStyle(1, 0x333333, 1);
        this.timerGraphic.beginFill(0x000000, 0.3);
        this.timerGraphic.drawRect(point.x-grid.cellSize, point.y-grid.cellSize,
                                   grid.cellSize*2, grid.cellSize*2);
        this.timerGraphic.endFill();

        this.timerGraphic.beginFill(0xFFFFFF, 1);
        this.timerGraphic.drawRect(point.x-(grid.cellSize*percentRemaining),
                                   point.y-(grid.cellSize*percentRemaining),
                                   grid.cellSize*2*percentRemaining,
                                   grid.cellSize*2*percentRemaining);
        this.timerGraphic.endFill();
    }

    /**
     * Stop 'dropping' quads
     */
    Generator.prototype.stop = function() {
        this.dropTimer.stop(false);
        return this;
    }

    /**
     * Rotate all un-dropped quads clockwise
     */
    Generator.prototype.rotateCW = function() {
        this.waitingQuads.map(function(quad){
            quad.rotateCW();
        })
    }

    /**
     * Rotate all un-dropped quads counter-clockwise
     */
    Generator.prototype.rotateCCW = function() {
        this.waitingQuads.map(function(quad){
            quad.rotateCCW();
        })
    }

    var generator = new Generator();
    return generator;
});
