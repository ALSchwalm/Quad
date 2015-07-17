// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        // Phaser does not fully support require js by default, so
        // we need to explicitly add it to the config
        Phaser: 'phaser',

        // All application files can be required with 'app/<name>'
        app: '../app'
    },
});

// Load and start the game
requirejs(['app/game'],
function(game) {
    requirejs(['app/config', 'app/grid', 'app/generator', 'app/score',
               'app/timer', 'app/background', 'jquery'],
        function(config, grid, generator, score, timer, background, $) {
        $('#start-button').click(function(){
            grid.display(game);
            generator.start(game);
            score.init(game, grid, generator);
            timer.init(game);
            $('#start-menu').fadeOut();
            $('#pause-menu').data("available", "true");
            $(this).off('click');
        });

        $(window).resize(function(){
            var height = $(window).height();
            var width = $(window).width();

            game.width = width;
            game.height = height;
            config.game.width = game.width;
            config.game.height = game.height;

            if (game.renderType === Phaser.WEBGL) {
                game.renderer.autoResize = false;
	        game.renderer.resize(width, height);
            }

            grid.resize(game);
            timer.resize();
            generator.resize();
            background.resize();
        });

        var pause = function(){
            game.paused = true;
            $('#menu-cover').fadeIn(500, function() {
                $('#pause-menu').fadeIn(500);
            });
        }

        var unpause = function(){
            game.paused = false;
            $('#pause-menu').fadeOut(500, function() {
                $('#menu-cover').fadeOut(500);
            });
        }

        $('#pause-resume').click(function(){
            unpause();
        })

        $('#how-button').click(function(){
            $('#menu-cover').css("background", "rgba(0, 0, 0, 0.9)")
                .fadeIn(500, function(){
                $('#how-to-play-menu').fadeIn(200);
            });
        });

        $('#how-to-close').click(function(){
            $('#how-to-play-menu').fadeOut(500, function(){
                $('#menu-cover').fadeOut(200, function(){
                    $('#menu-cover').css("background", "rgba(0, 0, 0, 0.70)");
                })
            });
        });

        window.onkeyup = function(e){
            if(String.fromCharCode(e.which) == 'P'
                && $('#pause-menu').data("available") == "true")
            {
                if(game.paused == false){
                    pause();
                } else{
                    unpause();
                }
            };
        }
    });

});
