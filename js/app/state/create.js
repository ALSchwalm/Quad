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

        loadTitleMusic(game);

        game.load.audio('attach', 'assets/sounds/attach.wav');
        game.load.audio('destroy', 'assets/sounds/destroy.wav');
        game.load.audio('move', 'assets/sounds/move.wav');
        game.load.audio('rotate', 'assets/sounds/rotate.wav');
        game.load.start();
    };

    var loadTitleMusic = function(game) {
        var file = {
            type: "audio",
            key: "title",
            path: "/",
            url: 'assets/sounds/title.mp3',
            syncPoint: false,
            data: null,
            loading: false,
            loaded: false,
            error: false
        };

        var finishedLoadingTitle = function() {
            file.data = TITLE_AUDIO_REQUEST.response;
            file.data.name = file.key;
            game.cache.addSound(file.key, file.url, file.data, true, false);
            game.sound.decode(file.key);
            music.play('title');
            music.loadBackgroundMusic();
        };

        if (TITLE_AUDIO_REQUEST.readyState == 4) {
            finishedLoadingTitle();
        } else {
            TITLE_AUDIO_REQUEST.onload = finishedLoadingTitle;
        }
    };

    return create;
});
