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
        this.game = 0;
        this.time = 0;
    }

    /**
     * Static start time variable
     */
    Timer.startTime = 0;

    /**
     * Init timer class
     */
    Timer.prototype.init = function(game) {

        var timestyle = {
            font: "30px arial",
            fill: "#fff",
            align: "center"
        };

        var offsets = {
            x : config.game.width/2 + config.grid.size/2,
            y : config.game.height/2 - config.grid.size/2
        }

        Timer.startTime = (new Date()).getTime();
        this.game = game;
        this.time = this.game.add.text(offsets.x + 233, offsets.y + 40, "00:00:00", timestyle);
        this.time.anchor = { x: 0.5, y: 0.5 };
    }

    /**
     * Return the time elapsed since beginning as string.
     */
    Timer.prototype.elapsedToString = function() {
        var currentTime = (new Date()).getTime();
        var elapsed = new Date();

        elapsed.setTime(currentTime - Timer.startTime);

        var hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
        var mins = Math.floor((elapsed / (1000 * 60)) % 60);
        var secs = Math.floor((elapsed / 1000) % 60);
        var ms = Math.floor((elapsed) % 60);

        return prependZero(hours) + ":"
               + prependZero(mins) + ":"
               + prependZero(secs);
    }

    /**
     * Update the scoreboard's time.
     */
    Timer.prototype.update = function() {
        if (this.time)
            this.time.text = this.elapsedToString();
    }

    return new Timer();

});
