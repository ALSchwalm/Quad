define(["app/config", "app/generator", "Phaser", "app/grid"],
function(config, generator, Phaser, grid){
    "use strict"

    /**
     * A module which defines controls for the game
     * @exports app/controls
     */
    var controls = {
        rotating : false,
        shifting : false,
        postMove : function() {
            generator.showLimits();
        },
        keys : [],

        /**
         * Register a key to be used by the game
         *
         * @param {number} key - The keycode to watch
         * @param {function} func - Callback to execute when the key is pressed
         * @param {object} context - Context for the callback
         * @param {number} delayBetween - Time (in ms) between callback executions
         */
        registerControl : function(key, func, context, delayBetween) {
            var delayBetween = delayBetween || 100;
            var func = func.bind(context);
            var keyObj = {
                key: key,
                callback : func,
                delay: delayBetween,
                active: false,
                press : function() {
                    if (!keyObj.active && $('#pause-menu').data("available")) {
                        keyObj.callback();
                        keyObj.active = true;
                        setTimeout(function(){
                            keyObj.active = false;
                        }, keyObj.delay);
                        controls.postMove();
                    }
                }
            };
            controls.keys.push(keyObj);
        },

        update : function(game) {
            // TODO: maybe move this to postMove for performance (causes issues)
            generator.highlightPath();

            for (var i=0; i < controls.keys.length; ++i) {
                if (game.input.keyboard.isDown(controls.keys[i].key)) {
                    controls.keys[i].press();
                } else {
                    controls.keys[i].active = false;
                }
            }
        }
    };

    // Register some default keys
    controls.registerControl(Phaser.Keyboard.LEFT, generator.rotateCCW, generator);
    controls.registerControl(Phaser.Keyboard.RIGHT, generator.rotateCW, generator);

    controls.registerControl(Phaser.Keyboard.W, function(){
        if(generator.fallingQuads.length == 0)
            grid.slideUp();
    }, grid);

    controls.registerControl(188, function(){
        if(generator.fallingQuads.length == 0)
            grid.slideUp();
    }, grid);

    controls.registerControl(Phaser.Keyboard.S, function(){
        if(generator.fallingQuads.length == 0)
            grid.slideDown();
    }, grid);

    controls.registerControl(Phaser.Keyboard.O, function(){
        if(generator.fallingQuads.length == 0)
            grid.slideDown();
    }, grid);

    controls.registerControl(Phaser.Keyboard.A, function(){
        if(generator.fallingQuads.length == 0)
            grid.slideLeft();
    }, grid);

    controls.registerControl(Phaser.Keyboard.D, function(){
        if(generator.fallingQuads.length == 0)
            grid.slideRight();
    }, grid);

    controls.registerControl(Phaser.Keyboard.E, function(){
        if(generator.fallingQuads.length == 0)
            grid.slideRight();
    }, grid);

    controls.registerControl(Phaser.Keyboard.SPACEBAR, function(){
        generator.drop(true);
    }, generator);

    // Prevent the browser from taking the normal action (scrolling, etc)
    window.addEventListener("keydown", function(e) {
        var codes = [];
        controls.keys.map(function(keyObj){
            codes.push(keyObj.key);
        })

        if(codes.indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);

    return controls;
});
