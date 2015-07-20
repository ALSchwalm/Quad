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
        this.gain.gain.value = 0;

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
    }

    /**
     * Begin loading background music asyncronously. This method should be called
     * after the title music has been loaded.
     */
    MusicManager.prototype.loadBackgroundMusic = function() {
        // Load all other level sounds asynchronously, so there isn't a long
        // delay at startup
        for (var i=0; i < config.checkpoints.length + 1; ++i) {
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
        var loaded = this.game.cache.checkSoundKey(music);

        var playNow = function() {
            if (oldMusic) {
                oldMusic.externalNode = null;
                this.analyser.disconnect();
                oldMusic.destroy();
            }

            this.music = this.game.add.audio(music, 0, true);
            this.music.externalNode = this.gain;
            this.analyser.connect(this.music.masterGainNode);
            this.music.play();
            this.beatThreshold = 50000;

            if (oldMusic)
                this.fade("in", this.crossfadeDuration/2);
            else
                this.fade("in", this.crossfadeDuration*3);
        }.bind(this);

        var crossfade = function() {
            // Only crossfade if there is music already playing
            if (!this.music){
                playNow();
            } else {
                this.fade("out", this.crossfadeDuration/2);
                setTimeout(playNow, this.crossfadeDuration);
            }
        }.bind(this);

        // If the requested music has already been loaded, crossfade
        // to it. Otherwise, wait for it to load.
        if (loaded) {
            crossfade();
        } else {
            this.game.load.onFileComplete.add(function(p, name){
                if (name == music) {
                    this.play(music);
                }
            }.bind(this));
        }
        return this;
    }

    MusicManager.prototype.fade = function(direction, duration, steps) {
        var steps = steps || 100;
        var count = 0;
        var timer = this.game.time.create(false);
        timer.loop(duration/100,
            function(){
                ++count;
                if (this.music) {
                    if (direction === "out" && this.gain.gain.value - 1/100 >= 0) {
                        this.gain.gain.value -= 1/100;
                    } else if (this.gain.gain.value + 1/100 <= 1){
                        this.gain.gain.value += 1/100;
                    }
                }
                if (count == 100) timer.stop();
            }.bind(this));
        timer.start();
    }

    /**
     * Update the analyzer (and do beat detection)
     */
    MusicManager.prototype.update = function() {
        if (this.music)
            this.detectBeat();

        // Get the frequency/time data from the currently playing music
        this.analyser.getByteFrequencyData(this.freqs);
        this.analyser.getByteTimeDomainData(this.times);
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
