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

     * @property {number}  config.color             - Color options
     * @property {number}  config.grid.unbreakable  - Color of the central unbreakable blocks
     * @property {number}  config.grid.available    - List of colors used for levels in ascending order
     */
    var config = {
        game : {
            width : 700,
            height : 700
        },
        grid : {
            size : 520,
            numCells : 26,
            linesVisible : true
        },
        color : {
            unbreakable : 0xFFFFFF,
            available : [0xFF8C00, 0x00008B]
        }
    };

    return config;
})
