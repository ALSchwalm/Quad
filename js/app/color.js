/**
 * A module with utility functions for generating random colors
 * @module app/color
 */
define(["app/config"],
function(config){
    "use strict"

    /**
     * @alias module:app/color
     */
    var color = {
        /**
         * Generate a random color from the colors defined in config
         *
         * @param {number} level - The current game level
         * @returns - A random color value
         */
        genRandomColor : function(level) {
            var levelColors = config.color.available[level];
            var index = Math.floor(Math.random()*levelColors.length);
            return levelColors[index];
        }
    };

    return color;
});
