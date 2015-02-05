Quad
====

Quad is a puzzle game written using [Phaser][phaser]. The game may be played in a web browser [here][live], or by cloning the repository and executing `python -m http.server` (or equivalent) from the project root.

How To Play
===========

Groups of four colored blocks (known as quads) will fall from the top of the screen, onto the game grid below. Create groups of blocks of the same color by rotating the direction from which the quad is falling (with the left and right arrows), or by shifting the contents of the grid (with WASD). When the player makes a square of blocks of the same color, that group will clear, as well as any adjacent blocks of the same color. Clear blocks to earn points! Be sure to not let the quad fall outside the game grid though, or its 'Game Over'.

Controls
========

| Key           | Action                               |
|-------------- | -------------                        |
| Left/Right    | Rotate the waiting quad              |
| W/A/S/D       | Shift the contents of the game grid  |
| P             | Pause/Unpause the game               |
| Space         | Manually drop the waiting quad       |

TODO
====

- [x] define and display grid
- [x] define quad (group of 4 blocks)
- [x] allow clearing of blocks
- [x] allow shifting of blocks
- [x] sounds
- [x] score/level system
- [x] graphics (possibly sprites for blocks)
- [x] rest of page HTML

Documentation
=============

Documentation is generated with [JSDoc][jsdoc] and may be found [here][docs]. It may be built by installing jsdoc and the theme `npm install jsdoc ink-docstrap`. Build the docs with `make docs` in the project root. The generated documentation will be placed in 'docs/html'.

Attributions
============

* Sound for blocks landing from [junggle][junggle] (unmodified).
* Sound for block destruction from [Sergenious][sergenious] (unmodified)
* Sound for rotation of blocks from [MissCellany][misscellany] (unmodified)
* Sound for grid movement from [Greencouch][greencouch] (converted to wav).
* Background music by DST available at [nosoapradio][nosoap] (unmodified).

[phaser]: http://phaser.io/
[live]: http://alschwalm.github.io/Quad
[jsdoc]: http://usejsdoc.org/
[docs]: http://alschwalm.github.io/Quad/docs/html/index.html
[junggle]: http://www.freesound.org/people/junggle/sounds/29294/
[sergenious]: http://www.freesound.org/people/Sergenious/sounds/55816/
[greencouch]: http://www.freesound.org/people/Greencouch/sounds/124909/
[misscellany]: http://www.freesound.org/people/MissCellany/sounds/240640/
[nosoap]: http://www.nosoapradio.us/
