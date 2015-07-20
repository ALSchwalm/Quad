Phaser.Filter.Frequency = function (game) {
    Phaser.Filter.call(this, game);

    this.uniforms.iChannel0 = {
        type : "sampler2D",
        value: null
    }

    this.fragmentSrc = [
        "precision mediump float;",
        "uniform vec2      resolution;",
        "uniform sampler2D iChannel0;",

        "void main(void) {",

          "vec2 pos = gl_FragCoord.xy/resolution.xy;",
          "float floatIndex = floor(pos.x * 900.0);",

          "if (mod(floor(gl_FragCoord.x), 2.0) == 0.0) {",
            "discard;",
          "}",

          "vec4 data = texture2D(iChannel0, vec2(floatIndex/1024.0, 0.0));",

          "if (pos.y < data.r/3.5) {",
            "gl_FragColor = vec4(0.1, 0.1, 0.1, clamp(data.r, 0.35, 0.7));",
            "return;",
          "}",
          "discard;",
        "}"
    ];
};

Phaser.Filter.Frequency.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Frequency.prototype.constructor = Phaser.Filter.Frequency;

Phaser.Filter.Frequency.prototype.init = function (width, height) {
    this.setResolution(width, height);
};

Phaser.Filter.Frequency.prototype.setFrequencyData = function (frequencies) {
    var oldTexture = this.uniforms.iChannel0.value;
    if (oldTexture) {
        oldTexture.destroy(true);
        PIXI.Texture.removeTextureFromCache(oldTexture);
    }
    var texture = createTexture(frequencies);
    this.uniforms.iChannel0.value = texture;
};

function createTexture(typedData) {
    var cv = document.createElement("canvas");
    cv.width = typedData.length;;
    cv.height = 1;
    var c = cv.getContext("2d");

    c.imageSmoothingEnabled = false;

    var img = c.createImageData(cv.width, cv.height);
    var imgd = img.data;

    for (var offset=0; offset < typedData.length; offset++) {
        imgd[offset*4] = typedData[offset];
        imgd[(offset*4)+1] = 0;
        imgd[(offset*4)+2] = 0;
        imgd[(offset*4)+3] = 255;
    }
    c.putImageData(img, 0, 0);
    return PIXI.Texture.fromCanvas(cv);
}
