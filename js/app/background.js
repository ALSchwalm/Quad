/**
 * A module which displays a background for the game
 * @module app/background
 */
define(["app/config", "app/visualizer", "app/music"],
function(config, Visualizer, music){

    var BackgroundBlock = function(game) {
        this.game = game;

        var x = (Math.random() * config.game.width) - config.game.width/2;
        var y = (Math.random() * config.game.height);// - config.game.height/2;
        this.graphics = this.game.add.graphics(x, y);
        this.game.world.sendToBack(this.graphics);
        this.graphics.alpha = 0.5;
        this.graphics.scale = {x: 0.5, y: 0.5};

        this.graphics.lineStyle(2, 0x222222, 0.4);
        this.graphics.beginFill(0xFFFFFF, 0.2);
        this.graphics.drawRect(0, 0,
                               config.game.width,
                               config.game.height);
        this.graphics.endFill();

        music.onBeat.push(function(){
            this.pulse();
        }.bind(this));

        this.target = {
            x: Math.random(),
            y: Math.random()
        }

        this.updateFrequency = Math.floor(7*Math.random());
        this.updateCounter = 0;
    }

    BackgroundBlock.prototype.withinEpsilon = function(value1, value2) {
        return Math.abs(value1 - value2) < 0.01;
    }

    BackgroundBlock.prototype.update = function(){
        if (this.updateCounter == this.updateFrequency) {
            if (this.withinEpsilon(this.graphics.scale.x, this.target.x)) {
                this.target.x = Math.random();
            } else if (this.graphics.scale.x > this.target.x) {
                this.graphics.scale.x -= 0.001
            } else {
                this.graphics.scale.x += 0.001
            }

            if (this.withinEpsilon(this.graphics.scale.y, this.target.y)) {
                this.target.y = Math.random();
            } else if (this.graphics.scale.y > this.target.y) {
                this.graphics.scale.y -= 0.001
            } else {
                this.graphics.scale.y += 0.001
            }
            this.updateCounter=0;
        } else {
            this.updateCounter++;
        }
        return this;
    }

    BackgroundBlock.prototype.pulse = function(){
        var tween = this.game.add.tween(this.graphics);
        tween.to({alpha : 0.7}, 75).to({alpha:0.5}, 100).start();

        var tweenScale = this.game.add.tween(this.graphics.scale);
        tweenScale.to({x: "+0.02", y:"+0.02"}, 75)
            .to({x: "-0.02", y:"-0.02"}, 100).start();
        return this;
    }

    /**
     * A class which displays a background for the game
     * @constructor
     * @alias module:app/background
     */
    var Background = function(){}

    /**
     * Start displaying the background
     *
     * @param {Phaser.Game} game - A reference to the current game object
     */
    Background.prototype.start = function(game) {
        this.game = game;
        if (this.game.sound.usingWebAudio) {
            this.visualizer = new Visualizer(game);
        }

        this.blocks = [];

        for (var i=0; i < 7; ++i) {
            var block = new BackgroundBlock(this.game);
            this.blocks.push(block);
        }
    }

    /**
     * Update the background
     */
    Background.prototype.update = function(){
        if (this.visualizer) {
            this.visualizer.draw();
        }

        this.blocks.map(function(block){
            block.update();
        })
    }

    return new Background();

})
