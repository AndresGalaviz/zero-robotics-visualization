# Zero Robotics Visualization
## Setup
```
npm install
sudo npm install -g gulp
gulp watch
```

This starts a local server at `localhost:8080`, observes the files in `scripts` and tries to recompile them every time a file is modified and saved. You will see errors if there are any.

In order to get all the benefits TypeScript provides (good autocompletion, function signatures, type error highlighting etc) you should find a TypeScript plugin for your preferred code editor (`atom-typescript` for Atom and `https://github.com/Microsoft/TypeScript-Sublime-Plugin` for Sublime are both amazing).

## Build process

In order to remain compatible with most websites, the project compiles to a js file that exposes ZR to a global scope. To build the visualization, do
```
npm install
sudo build
```

This will output a compiled and minified file in `out/full/main.js`.

If you want to compile the project as an AMD module you'll need to edit the gulpfile.

## File Structure
* The source code is in `scripts`
* Static files (images, models, textures) are in `static`
* External js libraries are in `vendor`
* `typings` contains `d.ts` files that describe TypeScript definitions of javascript files. This is useful if you're using libraries that aren't written in javascript - if they're popular enough, there's a very high chance a definition file is available on the DefinitelyTyped repo - more info in `http://definitelytyped.org/tsd/`.


## Code Structure
To import a module (in TypeScript), use `import Constants = require("./Constants")`.

To create a module (each file is a separate module), either put `exports = MyAwesomeClass` at the end of the file (like in `SatelliteSubsystem.ts`) - this will export it as a single object - or put `exports` before all the function declarations that you want to export (like in `Helpers.ts`) - this will export an object that contains all these functions/classes/etc as members.

(You can find more info on `require.js` http://requirejs.org/)

The visualizer uses `three.js` for 3d graphics. Everything is controlled by the GameManager - it manages the canvas, the camera, and other essential functions. Everything else is controlled by subsystems. Each subsystem implements `Subsystem` and is responsible for a single function (satellites, stats, items etc). `SatelliteSubsys`

## Extensibility

It is very important that the code is extensible - it should be possible to easily add support for visualizing the next year's game without breaking this year's functionality. This is addressed by having subsystems that would be custom-pluggable for each year's game, and custom mapping files (e.g. `Results2015.ts`) that contain all year-specific mappings and result data retrieval functions (which, in practice, means all the communication packet data, because its data mappings might change each year).
# zero-robotics-visualization
