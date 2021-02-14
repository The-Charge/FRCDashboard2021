
# FRC Dashboard

Instead of Shuffleboard or SmartDashboard, we've been using a custom web-based dashboard called [FRC Dashboard](https://github.com/FRCDashboard/FRCDashboard).

## Installation

You'll need to install both node.js and npm, which you can get from [this link](https://nodejs.org/en/).

You can verify your npm and node installations by running `node --version` which should be `v10.15.1`, and `npm --version` which should be `6.4.1`.

Once you've installed npm and node you'll need to run the following line from the dashboard directory:

```bat
npm install
```

If you're still having issues try running the following:

```bat
npm install electron
```

## Usage

While in the dashboard directory, run `npm start` in command prompt to open the dashboard. The shortcuts `ctrl`+`r` and `ctrl`+`shft`+`r` can be used to reload and force-reload the dashboard respectively. This means that you don't need to restart it every time you make a change, just reload it.

For competition, it's often easier to put the start command into a windows batch file named `start.bat` or similar. The only code needed is the same `npm start` from above, just make sure it's in the correct directory, and if it's not `cd` to the correct one first.

The IP address of the robot should be `10.26.19.2`, or if that doesn't work try `10.26.19.2`. If you're connecting via USB use `172.22.11.2` and if you're connecting with robot simulation use `localhost`.

# Programming Notes

Tips and tricks on how it works, and also what files do what. If you look at [the original dashboard](https://github.com/FRCDashboard/FRCDashboard), I've changed the layout to make things easier to use in my opinion.

In the parent directory, there's not too much. This is where you run `npm start` from. `CODE_OF_CONDUCT.md` and `LICENSE` are copied from the original and aren't important. `package.json` is one of `npm`'s files. Here's my advice on `npm`'s files: don't touch them, you'll just break everything like I did whenever I tried to mess with them. The `images` and `node_models` directories are also unimportant. The `src` directory is where you'll spend most of your time.

First, in `src` you should rarely have to touch `main.js`, `connection.js`, or anything in `networktables`. The remaining files are then `index.html`, `ui.js`, and everything in `css`.

## `Index.html`

This is where every element is defined. In the `body` tag there are three parts: the grid, connection, and loading scripts. The grid is the only one that needs to change, and is where all of the elements are.

Each element that you want on the dashboard should be a `div` in the grid and have a unique `id`. Managing which element goes where in the grid is done later in the `css`. Either because I don't know HTML well enough or the fact that HTML sucks, you have to nest the `div` like so or the alignment doesn't work right:

```html
<div id="element_name">
    <div>
        ...element code here...
    </div>
</div>
```

Inside the `div` you just code like it's a normal website, you can really do anything you want. Also, using the grid isn't a requirement, but I found it really easy to use once it's set up.

### Scaleable Vector Graphics

Whenever you want to draw something that's interactive, you should do it with `svg`. It stands for scaleable vector graphics and while make nice-looking pictures that you change with `css` and `javascript`. You can get more information on how to use it [here](https://www.w3schools.com/html/html5_svg.asp).

### HTML Camera Streams

Camera streams are managed in the `css`, just put something similar to the following wherever you want a stream:

```html
<div id="camera1-drop-shadow">
    <div id="camera1"></div>
</div>
```

## `style.css`

This is where the bulk of the styling is done. First, I recomend never setting colors directly in the HTML as it makes them hard to change later. At the top of `style.css` there's a list of colors that can be used throughout the dashboard. These are easy to change if you want to.

### CSS Camera Streams

The following code sets ups the camera streams. The outer `div` is assigned to the grid, and then an inner `div` that has the exact same size and shape as the outer one gets the camera stream as a background (IDK why I did it this why, but something breaks if you do it without the nested `div`). If you need to flip the image you can set the transform, and if you need to rotate it you can use `rotate(180deg);` in the transform. Note that the URL is set up for streaming off of a Raspberry Pi, so if you stream directly from the RoboRIO the URL will be different. If it is from the RIO you should be able to find the URL by looking at the NetworkTables in Shuffleboard.

```css
#camera1-drop-shadow {
    grid-area: cam1;
}

#camera1 {
    background: url("10.26.19.11:1181/stream.mjpg") 0 0 no-repeat;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    transform: scaleY(-1);
}
```

## `svg.css`

This just adds some classes that makes it much easier to color in SVG drawings. It uses the color variables defined in `style.css` and instead of listing colors as class names it has more general classes such as `on`, `off`, `dull`, `bright`, and `warning`. This makes it really easy to change the theme and create new elements without worrying about the colors.

## `ui.js`

At the top of `ui.js` is a dictionary containing the important information for each element. This is just for easy access later on.

### Javascript Camera Streams

While setting the camera stream URL in the `css` works, if it's disconnected it will not automatically reconnect. To counter this a javascript function can be made that runs every second and reconnects the camera.

```javascript
setInterval(() => {
    ui.camera1.style.backgroundImage = 'url("10.26.19.11:1181/stream.mjpg")';
}, 500);
```

Setting the camera background in this way is also useful if you want to change the URL mid-match, for example if you want to be able to toggle between two streams.

### NetworkTables

There are two ways in which NetworkTables can be used. First, event listeners will run a function whenever a value is changed. They can be used to change the color of a button whenever a value is changed, or to change the height of an elevator to mimic the position on the robot.

```javascript
NetworkTables.addKeyListener('/SmartDashboard/key/address', (key, value) => {
    // ...your code...
});
```

Secondly, values can be pushed to NetworkTables as well. While we generally prefer buttons on the button box and joysticks, on occasion we'll need a button that's on the dashboard so values can be pushed there as well.

```javascript
NetworkTables.putValue('/SmartDashboard/key/address', value);
```

The original repository has sliders and buttons set up to allow quick testing and changing of NetworkTables values, but I'd recomend using Shuffleboard to change those as well, it's much simpler to use and setup.
