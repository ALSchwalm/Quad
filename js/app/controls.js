/**
 * A module which defines controls for the game
 * @module app/controls
 */
define(["app/config", "app/generator", "Phaser"],
function(config, generator, Phaser){
    "use strict"

    var controls = {
        rotating : false,
        update : function(game) {
            if (!controls.rotating &&
                game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                controls.rotating = true;
                generator.rotateCCW();
                setTimeout(function(){
                    controls.rotating = false;
                }, 100);
            }
            else if (!controls.rotating &&
                     game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                controls.rotating = true;
                generator.rotateCW();
                setTimeout(function(){
                    controls.rotating = false;
                }, 100);
            }
        }
    };

    return controls;
});
