/**
 * A module which exposes the Block type
 * @module app/block
 */
define(["app/grid"], function(grid){
    "use strict"

    /**
     * A object which will occupy a single cell in the game grid.
     * @constructor
     * @alias module:app/block
     *
     * @param {Phaser.Game} game - A reference to the current game
     * @param {string} direction - One of "left", "right", "top", or "bottom"
     * @param {number} position - Column or row of the block
     * @param {number} offset - How far off the grid to initially position the block
     * @param {number} [color=0xFFFFFF] - Color of the block
     */
    var Block = function(game, direction, position, offset, color) {
        /** Reference to the current game
            @type {Phaser.Game} */
        this.game = game;

        this.direction = direction;
        this.position = position;
        this.offset = offset+3;
        this.color = color || 0xFFFFFF;
        this.point = grid.directionToPoint(this.direction, this.position, this.offset);
    }

    /**
     * Show the block outside the grid.
     *
     * @param {Phaser.Point} [position] - Optional position on canvas to display at
     */
    Block.prototype.display = function(position) {
        var position = position || this.point
        this.graphics = this.game.add.graphics(position.x, position.y);
        this.graphics.lineStyle(0);
        this.graphics.beginFill(this.color, 1);
        this.graphics.drawRect(0, 0, grid.cellSize, grid.cellSize);
        this.graphics.endFill();
        return this;
    }

    /**
     * 'drop' the block onto the grid. The block must have been previously
     * displayed.
     *
     * @param {object} [coord] - Optional x, y coordinate to drop to
     */
    Block.prototype.drop = function(coord) {
        if (typeof(this.graphics) === "undefined") {
            throw("Attempt to drop a block which has not been displayed");
        }

        var coord = coord || grid.getFirstAvailable(this.direction, this.position);

        //TODO: Do this when the animation is finished?
        grid.contents[coord.y][coord.x] = this;

        var tween = this.game.add.tween(this.graphics);
        tween.to(grid.coordToPoint(coord), 200);
        tween.start();
        return this;
    }

    /**
     * Position the block at a specific coordinate (without animation)
     *
     * @param {object} coord - x, y coordinate to place the block
     */
    Block.prototype.positionAt = function(coord) {
        this.display(grid.coordToPoint(coord));
        this.drop(coord);
        return this;
    }

    return Block;
})
