/**
 * A module which gathers information about the currently playing music
 * @module app/music
 */
define(["app/config"], function(config){
    "use strict"

    /**
     * A class which plays music and gathers information about it
     * @alias module:app/music
     *
     */
    var MusicManager = function() {}

    /**
     * Start the music manager, playing 'music'
     *
     * @param {string} [music] - Key of initial song to play
     */
    MusicManager.prototype.start = function(game, music) {
        this.game = game;

        /**
         * WebAudio node which analysis the current music
         */
        this.analyser = this.game.sound.context.createAnalyser();

        /**
         * WebAudio node which is used to crossfade
         */
        this.gain = this.game.sound.context.createGain();

        this.analyser.minDecibels = -140;
        this.analyser.maxDecibels = 0;
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.8;

        this.freqs = new Uint8Array(this.analyser.frequencyBinCount);
        this.times = new Uint8Array(this.analyser.frequencyBinCount);

        this.beatThreshold = 50000; // large value prevents beat at the start
        this.beatCounter = 0;
        this.crossfadeDuration = 2000;

        this.gain.connect(this.analyser);

        /**
         * Callbacks to be executed on a beat
         * @type {function[]}
         */
        this.onBeat = [];

        if (music)
            this.play(music);

        // Load all other level sounds asynchronously, so there isn't a long
        // delay at startup
        for (var i=1; i < config.checkpoints.length + 1; ++i) {
            this.game.load.audio('background' + (i+1),
                                 'assets/sounds/background' + (i+1) + '.mp3');
        }
        this.game.load.start();
    }

    /**
     * Play music loaded with the given id
     *
     * @param {string} music - The key used to load the sound asset in 'preload'
     */
    MusicManager.prototype.play = function(music) {
        var oldMusic = this.music;
        this.fade("out", this.crossfadeDuration/2);

        var playNew = function(){
            if (oldMusic) {
                oldMusic.externalNode = null;
                this.analyser.disconnect();
                oldMusic.destroy();
            }

            this.music = this.game.add.audio(music, 1, true);
            this.music.externalNode = this.gain;
            this.analyser.connect(this.music.masterGainNode);
            this.music.play();

            this.fade("in", this.crossfadeDuration/2);
        }.bind(this);

        // Only crossfade if there is an already playing song
        if (this.music){
            setTimeout(playNew, this.crossfadeDuration);
        } else {
            playNew();
        }

        return this;
    }

    MusicManager.prototype.fade = function(direction, duration, steps) {
        var steps = steps || 100;
        var outInterval = setInterval(function(){
            if (this.music) {
                if (direction === "out")
                    this.gain.gain.value -= 1/100;
                else
                    this.gain.gain.value += 1/100;
            }
        }.bind(this), duration/100);

        setTimeout(function(){
            clearInterval(outInterval);
        }, duration);
    }

    /**
     * Update the analyzer (and do beat detection)
     */
    MusicManager.prototype.update = function() {
        this.detectBeat();
    }

    MusicManager.prototype.getAverageFreq = function() {
        var avg = 0;
	for(var i = 0; i < this.freqs.length; i++) {
	    avg += this.freqs[i];
	}
        return avg /= this.freqs.length;
    }

    /**
     * Test if there is currently a beat being played
     */
    MusicManager.prototype.detectBeat = function(){
        var avg = this.getAverageFreq();
	if (avg > this.beatThreshold && avg > config.sound.beat.minThreshold){
	    this.beatThreshold = avg*1.1;
	    this.beatCounter = 0;

            this.onBeat.map(function(callback){
                callback();
            });
	} else {
	    if (this.beatCounter <= config.sound.beat.delay){
		this.beatCounter++;
	    }else{
		this.beatThreshold *= config.sound.beat.decayRate;
                this.beatThreshold = Math.max(this.beatThreshold,
                                              config.sound.beat.minThreshold);
	    }
	}
        return this;
    }

    var music = new MusicManager();
    return music;
});
