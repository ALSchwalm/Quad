/**
 * A module which exposes the Block type
 * @module app/block
 */
define(["app/config", "Phaser", "app/grid", "app/score"],
function(config, Phaser, grid, score){
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
        this.color = color || config.color.unbreakable;
        this.visible = false;
        this.manualPosition = false;
        var point = grid.directionToPoint(this.direction, this.position, this.offset);
        this.graphics = this.game.add.graphics(point.x, point.y);
        this.highlightGraphics = this.game.add.graphics();
        this._unbreakable = (this.color == config.color.unbreakable);

        /**
         * Callbacks to be executed when the block lands
         *
         * @type {function[]}
         */
        this.onDropComplete = [this.clear.bind(this)];
    }

    /**
     * Draw a block
     */
    Block.prototype.draw = function() {
        // Main block body
        this.graphics.lineStyle(1, 0x222222, 0.4);
        this.graphics.beginFill(this.color, 1);
        this.graphics.drawRoundedRect(0, 0, grid.cellSize, grid.cellSize, 1);
        this.graphics.endFill();

        // Inner shaded region
        this.graphics.lineStyle(1, 0xCCCCCC, 0.2);
        this.graphics.beginFill(0xAAAAAA, 0.2);
        this.graphics.drawRoundedRect(1, 1, grid.cellSize-4, grid.cellSize-4, 2);
        this.graphics.endFill();

        // 'light' at top left corner
        this.graphics.lineStyle(0);
        this.graphics.beginFill(0xFFFFFF, 0.4);
        this.graphics.drawRect(1, 1, 2, 2);
        this.graphics.endFill();
    }

    Block.prototype.resize = function() {
        var point;
        if (this.coord) {
            point = grid.coordToPoint(this.coord);
        } else {
            point = grid.directionToPoint(this.direction, this.position, this.offset);
        }
        this.graphics.x = point.x;
        this.graphics.y = point.y;
        this.game.world.bringToTop(this.graphics);
    }

    /**
     * Show the block outside the grid.
     *
     * @param {Phaser.Point} [position] - Optional position on canvas to display at
     */
    Block.prototype.display = function(position) {
        var position = position ||
            grid.directionToPoint(this.direction, this.position, this.offset);
        if (!this.manualPosition) {
            this.graphics.x = position.x;
            this.graphics.y = position.y;
        }

        if (!this.visible) {
            this.draw();
        }

        this.visible = true;
        this.falling = false;
        return this;
    }

    /**
     * Show where this block would be placed if it were dropped
     */
    Block.prototype.highlightPath = function() {
        if (!this.visible)
            return this;
        if (!this.highlighted){
            this.highlightGraphics.lineStyle(0);
            this.highlightGraphics.beginFill(this.color, 0.5);
            this.highlightGraphics.drawRect(0, 0, grid.cellSize, grid.cellSize);
            this.highlightGraphics.endFill();
            this.highlighted = true;
        }

        var coord = grid.getFirstAvailable(this.direction,
                                           this.position,
                                           this.offset-3);
        // remove any tint
        this.highlightGraphics.tint = 0xFFFFFF;
        if (!coord) {
            var point = grid.directionToPoint(this.direction,
                                              this.position,
                                              -config.grid.numCells+(this.offset-2));
            // tint 'missed' blocks
            this.highlightGraphics.tint = 0xAA55CC;
            this.highlightGraphics.position = point;
            return this;
        }
        var point = grid.coordToPoint(coord);
        this.highlightGraphics.position = point;
        return this;
    }


    /**
     * 'drop' the block onto the grid. The block must have been previously
     * displayed.
     *
     * @param {object} [coord] - Optional x, y coordinate to drop to
     * @param {bool} [noAnimate=false] - Do not animate the drop
     */
    Block.prototype.drop = function(coord, noAnimate) {
        var noAnimate = noAnimate || false;
        var coord = coord || grid.getFirstAvailable(this.direction, this.position);

        // FIXME Temporary logic, add actual game over screen
        if (!coord                           ||
            coord.x < 0                      ||
            coord.x > config.grid.numCells-1 ||
            coord.y < 0                      ||
            coord.y > config.grid.numCells-1 ||
            !grid.contents[coord.y]) {
            this.game.paused=true;
            score.updateGameOver();
            $('#menu-cover').fadeIn(3000, function() {
                $('#gameover-menu').fadeIn(300);
            });
            $('#pause-menu').data("available", "false");

            return this;
        }

        //TODO: Do this when the animation is finished?
        grid.contents[coord.y][coord.x] = this;

        if (!noAnimate && this.visible) {
            var point = grid.coordToPoint(coord);
            var distance = Phaser.Point.distance(this.graphics.position, point);

            // animation time is a function of distance, so the block won't fall
            // slower when its destination is nearby
            var cells = distance/grid.cellSize;
            var time = config.game.dropSpeed*cells;

            this.falling = true;
            var tween = this.game.add.tween(this.graphics);
            tween.onComplete.add(function(){
                this.falling = false;
                this.onDropComplete.map(function(callback){
                    callback();
                })
            }.bind(this));
            tween.to(point, time);
            tween.start();
        } else {
            var point = grid.coordToPoint(coord);
            this.graphics.position.x = point.x;
            this.graphics.position.y = point.y;
        }
        this.highlightGraphics.destroy();
        this.coord = coord;
        return this;
    }

    /**
     * Position the block at a specific coordinate (without animation)
     *
     * @param {object} coord - x, y coordinate to place the block
     */
    Block.prototype.positionAt = function(coord) {
        this.manualPosition = true;
        this.drop(coord, true);
        if (this.visible) {
            this.display();
        }
        return this;
    }

    /**
     * Clear surrounding blocks in the following way. If the block does not form
     * a square of blocks of the same color, do nothing. Otherwise, clear all
     * adjacent blocks (not counting diagonals) recursively.
     */
    Block.prototype.clear = function() {
        var matchingColor = function(block){
            return block && (block.color == this.color);
        }.bind(this);

        // Is there a square of blocks of the same color with 'coord' at the
        // bottom left?
        var checkForClear = function(x, y){
            return matchingColor(grid.at(x, y)) &&
                matchingColor(grid.at(x, y+1)) &&
                matchingColor(grid.at(x+1, y)) &&
                matchingColor(grid.at(x+1, y+1));
        }

        // Check whether this block has formed a square of blocks of the same
        // color
        var doClear = checkForClear(this.coord.x, this.coord.y) ||
            checkForClear(this.coord.x-1, this.coord.y)         ||
            checkForClear(this.coord.x, this.coord.y-1)         ||
            checkForClear(this.coord.x-1, this.coord.y-1);

        // Recursively remove all connected blocks of the same color
        var destroyed = [];
        var eraseBlocks = function(block, count) {
            var totalCleared = 1;
            var count = count || 0;
            if (destroyed.indexOf(block) != -1)
                return;
            destroyed.push(block.destroy(count));

            // below
            if (matchingColor(grid.at(block.coord.x, block.coord.y+1))) {
                totalCleared += eraseBlocks(grid.at(block.coord.x, block.coord.y+1),
                                            count+1);
            }

            // above
            if (matchingColor(grid.at(block.coord.x, block.coord.y-1))) {
                totalCleared += eraseBlocks(grid.at(block.coord.x, block.coord.y-1),
                                            count+1);
            }

            // right
            if (matchingColor(grid.at(block.coord.x+1, block.coord.y))) {
                totalCleared += eraseBlocks(grid.at(block.coord.x+1, block.coord.y),
                                            count+1);
            }

            // left
            if (matchingColor(grid.at(block.coord.x-1, block.coord.y))) {
                totalCleared += eraseBlocks(grid.at(block.coord.x-1, block.coord.y),
                                            count+1);
            }
            return totalCleared;
        }.bind(this);

        if (doClear) {
            var totalCleared = eraseBlocks(this) + grid.cleanup();
            score.update(totalCleared);
            this.displayClearedCount(score.getPoints(totalCleared));
            this.clearedBlocks = true;
        }

        return this;
    }

    /**
     * Display how many blocks are cleared.
     */
    Block.prototype.displayClearedCount = function(points) {
        var fontSize;
        if (points > 45) fontSize = "45px Arial";
        else if (points < 20) fontSize = "20px Arial";
        else fontSize = points.toString() + "px Arial";

        var text = points.toString();
        if (score.combo > 0)
            text += " (" + (score.combo+1) + "x)";

        var style = {
            font: fontSize,
            fill: "#FFFFFF",
            shadowColor: "#000000",
            shadowOffsetX: 2,
            shadowOffsetY: 2,
        };

        var point = grid.coordToPoint(this.coord);
        var graphic = this.game.add.text(point.x, point.y, text, style);
        graphic.alpha = 0;

        var tween = this.game.add.tween(graphic);
        tween.to({alpha : 0.7, y : "-20"}, 500).start();
        tween.onComplete.add(function(){
            graphic.destroy();
        });
        return this;
    }

    /**
     * Destroy a breakable block, with animation
     *
     * @param {number} [delay=0] - Ms to delay before playing the destroy animation
     * @param {boolean} [mute=false] - Do not play a sound on destruction
     */
    Block.prototype.destroy = function(delay, mute){
        var mute = mute || false;
        var delay = delay || 0;
        if (this._unbreakable)
            return this;

        setTimeout(function(){
            // Move the block to the center of its cell as it shrinks
            var point = grid.coordToPoint(this.coord);
            var locationTween = this.game.add.tween(this.graphics);
            locationTween.to({ x: point.x+grid.cellSize/2,
                               y: point.y+grid.cellSize/2,
                               angle: 60,
                               alpha: 0.1}, 50);
            locationTween.start();

            // Shrink the block over time
            var scaleTween = this.game.add.tween(this.graphics.scale);
            scaleTween.to({ x: 0, y: 0}, 50);
            scaleTween.start();
            scaleTween.onComplete.add(function(){
                this.graphics.destroy();
                this.highlightGraphics.destroy();
                if (!mute)
                    this.game.add.audio('destroy', 0.3).play();
            }.bind(this));
        }.bind(this), delay*25);
        grid.contents[this.coord.y][this.coord.x] = undefined;
        return this;
    }

    /**
     * Slide the block in 'direction' on the game grid
     *
     * @param {string} direction - One of "top", "bottom", "left", or "right"
     */
    Block.prototype.slide = function(direction) {
        switch(direction.toLowerCase()) {
        case "top":
            this.coord.y -= 1;
            this.graphics.y -= grid.cellSize;
            break;
        case "bottom":
            this.coord.y += 1;
            this.graphics.y += grid.cellSize;
            break;
        case "left":
            this.coord.x -= 1;
            this.graphics.x -= grid.cellSize;
            break;
        case "right":
            this.coord.x += 1;
            this.graphics.x += grid.cellSize;
            break;
        default:
            throw("Invalid argument to Block.slide: " + direction)
        }
        return this;
    }

    /**
     * Make the current block unbreakable
     */
    Block.prototype.unbreakable = function() {
        this.color = config.color.unbreakable;
        this._unbreakable = true;

        // If the block has already been drawn, force a redraw
        if (this.visible) {
            this.display();
        }
        return this;
    }

    /**
     * Make the current block breakable
     */
    Block.prototype.breakable = function() {
        this._unbreakable = false;

        if (this.visible) {
            this.display();
        }
        return this;
    }

    /**
     * Set the color of a block
     */
    Block.prototype.setColor = function(color) {
        this.color = color;
    }

    /**
     * Redraw a block.
     */
    Block.prototype.redraw = function() {
        this.graphics.destroy();
        this.highlightGraphics.destroy();
        var point = grid.directionToPoint(this.direction, this.position, this.offset);
        this.graphics = this.game.add.graphics(point.x, point.y);
        this.highlightGraphics = this.game.add.graphics();
        this.draw();
    }

    return Block;
})
