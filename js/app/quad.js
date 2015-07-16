/**
 * A module which exposes the Quad type
 * @module app/quad
 */
define(["app/config", "Phaser", "app/block", "app/color", "app/score"],
function(config, Phaser, Block, color, score){
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
        this.game = game;
        this.direction = direction || "top";
        this.position = position || 0;
        this.level = level || 0;
        this.visible = false;
        this.blocks = [
            new Block(game, this.direction, this.position,   1, color.genRandomColor(this.level)),
            new Block(game, this.direction, this.position+1, 1, color.genRandomColor(this.level)),
            new Block(game, this.direction, this.position,   0, color.genRandomColor(this.level)),
            new Block(game, this.direction, this.position+1, 0, color.genRandomColor(this.level))
        ];

        this.directions = [
            "top",
            "right",
            "bottom",
            "left",
        ];


        /**
         * Callbacks to be executed when all blocks of the quad have landed
         *
         * @type {function[]}
         */
        this.onDropComplete = [
            function () {
                this.game.add.audio('attach', 0.5).play();
                if (this.blocks.some(function(block){ return block.clearedBlocks })) {
                    ++score.combo;
                } else {
                    score.combo = 0;
                }
            }.bind(this)
        ]

        // fire this.onDropComplete when all blocks have been dropped
        this.dropped = 0;
        var dropComplete = function(){
            this.dropped += 1;
            if (this.dropped === this.blocks.length) {
                this.onDropComplete.map(function(callback){
                    callback();
                })
            }
        }.bind(this);
        this.blocks.map(function(block){
            block.onDropComplete.push(dropComplete);
        })
    }

    /**
     * Show the quad outside of the grid.
     */
    Quad.prototype.display = function(position) {
        this.visible = true;
        for (var i=0; i < this.blocks.length; ++i) {
            if (position) {
                var right = false;
                var up = this.blocks[i].offset
                if (this.blocks[i].position != this.position)
                    right = true;

                var cellSize = config.grid.size / config.grid.numCells;
                var offsetPosition = {
                    x: position.x + right*cellSize,
                    y: position.y - up*cellSize
                };
                this.blocks[i].display(offsetPosition);
            } else {
                this.blocks[i].display(position);
            }
        }
        return this;
    }

    Quad.prototype.resize = function() {
        this.blocks.map(function(block){
            block.resize();
        });
    }

    /**
     * 'drop' the quad onto the grid.
     */
    Quad.prototype.drop = function() {
        // Sort the blocks so the 'lowest' are dropped first
        var center = {x: config.game.width/2, y: config.game.height/2};
        this.blocks.sort(function(block1, block2){
            var point1 = block1.graphics.position;
            var point2 = block2.graphics.position;
            var distance1 = Phaser.Point.distance(point1, center);
            var distance2 = Phaser.Point.distance(point2, center);
            if (distance1 < distance2) return -1;
            if (distance1 > distance2) return 1;
            return 0;
        });

        this.blocks.map(function(block){block.drop()});
        return this;
    }

    /**
     * Show where this quad would be placed if it were dropped
     */
    Quad.prototype.highlightPath = function() {
        this.blocks.map(function(block){
            block.highlightPath();
        });

        return this;
    }

    /**
     * Rotate an un-dropped quad
     *
     * @param {string} direction - One of "clockwise" or "counter-clockwise"
     */
    Quad.prototype.rotate = function(direction) {
        switch(direction.toLowerCase()){
        case "clockwise":
            var newDirectionIndex = this.directions.indexOf(this.direction)+1;
            newDirectionIndex = newDirectionIndex%this.directions.length;
            this.direction = this.directions[newDirectionIndex];
            break;
        case "counter-clockwise":
            var newDirectionIndex = this.directions.indexOf(this.direction)-1;
            if (newDirectionIndex < 0) {
                newDirectionIndex = this.directions.length-1;
            }
            this.direction = this.directions[newDirectionIndex];
            break;
        }
        this.blocks.map(function(block){
            block.direction = this.direction;
            if (block.visible) {
                block.display();
            }
        }.bind(this));
        return this;
    }

    /** Alias for Quad.rotate("clockwise")
     */
    Quad.prototype.rotateCW = function() {
        return this.rotate("clockwise");
    }

    /** Alias for Quad.rotate("counter-clockwise")
     */
    Quad.prototype.rotateCCW = function() {
        return this.rotate("counter-clockwise");
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
     * Returns true if any block is currently falling
     *
     * @returns bool
     */
    Quad.prototype.falling = function() {
        return this.blocks.some(function(block){
            return block.falling;
        });
    }

    /**
     * Make the current quad unbreakable
     */
    Quad.prototype.unbreakable = function(){
        this.blocks.map(function(block){block.unbreakable()});
        return this;
    }

    /**
     * Make the current quad breakable
     */
    Quad.prototype.breakable = function() {
        this.blocks.map(function(block) {
            block.breakable();
        });
        return this;
    }

    /**
     * Redraw a quad.
     */
    Quad.prototype.redraw = function() {
        this.blocks.map(function(block) {
            block.redraw();
        });
        return this;
    }

    /**
     * Update a quad to comply with new level
     */
    Quad.prototype.updateLevel = function(level) {
        this.blocks.map(function(block) {
            block.setColor(color.genRandomColor(level));
        });
        this.redraw();
    }

    /**
     * Send a quad to the center of the grid.
     */
    Quad.prototype.toCenter = function() {
        var centerCell = Math.floor(config.grid.numCells/2)-1;
        this.positionAt({
            x: centerCell,
            y: centerCell
        });
        return this;
    }

    return Quad;
});
