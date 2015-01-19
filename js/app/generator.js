/**
 * A singleton which spawns quads at random times and locations
 * @module app/generator
 */
define(["app/config", "app/quad"],
function(config, Quad){
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
        var self=this;

        //TODO: This should probably go somewhere else
        var centerQuad = new Quad(game).positionAt({
            x: self.centerCell,
            y: self.centerCell
        }).unbreakable().display();

        // Simple, temporary logic. Spawn a new quad at the top every few seconds
        // and wait a short time before dropping
        this.intervalID = setInterval(function(){
            var quad = this.genRandomQuad(game);
            this.waitingQuads.push(quad);
            quad.display();
            setTimeout(function(){
                // the (no joke) correct way to remove an item from a list in js
                var index = this.waitingQuads.indexOf(quad);
                this.waitingQuads.splice(index, 1);
                this.fallingQuads.push(quad);
                quad.drop();

                quad.onDropComplete.push(function(){
                    var index = this.fallingQuads.indexOf(quad);
                    this.fallingQuads.splice(index, 1);
                }.bind(this));
            }.bind(this), 4000);
        }.bind(this), 5000);
        return this;
    }

    /**
     * Stop 'dropping' quads
     */
    Generator.prototype.stop = function() {
        clearInterval(this.intervalID);
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
