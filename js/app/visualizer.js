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
define(["app/config", "app/music"], function(config, music){
    "use strict"

    /**
     * A class which displays a visual representation of background music
     * @constructor
     * @alias module:app/visualizer
     *
     * @param {Phaser.Game} game - A reference to the current game
     */
    var Visualizer = function(game) {
        this.game = game;
        this.bmd = this.game.make.bitmapData(config.game.width,
                                             config.game.height/2);
        this.bmd.addToWorld(0, config.game.height/2);

        this.canvas = this.bmd.canvas;
        this.drawContext = this.bmd.context;
    }

    /**
     * Draw the visualization
     */
    Visualizer.prototype.draw = function() {
        // Get the frequency data from the currently playing music
        music.analyser.getByteFrequencyData(music.freqs);
        music.analyser.getByteTimeDomainData(music.times);
        this.bmd.cls();

        // Draw the frequency domain chart. Ignore the upper frequencies when drawing
        var visualFrequencyBinCount =
            music.analyser.frequencyBinCount * config.sound.visualizer.frequencyBound;
        for (var i = 0; i < visualFrequencyBinCount; ++i) {
            var value = music.freqs[i];
            var percent = value / 256;
            var height = this.canvas.height * percent;
            var offset = this.canvas.height - height;
            var barWidth = this.canvas.width/visualFrequencyBinCount;

            this.bmd.rect(i * barWidth, offset, barWidth, height, "rgba(0, 0, 0, 0.5)");
        }

        // Draw the time domain chart
        for (var i = 0; i < music.analyser.frequencyBinCount; i++) {
            var value = music.times[i];
            var percent = value / 256 /4;
            var height = this.canvas.height * percent;
            var offset = this.canvas.height - height - this.canvas.height/4;
            var barWidth = this.canvas.width/music.analyser.frequencyBinCount;
            this.bmd.rect(i * barWidth, offset, 1, 2, "rgba(255, 255, 255, 0.8)");
        }

        return this;
    }

    return Visualizer;
});
