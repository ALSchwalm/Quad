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
    requirejs(['app/grid', 'app/generator', 'app/score', 'app/timer', 'jquery'],
    function(grid, generator, score, timer, $) {
        $('#start-button').click(function(){
            grid.display(game);
            generator.start(game);
            score.init(game, grid, generator);
            timer.init(game);
            $('#start-menu').fadeOut();
        });

        window.onkeyup = function(e){
            if(String.fromCharCode(e.which) == 'P'){
                if(game.paused == false){
                    game.paused = true;
                    $('#menu-cover').fadeIn(500, function() {
                        $('#pause-menu').fadeIn(500);
                    });
                }
                else{
                    game.paused = false;
                    $('#pause-menu').fadeOut(500, function() {
                        $('#menu-cover').fadeOut(500);
                    });
                }
            };
        }
    });
});
