Phaser.Filter.Time = function (game) {
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
          "float floatIndex = floor(pos.x * 1024.0);",

          "if (mod(floor(gl_FragCoord.x), 2.0) == 0.0) {",
            "discard;",
          "}",

          "vec4 data = texture2D(iChannel0, vec2(floatIndex/1024.0, 0.0));",

          "if (floor(gl_FragCoord.y) == floor(data.r/4.0 * resolution.y)) {",
            "gl_FragColor = vec4(0.9, 0.9, 0.9, 0.5);",
            "return;",
          "}",
          "discard;",
        "}"
    ];
};

Phaser.Filter.Time.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Time.prototype.constructor = Phaser.Filter.Time;

Phaser.Filter.Time.prototype.init = function (width, height) {
    this.setResolution(width, height);
};

Phaser.Filter.Time.prototype.setTimeDomainData = function (times) {
    var oldTexture = this.uniforms.iChannel0.value;
    if (oldTexture) {
        oldTexture.destroy(true);
        PIXI.Texture.removeTextureFromCache(oldTexture);
    }
    var texture = createTexture(times);
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
