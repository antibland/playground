Playground
==========

What is it?
-----------
Sometimes I have ideas for short demos and concise little ideas. Now there's a place for these ideas to live and grow.

Although I use 3<sup>rd</sup> party libraries at work, I don't like relying on them in my free time. All of these demos are written using vanilla `JavaScript`, `sass` (`scss`) and `HTML5`. I try to make the examples accessible as possible.

A swaggy place to rock and roll.

What's in here?
---------------

<h3 align="center">Movie-style Credits</h3>
<p align="center">
  <img src="https://dl.dropboxusercontent.com/u/24799515/img_share/credits.png" alt="">
</p>

The movie roles (Director, Makeup, etc.) are generated from a static `JavaScript` array. The names are randomly generated using [Chance.js](http://chancejs.com/). If you add or remove roles, the generated name length will adjust itself. The credits contain a definition list (`<dl>`) that moves using a `CSS` transform.

<h3 align="center">Questionnaire</h3>
<p align="center">
  <img src="https://dl.dropboxusercontent.com/u/24799515/img_share/questionnaire.png" alt="">
</p>

It's still a work in progress, but the quentionnaire is kind of cool. It uses [WAI-ARIA][2] to control the start/stop of the animation, and counter-increment to show the current question number.

To use it, simply include questions.js, a simple `JSON` array, and questionnaire.js, the file containing the object you'll need to instantiate. This code should go at the bottom of your page, just before the end of body.

```javascript
<script src="js/questions.js"></script>
<script src="js/questionnaire.js"></script>

var questionnaire = Object.create(Questionnaire);
questionnaire.init();
```

<h3 align="center">Drag & Drop Bubbles</h3>
<p align="center">
  <img src="https://dl.dropboxusercontent.com/u/24799515/img_share/drag.gif" alt="">
</p>

You may be thinking, _why?_ Yes, there are a lot of drag and drop demos out in the wild, but few address accessibility as well as 3D `CSS` transforms. It's by no means perfect, though, and mobile support is ~~coming next~~ here.

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
Demos
--------------
[Animated Movie Credits][3]

[Questionnaire][4]

[Drag & Drop Bubbles][5]

License
-------

[MIT][1]

[1]: https://github.com/naayt/playground/blob/master/LICENSE
[2]: http://www.w3.org/TR/wai-aria/
[3]: http://naayt.github.io/playground/credits/
[4]: http://naayt.github.io/playground/questionnaire/
[5]: http://naayt.github.io/playground/native_drag/
