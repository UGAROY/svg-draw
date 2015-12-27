# svg-draw
A lightwweight library to add svg drawing overlay on elements.

# motivation
There are quite a few existing "giant" svg editing libraries, such as [svg-edit](https://github.com/johan/svg-edit) or [method-draw](https://github.com/duopixel/Method-Draw). They works like standalone softwares, including all necessary functionalities like `create`, `edit`, `import` or `export` svg shapes.

But sometimes we just need a sketchpad to doodle around or add some "marks" on top of specific web pages.  One common solution is to use the canvas element in html5. But one major fallback is that `canvas` does not remember the "history", which means once the shapes are drawn, we are not able to edit them any more. 

This project uses "svg" to solve this problem. The users can draw "line", "path", "rectangle" and "circle" on top of the web pages.  All the shapes added can be dragged and rotated. A live demo can be found [here](http://ugaroy.github.io/examples/svg-draw/).

Another good thing about this library is that we can have multiple "canvases" on the webpages, on top of different `div` containers.

# to use

- Reference the `svg-draw.min.js` in the `src/dist` folder.

- Clone the project, and run 
```
npm install
gulp
```
A demo project is included to show how to use the library `http://localhost:1337`. Also, the `svg-draw.min.js` should have been generated in "dist" folder.


