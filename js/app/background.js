/**
 * A module which displays a background for the game
 * @module app/background
 */
define(["app/config", "Phaser", "app/music"],
function(config, Phaser, music){

    var BackgroundBlock = function(game) {
        this.game = game;

        var x = (Math.random() * config.game.width) - config.game.width/2;
        var y = (Math.random() * config.game.height);// - config.game.height/2;
        this.graphics = this.game.add.graphics(x, y);
        this.game.world.sendToBack(this.graphics);
        this.graphics.alpha = 0;
        this.graphics.scale = {x: 0.5, y: 0.5};

        this.graphics.lineStyle(2, 0x222222, 0.4);
        this.graphics.beginFill(0xFFFFFF, 0.2);
        this.graphics.drawRect(0, 0,
                               config.game.width,
                               config.game.height);
        this.graphics.endFill();

        // Fade in the blocks
        this.game.add.tween(this.graphics).to({alpha : 0.5}, 2000).start();

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
    var Background = function(){
        this.body = document.getElementsByTagName("body")[0];
        this.color = config.color.background[0];
    }

    /**
     * Start displaying the background
     *
     * @param {Phaser.Game} game - A reference to the current game object
     */
    Background.prototype.start = function(game) {
        this.game = game;

        this.blocks = [];

        for (var i=0; i < 7; ++i) {
            var block = new BackgroundBlock(this.game);
            this.blocks.push(block);
        }

        this.frequencySprite = this.game.add.sprite(0, 0);
        this.frequencySprite.width = config.game.width;
        this.frequencySprite.height = config.game.height;

        this.timeSprite = this.game.add.sprite(0, 0);
        this.timeSprite.width = config.game.width;
        this.timeSprite.height = config.game.height;

        this.frequencyFilter = this.game.add.filter("Frequency", config.game.width,
                                                    config.game.height);
        this.timeFilter = this.game.add.filter("Time", config.game.width,
                                               config.game.height);

        this.frequencySprite.filters = [this.frequencyFilter];
        this.game.world.sendToBack(this.frequencySprite);

        this.timeSprite.filters = [this.timeFilter];
        this.game.world.sendToBack(this.timeSprite);
    }

    /**
     * Update the background
     */
    Background.prototype.update = function(){
        this.frequencyFilter.setFrequencyData(music.freqs);
        this.frequencyFilter.update();

        this.timeFilter.setTimeDomainData(music.times);
        this.timeFilter.update();

        this.blocks.map(function(block){
            block.update();
        })
    }

    Background.prototype.resize = function() {
        this.timeFilter.setResolution(config.game.width,
                                      config.game.height);
        this.frequencyFilter.setResolution(config.game.width,
                                           config.game.height);
    }

    /**
     * Switch to using 'color' as a basis for a new background
     *
     * @param {number} targetColor - Color to use as a base for the background
     */
    Background.prototype.newColor = function(targetColor) {
        var count = 0;
        var setColor = null;

        var timer = this.game.time.create(false);
        timer.loop(30,
            function(){
                ++count;
                if (count == 1500/30) {
                    this.color = setColor;
                    timer.stop();
                }
                setColor = Phaser.Color.interpolateColor(this.color,
                                                         targetColor,
                                                         1500/30,
                                                         count);

                var color = Phaser.Color.getWebRGB(setColor);
                var newColor = "radial-gradient(white, " + color + ", " + color + ")";
                this.body.style["background-image"] = newColor;
            }.bind(this));
        timer.start();
    }

    return new Background();

})
