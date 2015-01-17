/**
 * General configuration information
 * @module app/config
 */
define(function(){
    "use strict"

    /**
     * @alias module:app/config
     * @namespace
     * @property {object}  config                   - Configuration options
     * @property {number}  config.game              - General game configuration
     * @property {string}  config.game.width        - Width of the canvas in px
     * @property {object}  config.game.height       - Height of the canvas in px
     * @property {number}  config.grid              - Grid settings
     * @property {number}  config.grid.size         - Width/Height of the grid in px
     * @property {number}  config.grid.numCells     - Number of cells per row/column
     * @property {number}  config.grid.linesVisible - Hide/show grid lines
     */
    var config = {
        game : {
            width : 800,
            height : 800
        },
        grid : {
            size : 520,
            numCells : 26,
            linesVisible : true
        }
    };

    return config;
})
