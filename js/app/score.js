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
        this.current = 0;
        this.level = 0;
        this.streak = 0;
    }

    /**
     * Initialize score
     */
    Score.prototype.init = function(game, grid, generator) {
        this.game = game;

        var stylebig = {
            font: "40px arial",
            fill: "#fff",
            align: "center"
        };

        var stylesmall = {
            font: "25px arial",
            fill: "#fff",
        };

        var offsets = {
            x : config.game.width/2 + config.grid.size/2,
            y : config.game.height/2 - config.grid.size/2
        }

        this.board = game.add.graphics(0, 0);
        this.board.beginFill(0x333333, .5);
        this.board.drawRoundedRect(offsets.x + 135, offsets.y, 200, 482, 10);

        this.board.levelbackdrop = game.add.graphics(0, 0);
        this.board.levelbackdrop.beginFill(0x000000, .5);
        this.board.levelbackdrop.drawRect(offsets.x + 135, offsets.y + 63, 200, 50, 10);

        this.board.scorebackdrop = game.add.graphics(0, 0);
        this.board.scorebackdrop.beginFill(0x000000, .5);
        this.board.scorebackdrop.drawRect(offsets.x + 135, offsets.y + 155, 200, 50, 10);

        this.board.chainbackdrop = game.add.graphics(0, 0);
        this.board.chainbackdrop.beginFill(0x000000, .5);
        this.board.chainbackdrop.drawRect(offsets.x + 135, offsets.y + 247, 200, 50, 10);

        this.board.leveltext = game.add.text(offsets.x + 233, offsets.y + 88, "Level", stylebig);
        this.board.scoretext = game.add.text(offsets.x + 233, offsets.y + 181, "Score", stylebig);
        this.board.chaintext = game.add.text(offsets.x + 233, offsets.y + 273, "Longest Chain", stylesmall);

        this.board.levelval = game.add.text(offsets.x + 233, offsets.y + 134, "1", stylebig);
        this.board.scoreval = game.add.text(offsets.x + 233, offsets.y + 226, "0", stylebig);
        this.board.chainval = game.add.text(offsets.x + 233, offsets.y + 318, "0", stylebig);

        this.board.leveltext.anchor = { x: 0.5, y: 0.5 };
        this.board.scoretext.anchor = { x: 0.5, y: 0.5 };
        this.board.chaintext.anchor = { x: 0.5, y: 0.5 };

        this.board.levelval.anchor = { x: 0.5, y: 0.5 };
        this.board.scoreval.anchor = { x: 0.5, y: 0.5 };
        this.board.chainval.anchor = { x: 0.5, y: 0.5 };

        this.grid = grid;
        this.generator = generator;
        this.setLevel(0);
    }

    /**
     * Put new streak on board
     */
    Score.prototype.updateStreak = function(count) {
        if (this.streak < count) {
            this.streak = count;
        }
    }

    /**
     * Update the scoreboard and level.
     */
    Score.prototype.update = function(clearCount) {
        var points = Math.pow(clearCount, config.points[this.level]);
        var levelDisplay = this.level + 1;
        this.current += Math.floor(points);
        this.updateStreak(clearCount);

        this.board.levelval.text = levelDisplay;
        this.board.scoreval.text = this.current;
        this.board.chainval.text = this.streak;

        var newLevel = this.calcLevel();
        if (this.level < newLevel) {
            this.setLevel(newLevel);
        }
    }

    /**
     * Show a transition indicating the current level
     */
    Score.prototype.showLevel = function() {
        var text = (this.level+1).toString();
        var style = {
            font: "200px arial",
            fill: "#fff",
            shadowColor: "#000000",
            shadowOffsetX: 1,
            shadowOffsetY: 1,
        }
        var graphics = this.game.add.text(config.game.width/2,
                                          config.game.height/2,
                                          text, style);
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
        music.play("background" + (this.level+1));
        background.newColor(config.color.background[this.level]);
        this.showLevel();
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
            if (this.current >= config.checkpoints[i]) {
                return i+1;
            }
        }
        return this.level;
    }

    return new Score();

});
