/**
 * @module app/score
 */
define(['app/config', 'app/music', 'app/background', 'app/timer'],
function(config, music, background, timer){
    "use strict"

    /**
     * Score constructor
     */
    var Score = function() {
        this.board = 0;
        this.totalScore = 0;
        this.levelTotal = 0;
        this.totalCleared = 0;
        this.level = 0;
        this.best = 0;
        this.largestCombo = 0;
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

        var style = {
            font: "25px arial",
            fill: "#fff",
        }

        this.scoreGraphic = this.game.add.text(185, 445, "/", style);
        this.scoreGraphic.anchor = {x: 0.5, y: 0.5};
        this.scoreGraphic.alpha = 0.5

        this.update(0);
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
        return Math.round(points * (this.combo || 1)/5)*5;
    }

    /**
     * Update the content of the Game Over screen with statistics
     */
    Score.prototype.updateGameOver = function(){
        $("#total-score").text(this.totalScore);
        $("#total-cleared").text(this.totalCleared);
        $("#best-drop").text(this.best);
        $("#largest-combo").text(this.largestCombo);
        $("#time-played").text(timer.time.text);
    }

    /**
     * Update the scoreboard and level.
     */
    Score.prototype.update = function(clearCount) {
        if (!this.scoreGraphic) return this;

        var points = this.getPoints(clearCount);
        this.updateBest(points);
        this.totalScore += points;
        this.levelTotal += points;
        this.totalCleared += clearCount;

        if (this.combo > this.largestCombo)
            this.largestCombo = (this.combo+1).toString() + 'x';

        var newLevel = this.calcLevel();
        if (this.level < newLevel) {
            this.setLevel(newLevel);
        }

        var levelDisplay = this.level + 1;
        $('#level-base').text(levelDisplay);
        $('#level-overlay').text(levelDisplay);

        if (config.checkpoints[this.level]) {
            this.scoreGraphic.text = this.levelTotal.toString() + "/" +
                config.checkpoints[this.level];

            var overlayHeight = 400*this.levelTotal/config.checkpoints[this.level]
            $('#level-wrapper').animate({
                height : 130 + overlayHeight // 130 is the number of pixels padded
                                             // below the level indicator
            });
        } else {
            this.scoreGraphic.text = this.levelTotal.toString()
            $('#level-wrapper').animate({ height : "100%"});

        }
    }

    /**
     * Show a transition prompt
     */
    Score.prototype.showReady = function() {
        var style = {
            font: "90px arial",
            fill: "#fff",
            shadowColor: "#000000",
            shadowOffsetX: 1,
            shadowOffsetY: 1,
        }
        var graphics = this.game.add.text(config.game.width/2-100,
                                          config.game.height/2,
                                          "ready", style);
        graphics.anchor = {x:0.5, y:0.5};
        graphics.alpha = 0;
        this.game.world.bringToTop(graphics);

        var tweenIn = this.game.add.tween(graphics);
        tweenIn.to({alpha:1, x: config.game.width/2}, 1000,
                   Phaser.Easing.Cubic.Out, true)
            .onComplete.add(function(){
                var tween = this.game.add.tween(graphics);
                tween.to({alpha:0, x: config.game.width/2+100}, 1000,
                         Phaser.Easing.Cubic.Out, true, 1000);
            }.bind(this));
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
