/**
 * @module app/timer
 */
define(['app/config'],
function(config){
    "use strict"

    /**
     * private method for prepending zeros
     */
    function prependZero(number) {
        if (parseInt(number) < 10) {
            return "0" + number;
        }
        return number;
    }

    /**
     * Timer constructor
     */
    var Timer = function() {
        this.game = null;
        this.time = 0;
        this.elapsedms = 0;
        this.oldelapsed = 0;
        this.dropstopped = true;
        this.droptimer = -3000;
        this.totalElapsedTime = 0;
    }

    /**
     * Static start time variable
     */
    Timer.startTime = 0;

    /**
     * Init timer class
     */
    Timer.prototype.init = function(game) {
        this.game = game;

        var timestyle = {
            font: "350px arial",
            fill: "#fff",
            strokeThickness: 1,
            stroke : "#222222"
        };

        Timer.startTime = (new Date()).getTime();
        this.time = this.game.add.text(config.game.width,
                                       config.game.height,
                                       "00:00", timestyle);
        this.time.anchor = { x: 1, y: 1 };
        this.time.alpha = 0.2
        this.game.world.sendToBack(this.time);

        game.onPause.add(function() {
            this.pause();
        }.bind(this));

        game.onResume.add(function() {
            this.resume();
        }.bind(this));
    }

    Timer.prototype.resize = function() {
        if (this.time) {
            this.time.x = config.game.width;
            this.time.y = config.game.height;
        }
    }

    Timer.prototype.calculateTimeElapsed = function() {
        var currentTime = (new Date()).getTime();
        var elapsed = new Date();
        var temp = 0;

        elapsed.setTime(currentTime - Timer.startTime - this.totalElapsedTime);

        this.oldelapsed = this.elapsedms;
        this.elapsedms = elapsed.getTime();
        this.droptimer += this.elapsedms - this.oldelapsed;
        if (this.dropstopped) {
            this.droptimer = 0;
        }

        return elapsed;
    }

    /**
     * Return the time elapsed since beginning as string.
     */
    Timer.prototype.elapsedToString = function() {
        var elapsed = this.calculateTimeElapsed();

        var hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
        var mins = Math.floor((elapsed / (1000 * 60)) % 60);
        var secs = Math.floor((elapsed / 1000) % 60);
        var ms = Math.floor((elapsed) % 60);

        return prependZero(mins) + ":"
               + prependZero(secs);
    }

    Timer.prototype.pause = function() {
        this.recentPauseTime = (new Date()).getTime();
    }

    Timer.prototype.resume = function() {
        this.totalElapsedTime += new Date() - this.recentPauseTime;
    }

    /**
     * Update the scoreboard's time.
     */
    Timer.prototype.update = function() {
        if (this.time)
            this.time.text = this.elapsedToString();
    }

    Timer.prototype.dropTimerStart = function() {
        this.dropstopped = false;
    }

    Timer.prototype.dropTimerStop = function() {
        this.dropstopped = true;
    }

    return new Timer();

});
