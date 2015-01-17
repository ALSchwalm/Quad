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
            var max;
            if (level > config.color.available.length-1) {
                max = config.color.available.length-1;
            } else {
                max = level;
            }
            var index = Math.round(Math.random()*max);
            return config.color.available[index];
        }
    };

    return color;
});
