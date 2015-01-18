/**
 * Exposes a singleton Grid which defines the main gameplay field
 * @module app/grid
 */
define(["app/config", "Phaser"], function(config, Phaser){
    "use strict"

    /**
     * A group of four Blocks arranged in a square.
     * @constructor
     * @alias module:app/grid
     */
    var Grid = function(){
        this.cellSize = config.grid.size / config.grid.numCells;

        // Center the grid
        this.offsets = {
            x : config.game.width/2 - config.grid.size/2,
            y : config.game.height/2 - config.grid.size/2
        }

        /**
         * The contents of the grid
         * @type {Block[][]}
         */
        this.contents = new Array(config.grid.numCells);
        for (var i=0; i < config.grid.numCells; ++i) {
            this.contents[i] = new Array(config.grid.numCells);
        }
    };

    /**
     * Show the grid of 'cells' that the blocks can be moved around on
     */
    Grid.prototype.display = function(game) {
        this.graphics = game.add.graphics(this.offsets.x, this.offsets.y);
        this.graphics.lineStyle(1, 0xFFFFFF, 0.2);

        if (config.grid.linesVisible) {
            // Draw rows and columns (start from one so the top and left aren't drawn twice)
            for (var i=1; i < config.grid.numCells; ++i) {
                this.graphics.drawRect(0, i*this.cellSize, config.grid.size, 1);
                this.graphics.drawRect(i*this.cellSize, 0, 1, config.grid.size);
            }
        }

        // Draw a border around the grid area
        this.graphics.drawRect(0, 0, config.grid.size, 1);
        this.graphics.drawRect(0, 0, 1, config.grid.size);
        this.graphics.drawRect(0, config.grid.size, config.grid.size, 1);
        this.graphics.drawRect(config.grid.size, 0, 1, config.grid.size);
        return this;
    }

    /**
     * Convert a coordinate in the grid to a point on the canvas
     *
     * @param {object} coord - An x, y coordinate on the grid
     * @returns {Phaser.Point} - The point at the upper left of the given cell coordinate
     */
    Grid.prototype.coordToPoint = function(coord) {
        var self=this;
        return new Phaser.Point(
            self.cellSize*coord.x + self.offsets.x,
            self.cellSize*coord.y + self.offsets.y
        );
    }

    /**
     * Convert a direction and a position to a point on the canvas. The returned
     * position is the top left corner of the cell within the grid that is positioned
     * as far as possible in `direction` along column/row `position`.
     *
     * @param {string} direction - One of "left", "right", "top", or "bottom"
     * @param {number} position - A number indicating the row/column
     * @param {number} offset - A number indicating how far past the position, the
     *                          result should be padded
     * @returns {Phaser.Point}
     */
    Grid.prototype.directionToPoint = function(direction, position, offset) {
        var offset = offset || 0;
        switch(direction.toLowerCase()) {
        case "top":
            return this.coordToPoint({x: position, y: -1*offset});
            break;
        case "right":
            return this.coordToPoint({x: config.grid.numCells-1+offset,
                                      y: position});
            break;
        case "bottom":
            return this.coordToPoint({x: config.grid.numCells-1-position,
                                      y: config.grid.numCells-1+offset});
            break;
        case "left":
            return this.coordToPoint({x: -1*offset,
                                      y: config.grid.numCells-1-position});
            break;
        default:
            throw("Invalid argument to 'directionToPoint': " + direction);
        }
    }

    /**
     * Get the first free position on the grid when comming from `direction` at
     * `position`. This is the coordinate that a block should take if it is being
     * 'dropped'.
     *
     * @param {string} direction - One of "left", "right", "top", or "bottom"
     * @position {number} position - The index of the row or column of the block
     *                               being 'dropped'
     * @returns - The first free position when comming from `direction` at `position`
     */
    Grid.prototype.getFirstAvailable = function(direction, position) {
        var coord;
        switch(direction.toLowerCase()) {
        case "top":
            for (var i=0; i < config.grid.numCells; ++i) {
                if (this.contents[i][position]) {
                    coord = {x: position, y: i-1};
                    break;
                }
            }
            break;
        case "right":
            for (var i=config.grid.numCells-1; i >= 0; --i) {
                if (this.contents[position][i]) {
                    coord = {x: i+1, y: position};
                    break;
                }
            }
            break;
        case "bottom":
            for (var i=config.grid.numCells-1; i >= 0; --i) {
                if (this.contents[i][config.grid.numCells-1-position]) {
                    coord = {x: config.grid.numCells-1-position, y: i+1};
                    break;
                }
            }
            break;
        case "left":
            for (var i=0; i < config.grid.numCells; ++i) {
                if (this.contents[config.grid.numCells-1-position][i]) {
                    coord = {x: i-1, y: config.grid.numCells-1-position};
                    break;
                }
            }
            break;
        default:
            throw("Invalid argument to 'getFirstAvailable': " + direction);
        }
        return coord;
    }

    /**
     * The singleton gameplay grid
     * @type {Grid}
     */
    var grid = new Grid();

    return grid;
})
