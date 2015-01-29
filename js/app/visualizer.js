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

        this.canvas = this.game.canvas;
        this.drawContext = this.game.context;

        this.visualFrequencyBinCount =
            music.analyser.frequencyBinCount * config.sound.visualizer.frequencyBound;

        this.graphics = game.add.graphics(0, 0);
        this.barWidth = Math.round(this.canvas.width/this.visualFrequencyBinCount);
        if (this.barWidth < 2) this.barWidth = 2;
    }

    /**
     * Draw the visualization
     */
    Visualizer.prototype.draw = function() {
        // Get the frequency/time data from the currently playing music
        music.analyser.getByteFrequencyData(music.freqs);
        music.analyser.getByteTimeDomainData(music.times);

        this.graphics.clear();

        //Draw the frequency domain chart. Ignore the upper frequencies when drawing
        for (var i = 0; i < this.visualFrequencyBinCount; ++i) {
            var value = music.freqs[i];
            var percent = value / 256;
            var height = this.canvas.height/2 * percent;

            this.graphics.beginFill(0x777777, percent);
            this.graphics.drawRect(i*this.barWidth, this.canvas.height,
                                   this.barWidth-1, -height/2);
            this.graphics.endFill();
        }

        // Draw the time domain chart
        for (var i = 0; i < this.visualFrequencyBinCount; i++) {
            var value = music.times[i];
            var percent = value / 256 /4;
            var height = this.canvas.height * (1 - percent);

            this.graphics.beginFill(0xFFFFFF, 0.6);
            this.graphics.drawRect(i*this.barWidth, height,
                                   this.barWidth-1, 2);
            this.graphics.endFill();
        }

        return this;
    }

    return Visualizer;
});
