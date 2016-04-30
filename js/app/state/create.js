/**
 * A module returning a function which will be executed during the 'create'
 * phase of Phaser js startup
 * @module app/state/create
 */
define(["app/background", "app/music"],
function(background, music){
    "use strict";

    /**
     * Function which will be executed by Phaser after 'preload' is finished
     * @alias module:app/state/create
     *
     * @param {Phaser.Game} game - The current game object
     */
    var create = function(game){
        music.start(game);
        background.start(game);

        playTitleMusic(game);
        music.loadBackgroundMusic();

        game.load.audio('attach', 'assets/sounds/attach.wav');
        game.load.audio('destroy', 'assets/sounds/destroy.wav');
        game.load.audio('move', 'assets/sounds/move.wav');
        game.load.audio('rotate', 'assets/sounds/rotate.wav');
        game.load.start();
    };

    var playTitleMusic = function(game) {
        var titleMusic = $("#title-music")[0];

        var finishedLoadingTitle = function() {
            music.playTag(titleMusic);
        };

        if (titleMusic.readyState == 4) {
            finishedLoadingTitle();
        } else {
            titleMusic.canplaythrough = finishedLoadingTitle;
        }
    };

    return create;
});
