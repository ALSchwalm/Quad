/**
 * A module returning a function which will be executed during the 'create'
 * phase of Phaser js startup
 * @module app/state/create
 */
define(["app/background", "app/music"],
function(background, music){
    "use strict"

    /**
     * Function which will be executed by Phaser after 'preload' is finished
     * @alias module:app/state/create
     *
     * @param {Phaser.Game} game - The current game object
     */
    var create = function(game){
        music.start(game);
        background.start(game);

        game.load.audio('title', 'assets/sounds/title.mp3').onFileComplete.add(
            function(percent, name) {
                if (name == 'title') {
                    music.play('title');
                    music.loadBackgroundMusic();
                }
        });

        game.load.audio('attach', 'assets/sounds/attach.wav');
        game.load.audio('destroy', 'assets/sounds/destroy.wav');
        game.load.audio('move', 'assets/sounds/move.wav');
        game.load.audio('rotate', 'assets/sounds/rotate.wav');
        game.load.start();
    };
    return create;
});
