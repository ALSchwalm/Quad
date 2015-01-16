define(['app/config',
        'Phaser',
        'app/state/preload',
        'app/state/update',
        'app/state/create'],
function(config, Phaser, preload, update, create){
    var game = new Phaser.Game(config.game.width, config.game.height,
                               Phaser.AUTO, 'phaser-body', {
        preload : preload,
        update  : update,
        create  : create,
    });

    return game;
});
