({
    baseUrl: 'js/lib',
    mainConfigFile: 'app.js',
    paths: {
        // Phaser does not fully support require js by default, so
        // we need to explicitly add it to the config
        Phaser: 'phaser',

        // All application files can be required with 'app/<name>'
        app: '../app'
    },

    name : "../../app",
    include: ['../../bower_components/almond/almond'],
    out : "quad-built.js"
})
