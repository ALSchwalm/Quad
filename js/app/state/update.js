/**
 * A module returning a function which will be executed during each frame
 * @module app/state/update
 */
define(["app/controls", "app/generator", "app/background"],
function(controls, generator, background){
    "use strict"

    /**
     * Function which will be executed by Phaser during each frame
     * @alias module:app/state/update
     *
     * @param {Phaser.Game} game - The current game object
     */
    var update = function(game) {

        controls.update(game);
        generator.update();
        background.update();
    }

    return update;
});
