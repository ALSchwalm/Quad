/**
 * A module which exposes the Quad type
 * @module app/quad
 */
define(["app/config", "Phaser", "app/block", "app/color"],
function(config, Phaser, Block, color){
    "use strict"

    /**
     * A group of four Blocks arranged in a square.
     * @constructor
     * @alias module:app/quad
     *
     * @param {Phaser.Game} game - The game object
     * @param {string} [direction="top"] - One of "left", "right", "top", or "bottom"
     * @param {number} [position=0] - Column or row of the quad
     * @param {number} [level=1] - Current game level (influences 'difficulty of quad')
     */
    var Quad = function(game, direction, position, level) {
        var direction = direction || "top";
        var position = position || 0;
        var level = level || 1;
        this.blocks = [
            new Block(game, direction, position,   1, color.genRandomColor(level)),
            new Block(game, direction, position+1, 1, color.genRandomColor(level)),
            new Block(game, direction, position,   0, color.genRandomColor(level)),
            new Block(game, direction, position+1, 0, color.genRandomColor(level))
        ];
    }

    /**
     * Show the quad outside of the grid.
     *
     * @returns - A list of the graphics objects of the underlying blocks
     */
    Quad.prototype.display = function() {
        var graphics = [];
        for (var i=0; i < this.blocks.length; ++i) {
            graphics.push(this.blocks[i].display().graphics);
        }
        return graphics;
    }

    /**
     * 'drop' the quad onto the grid.
     */
    Quad.prototype.drop = function() {
        // Sort the blocks so the 'lowest' are dropped first
        var center = {x: config.game.width/2, y: config.game.height/2};
        this.blocks.sort(function(block1, block2){
            var distance1 = Phaser.Point.distance(block1.point, center);
            var distance2 = Phaser.Point.distance(block2.point, center);
            if (distance1 < distance2) return -1;
            if (distance1 > distance2) return 1;
            return 0;
        });

        this.blocks.map(function(block){block.drop()});
        return this;
    }

    /**
     * Place the quad at 'coord' on the grid (without any animation)
     *
     * @param {object} coord - x, y coordinate to place the quad at
     */
    Quad.prototype.positionAt = function(coord) {
        this.blocks[0].positionAt(coord);
        this.blocks[1].positionAt({x: coord.x, y:coord.y+1});
        this.blocks[2].positionAt({x: coord.x+1, y:coord.y});
        this.blocks[3].positionAt({x: coord.x+1, y:coord.y+1});
        return this;
    }

    /**
     * Make the current quad unbreakable
     */
    Quad.prototype.unbreakable = function(){
        this.blocks.map(function(block){block.unbreakable()});
        return this;
    }

    return Quad;
});
