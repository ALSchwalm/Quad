define(["app/config", "Phaser"], function(config, Phaser){
    function Grid(){
        this.cellSize = config.grid.size / config.grid.numCells;

        // Center the grid
        this.offsets = {
            x : config.game.width/2 - config.grid.size/2,
            y : config.game.height/2 - config.grid.size/2
        }

        // The contents of the grid
        this.contents = new Array(config.grid.numCells);
        for (var i=0; i < config.grid.numCell; ++i) {
            this.contents[i] = new Array(config.grid.numCell);
        }
    };

    /*
     * Show the grid of 'cells' that the blocks can be moved around
     */
    Grid.prototype.display = function(game) {
        this.graphics = game.add.graphics(this.offsets.x, this.offsets.y);
        this.graphics.lineStyle(1, 0xFFFFFF, 0.2);

        if (config.grid.linesVisible) {
            // Draw rows and columns (start from one so the top and left aren't drawn twice)
            for (var i=1; i < config.grid.numCells; ++i) {
                this.graphics.drawRect(0, i*this.cellSize, config.grid.size, 1);
                this.graphics.drawRect(i*this.cellSize, 0, 1, config.grid.size);
            }
        }

        // Draw a border around the grid area
        this.graphics.drawRect(0, 0, config.grid.size, 1);
        this.graphics.drawRect(0, 0, 1, config.grid.size);
        this.graphics.drawRect(0, config.grid.size, config.grid.size, 1);
        this.graphics.drawRect(config.grid.size, 0, 1, config.grid.size);
    }

    /*
     * Convert a coordinate in the grid to pixel position in the canvas
     */
    Grid.prototype.coordToPixel = function(x, y) {
        var self=this;
        return {
            x : self.cellSize*x + self.offsets.x,
            y : self.cellSize*y + self.offsets.y
        };
    }

    var grid = new Grid();

    return grid;
})
