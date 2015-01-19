/**
 * A module which defines controls for the game
 * @module app/controls
 */
define(["app/config", "app/generator", "Phaser", "app/grid"],
function(config, generator, Phaser, grid){
    "use strict"

    var controls = {
        rotating : false,
        shifting : false,
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
            else if (!controls.shifting &&
                     game.input.keyboard.isDown(Phaser.Keyboard.W) &&
                     generator.fallingQuads.length == 0) {
                controls.shifting = true;
                grid.slideUp();
                setTimeout(function(){
                    controls.shifting = false;
                }, 100);
            }
            else if (!controls.shifting &&
                     game.input.keyboard.isDown(Phaser.Keyboard.S) &&
                     generator.fallingQuads.length == 0) {
                controls.shifting = true;
                grid.slideDown();
                setTimeout(function(){
                    controls.shifting = false;
                }, 100);
            }
            else if (!controls.shifting &&
                     game.input.keyboard.isDown(Phaser.Keyboard.A) &&
                     generator.fallingQuads.length == 0) {
                controls.shifting = true;
                grid.slideLeft();
                setTimeout(function(){
                    controls.shifting = false;
                }, 100);
            }
            else if (!controls.shifting &&
                     game.input.keyboard.isDown(Phaser.Keyboard.D) &&
                     generator.fallingQuads.length == 0) {
                controls.shifting = true;
                grid.slideRight();
                setTimeout(function(){
                    controls.shifting = false;
                }, 100);
            }
        }
    };

    return controls;
});
