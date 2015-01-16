define(function(){
    return {
        game : {
            width : 800,
            height : 600
        },

        grid : {
            size : 500,    // Size of the grid in px
            numCells : 25, // The number of cells in a row or column,
                           // this should evenly divide the size
            linesVisible : true // Hide/show the grid lines
        }
    };
})
