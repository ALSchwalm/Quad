Quad
====

Quad is a puzzle game written using [Phaser][phaser]. The game may be played in a web browser [here][live], or by cloning the repository and executing `python -m http.server` (or equivalent) from the project root.

TODO
====

- [x] define and display grid
- [x] define quad (group of 4 blocks)
- [x] allow clearing of blocks
- [ ] generator logic (don't allow overlapping quads, etc)
- [x] allow shifting of blocks
- [ ] sounds
- [ ] score/level system
- [ ] graphics (possibly sprites for blocks)
- [ ] rest of page HTML

Documentation
=============

Documentation is generated with [JSDoc][jsdoc] and may be found [here][docs]. It may be built by installing jsdoc and the theme `npm install jsdoc ink-docstrap`. Build the docs with `make docs` in the project root. The generated documentation will be placed in 'docs/html'.

Attributions
============

* Sound for blocks landing from [junggle][junggle].
* Sound for block destruction from [Greencouch][greencouch].

[phaser]: http://phaser.io/
[live]: http://alschwalm.github.io/Quad
[jsdoc]: http://usejsdoc.org/
[docs]: http://alschwalm.github.io/Quad/docs/html/index.html
[junggle]: http://www.freesound.org/people/junggle/sounds/29294/
[greencouch]: http://www.freesound.org/people/junggle/sounds/124906/
