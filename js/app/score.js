/**
 * @module app/score
 */
define(['app/config', 'app/music', 'app/background'],
function(config, music, background){
    "use strict"

    /**
     * Score constructor
     */
    var Score = function() {
        this.board = 0;
        this.totalScore = 0;
        this.levelTotal = 0;
        this.level = 0;
        this.best = 0;
        this.combo = 0;
    }

    /**
     * Initialize score
     */
    Score.prototype.init = function(game, grid, generator) {
        this.game = game;
        this.grid = grid;
        this.generator = generator;
        this.setLevel(0);
    }

    /**
     * Put new best on board
     */
    Score.prototype.updateBest = function(count) {
        if (this.best < count) {
            this.best = count;
        }
    }

    /**
     * Calculate the number of points for a given clear
     */
    Score.prototype.getPoints = function(count) {
        var points = Math.pow(count, config.points[this.level]);
        return Math.floor(points * (this.combo || 1));
    }

    /**
     * Update the scoreboard and level.
     */
    Score.prototype.update = function(clearCount) {
        var points = this.getPoints(clearCount);
        this.updateBest(points);
        this.totalScore += points;
        this.levelTotal += points;

        var newLevel = this.calcLevel();
        if (this.level < newLevel) {
            this.setLevel(newLevel);
        }

        var levelDisplay = this.level + 1;
        $('#level-base').text(levelDisplay);
        $('#level-overlay').text(levelDisplay);

        var overlayHeight = 400*this.levelTotal/config.checkpoints[this.level]
        $('#level-wrapper').animate({
            height : 130 + overlayHeight // 130 is the number of pixels padded
                                         // below the level indicator
        });
    }

    /**
     * Show a transition prompt
     */
    Score.prototype.showReady = function() {
        var style = {
            font: "100px arial",
            fill: "#fff",
            shadowColor: "#000000",
            shadowOffsetX: 1,
            shadowOffsetY: 1,
        }
        var graphics = this.game.add.text(config.game.width/2,
                                          config.game.height/2,
                                          "ready", style);
        graphics.anchor = {x:0.5, y:0.5};
        graphics.scale = {x: 0, y: 0};
        graphics.alpha = 0;
        this.game.world.bringToTop(graphics);

        var tween = this.game.add.tween(graphics.scale);
        tween.to({x: 1, y:1}, 1500).to({x:0, y:0}, 2000).start();

        var alphaTween = this.game.add.tween(graphics);
        alphaTween.to({alpha:1}, 1500).to({alpha:0}, 2000).start();
    }

    /**
     * Transition to a new level
     */
    Score.prototype.setLevel = function(level){
        this.level = level;
        this.generator.setLevel(this.level);

        if (this.level > 0)
            this.levelTotal = this.levelTotal - config.checkpoints[this.level-1];

        music.play("background" + (this.level+1));
        background.newColor(config.color.background[this.level]);
        this.showReady();
        this.update(0); // display the new level

        this.generator.centerQuad.breakable();
        this.grid.clearAll();
        this.grid.resetMiddle();
        this.generator.centerQuad.redraw().toCenter().unbreakable();
    }

    /**
     * Calculate what level we are on now.
     */
    Score.prototype.calcLevel = function() {
        for (var i = config.checkpoints.length - 1; i >= 0; i--) {
            if (this.levelTotal >= config.checkpoints[i]) {
                return i+1;
            }
        }
        return this.level;
    }

    return new Score();

});
