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
     * @property {object}  config.game              - General game configuration
     * @property {number}  config.game.width        - Width of the canvas in px
     * @property {number}  config.game.height       - Height of the canvas in px
     * @property {number}  config.game.dropSpeed    - Speed (in ms/cell) blocks fall at
     *
     * @property {object}  config.grid              - Grid settings
     * @property {number}  config.grid.size         - Width/Height of the grid in px
     * @property {number}  config.grid.numCells     - Number of cells per row/column
     * @property {number}  config.grid.linesVisible - Hide/show grid lines
     *
     * @property {object}  config.color              - Color options
     * @property {number}  config.color.unbreakable  - Color of the central unbreakable blocks
     * @property {number}  config.color.available    - List of colors used for levels in ascending order
     *
     * @property {object}  config.generator              - Generator settings
     * @property {number}  config.generator.defaultWait  - Time in seconds to wait before dropping a quad
     *
     * @property {object}  config.sound                   - Sound settings
     * @property {object}  config.sound.beat              - Beat detection settings
     * @property {number}  config.sound.beat.delay        - Minimum frames between beats
     * @property {number}  config.sound.beat.decayRate    - Decay rate of beat threshold
     * @property {number}  config.sound.beat.minThreshold - Minimum volume of beat
     *
     * @property {object}  config.visualizer                 - Visualizer settings
     * @property {object}  config.visualizer.frequencyBound  - Ignore frequencies beyond this fraction
     */
    var config = {
        game : {
            width : window.innerWidth,
            height : window.innerHeight,
            dropSpeed : 18
        },
        grid : {
            size : 480,
            numCells : 20,
            linesVisible : true
        },
        color : {
            unbreakable : 0xFFFFFF,
            available : [
                [0xFF8C00, 0x00008B],
                [0x24ed00, 0xed009a],
                [0x666666, 0xbc0f0f],
                [0x111111, 0xEEEEEE],
            ],
            background : [
                0x0193CD,
                0xB2248F,
                0x590000,
                0xCCCCCC
            ]
        },
        generator : {
            speeds : [ 4, 3, 2, 1.5 ]
        },
        sound : {
            beat : {
                delay : 45,
                decayRate : 0.95,
                minThreshold : 60
            },
            visualizer : {
                frequencyBound : 0.8,
                frequencySpacing : 1,
                maxBarHeight : window.innerHeight/2
            }
        },
        points : [ 1.5, 2, 2.5, 3 ],
        checkpoints : [ 1000, 3500, 6000 ],
    };

    return config;
})
