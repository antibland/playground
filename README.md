Playground
==========

What is it?
-----------
Sometimes I have ideas for short demos and concise little ideas. Now there's a place for them to be stored and shared.

Although I use 3rd party libraries at work, I don't like relying on them in my free time. All of these demos are written using native JavaScript, sass (scss) and HTML5. In addition, I try to make the examples accessible as possible.

What's in here?
---------------

###Animated Movie Credits###

CSS-style movie credits, because why not?

![alt tag](https://dl.dropboxusercontent.com/u/24799515/img_share/credits.png)

The movie roles (Director, Makeup, etc.) are generated from a static JavaScript array. The names are randomly generated using [Chance.js](http://chancejs.com/). If you add or remove roles, the generated name length will adjust itself. The credits definition list moves using a simple CSS transform.

###Questionnaire###

![alt tag](https://dl.dropboxusercontent.com/u/24799515/img_share/questionnaire.png)

It's still a work in progress, but the quentionnaire is kind of cool. It uses aria to control the start/stop of the animation, and counter-increment to show the current question number.

To use it, simply include questions.js, a simple JSON array, and questionnaire.js, the file containing the object you'll need to instantiate. This code should go at the bottom of your page, just before the end of body.

```javascript
<script src="js/questions.js"></script>
<script src="js/questionnaire.js"></script>

var questionnaire = Object.create(Questionnaire);
questionnaire.init();
```
###Native Drag and Drop###

![alt tag](https://dl.dropboxusercontent.com/u/24799515/img_share/drag.gif)

You may be thinking, _why?_ Yes, there are a lot of drag and drop demos out in the wild, but few address accessibility as well as 3D CSS transforms. It's by no means perfect, though, and mobile support is ~~coming next~~ here.

Using it is very similar to all the demos I'll likely add to the playground.
```javascript
<script src="js/drag.js"></script>

var drag = Object.create(Drag);

/* optional init arguments */
// dropEffect    (defaults to "copy")
// effectAllowed (defaults to "copy")

drag.init({
  target_width: 89,
  draggable_selector: "[aria-dropeffect='copy'] [draggable='true']",
  target_selector: ".event"
});
```

License
-------
The MIT License (MIT)

Copyright (c) 2014 Andrew Hoffman

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

