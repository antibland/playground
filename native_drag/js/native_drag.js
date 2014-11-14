"use strict";
var Drag = {
  drag_src_el  : null,
  draggable_els: null,
  target_els   : null,
  positions    : [],
  circle       : { width: 87 },
  colliding    : false,

  utils: {
    isTouchDevice: function() {
      return (('ontouchstart' in window)
          || (navigator.MaxTouchPoints > 0)
          || (navigator.msMaxTouchPoints > 0));
    },

    getDraggableElements: function() {
      return document.querySelectorAll("[aria-dropeffect='copy'] [draggable='true']");
    },

    getTargetElements: function() {
      return document.querySelectorAll(".event");
    }
  },

  init: function() {
    this.initVars();
    this.bindEvents();
    this.touchSupport();
  },

  initVars: function() {
    this.draggable_els = this.utils.getDraggableElements();
    this.target_els = this.utils.getTargetElements();
  },

  bindEvents: function() {
    var that     = this,
        touchobj = null, // Touch object holder
        distx    = 0,    // x distance traveled by touch point
        disty    = 0,    // y distance traveled by touch point
        startx,          // starting x coordinate of touch point
        starty,          // starting y coordinate of touch point
        obj_left,        // left position of moving element
        obj_top;         // top position of mobing element

    [].forEach.call(that.draggable_els, function(el, index) {
      el.addEventListener('dragstart', function(e) { that.handleDragStart(e); });
      el.addEventListener('dragend', function(e) { that.handleDragEnd(e); });
      el.addEventListener('touchstart', function(e) { that.handleTouchStart(e, index); });
      el.addEventListener('touchmove', function(e) { that.handleTouchMove(e, index); });
      el.addEventListener('touchend', function(e) { that.handleTouchEnd(e, index); });
    });

    [].forEach.call(that.target_els, function(el) {
      el.addEventListener('dragenter', function(e) { that.handleDragEnter(e); });
      el.addEventListener('dragleave', function(e) { that.handleDragLeave(e); });
      el.addEventListener('dragover', function(e) { that.handleDragOver(e); });
      el.addEventListener('drop', function(e) { that.handleDrop(e); });
    });
  },

  touchSupport: function() {
    if (this.utils.isTouchDevice()) {
      var style;

      [].forEach.call(this.draggable_els, function(el) {
        el.removeAttribute("draggable");
        style = "left:0; top:0";
        el.setAttribute("style", style);
      });
    }
  },

  handleTouchStart: function(e, index) {
    var target       = e.target,
        obj_left_pos = target.style.left || target.offsetLeft,
        obj_top_pos  = target.style.top || target.offsetTop;

    this.touchobj = e.changedTouches[0] // reference first touch point
    this.obj_left = parseInt(obj_left_pos) // get left position of box
    this.obj_top  = parseInt(obj_top_pos)  // get top position of box
    this.startx = parseInt(this.touchobj.clientX) // get x coord of touch point
    this.starty = parseInt(this.touchobj.clientY) // get y coord of touch point

    if (e.preventDefault) {
      e.preventDefault();
    }
  },

  handleTouchMove: function(e, index) {
    var target = e.target;

    this.touchobj = e.changedTouches[0];
    this.distx = parseInt(this.touchobj.clientX) - this.startx;
    this.disty = parseInt(this.touchobj.clientY) - this.starty;
    target.style.left = (this.obj_left + this.distx) + "px";
    target.style.top = (this.obj_top + this.disty) + "px";

    target.setAttribute("aria-grabbed", "true");

    if (e.preventDefault) {
      e.preventDefault();
    }

    this.updatePositions();
    this.detectCollision(e);
  },

  handleTouchEnd: function(e) {
    if (this.colliding) { this.handleDrop(e); }
  },

  updatePositions: function() {
    var targets = this.utils.getTargetElements(),
        len     = targets.length,
        that    = this,
        rect;

    this.positions.length = 0;

    [].forEach.call(targets, function(target) {
      rect = target.getBoundingClientRect();
      that.positions.push([rect.left, rect.top]);
    });
  },

  detectCollision: function(e) {
    var targets        = this.utils.getTargetElements(),
        len            = targets.length,
        dragged        = e.target,
        radius         = this.circle.width/2,
        rect1          = dragged.getBoundingClientRect(),
        x1             = rect1.left,
        y1             = rect1.top,
        that           = this,
        x2, y2, dx, dy, distance;

    for (var i = 0; i < len; i++) {
      x2 = that.positions[i][0];
      y2 = that.positions[i][1];
      dx = (x1 + radius) - (x2 + radius);
      dy = (y1 + radius) - (y2 + radius);
      distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius + radius) {
        targets[i].classList.add("over");
        that.colliding = true;
        break;
      } else {
        targets[i].classList.remove("over");
        that.colliding = false;
      }
    }
  },

  getFriendText: function() {
    return document.querySelector("[aria-grabbed='true'] .friend-name").innerHTML;
  },

  preventBrowserRedirect: function(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    return false;
  },

  handleDragEnd: function(e) {
    [].forEach.call(this.draggable_els, function (el) {
      el.classList.remove("over");
    });

    e.target.setAttribute("aria-grabbed", "false");
  },

  handleDrop: function(e) {
    var friend_text       = this.getFriendText(),
        friends_list      = null;

    this.preventBrowserRedirect(e);

    if (e.target.childNodes.length <= 3) {
      friends_list = document.createElement("ul");
      e.target.appendChild(friends_list);
    } else {
      friends_list = document.querySelector(".over ul");
    }

    if (this.addItemToList(friends_list, friend_text) === true) {
      e.target.classList.add("item-dropped");
    } else {
      e.target.classList.add("item-duplicate");
    }
  },

  resetTargetStates: function() {
    [].forEach.call(this.target_els, function (el) {
      el.classList.remove("item-duplicate");
      el.classList.remove("item-dropped");
      el.classList.remove("over");
    });
  },

  addItemToList: function(list, new_item_text) {
    var items     = list.querySelectorAll("li"),
        duplicate = false,
        new_item;

    [].forEach.call(items, function (item) {
      if (item.innerHTML === new_item_text) {
        duplicate = true;
      }
    });

    if (!duplicate) {
      new_item = document.createElement("li");
      new_item.innerHTML = new_item_text;
      list.appendChild(new_item);
    }

    return !duplicate;
  },

  handleDragStart: function(e) {
    var target = e.target;
    target.setAttribute("aria-grabbed", "true");
    this.resetTargetStates();

    this.drag_src_el = e.target;

    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/html', target.innerHTML);
  },

  handleDragOver: function(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    e.dataTransfer.dropEffect = "copy";
    return false;
  },

  handleDragEnter: function(e) {
    e.target.classList.add("over");
  },

  handleDragLeave: function(e) {
    e.target.classList.remove("over");
  }
}
