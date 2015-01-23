/*
 * Copyright 2013 Boris Smus. All Rights Reserved.

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A module which displays a visualization of background music
 * @module app/visualizer
 */
define(["app/config"], function(config){
    "use strict"

    /**
     * A class which displays a visual representation of background music
     * @constructor
     * @alias module:app/visualizer
     *
     * @param {Phaser.Game} game - A reference to the current game
     * @param {Phaser.Sound} [music] - Initial background music
     */
    function Visualizer(game, music) {
        this.game = game;
        this.bmd = this.game.make.bitmapData(config.game.width, config.game.height);
        this.bmd.addToWorld();

        this.analyser = this.game.sound.context.createAnalyser();

        this.analyser.minDecibels = -140;
        this.analyser.maxDecibels = 0;
        this.analyser.fftSize = 2048;

        this.freqs = new Uint8Array(this.analyser.frequencyBinCount);

        this.canvas = this.bmd.canvas;
        this.drawContext = this.bmd.context;
        this.analyser.smoothingTimeConstant = 0.8;

        if (music) {
            this.setMusic(music);
        }
    }

    /**
     * Set the visualizer to display the given sound
     *
     * @param {Phaser.Sound} music - New sound to display
     * @note This does not start playing the music
     */
    Visualizer.prototype.setMusic = function(music) {
        this.music = music;
        this.music.externalNode = this.analyser;
        this.analyser.connect(this.music.masterGainNode);
    }

    /**
     * Draw the visualization
     */
    Visualizer.prototype.draw = function() {
        // Get the frequency data from the currently playing music
        this.analyser.getByteFrequencyData(this.freqs);
        this.bmd.cls();
        // Draw the frequency domain chart.
        for (var i = 0; i < this.analyser.frequencyBinCount; ++i) {
            var value = this.freqs[i];
            var percent = value / 256;
            var height = this.canvas.height * percent;
            var offset = this.canvas.height - height;
            var barWidth = this.canvas.width/this.analyser.frequencyBinCount;

            this.bmd.rect(i * barWidth, offset, barWidth, height, "rgba(0, 0, 0, 0.5)");
        }
    }

    Visualizer.prototype.getFrequencyValue = function(freq) {
        var nyquist = this.game.sound.context.sampleRate/2;
        var index = Math.round(freq/nyquist * this.freqs.length);
        return this.freqs[index];
    }

    return Visualizer;
});
