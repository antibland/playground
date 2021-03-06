"use strict";
var Drag = {
  positions : [],
  circle    : { width:  null },
  colliding : false,

  modal: {
    create: function(obj) {
      var default_msg = "Please come to this thing, everyone!",
          list        = obj.friends_list,
          event_title = obj.event_title,
          friends     = list.querySelectorAll("li"),
          close_btn;

      Drag.overlay.innerHTML = "<div " +
                            "aria-hidden='true' " +
                            "aria-labelledby='event-title-header' " +
                            "role='dialog' " +
                            "class='modal' " +
                            "tabindex='-1'>" +

                            "<header><h1 tabindex='0' id='event-title-header'>" +
                              event_title +
                            "</h1></header>" +

                            "<div class='contents'>" +
                              "<form onsubmit='return Drag.modal.success();' method='get' id='invite-form'>" +
                                "<textarea>" +
                                  default_msg +
                                "</textarea>" +
                                "<div class='invitees'><ul>" +
                                  obj.friends_list.innerHTML +
                                "</ul></div>" +
                                "<input type='submit' value='Send'>" +
                              "</form>" +
                            "</div>" +

                            "<button tabindex='0' onclick='Drag.modal.hide()' aria-label='close dialog' value='close dialog'>" +
                            "</button>" +
                          "</div>";
      Drag.modal.show();
      Drag.modal.focus();
    },

    show: function() {
      Drag.overlay.setAttribute("aria-hidden", "false");
    },

    focus: function() {
      Drag.overlay.querySelector("[role=dialog]").focus();
    },

    hide: function() {
      Drag.overlay.setAttribute("aria-hidden", "true");
      Drag.overlay.innerHTML = "";
    },

    isOpen: function() {
      return document.querySelector(".overlay").getAttribute("aria-hidden") === "false";
    },

    success: function() {
      var dialog_contents = document.querySelector("[role=dialog] .contents");
      dialog_contents.innerHTML = "<p class='success'>Sent! Have a great time.</p>";
      return false;
    }
  },

  utils: {
    isTouchDevice: function() {
      return (('ontouchstart' in window)
          || (navigator.MaxTouchPoints > 0)
          || (navigator.msMaxTouchPoints > 0));
    },

    getDraggableElements: function() {
      return document.querySelectorAll(Drag.draggable_selector);
    },

    getTargetElements: function() {
      return document.querySelectorAll(Drag.target_selector);
    },

    removeTargetStyles: function(class_name, e) {
      var targets = Drag.utils.getTargetElements();

      [].forEach.call(targets, function(target) {
        target.classList.remove(class_name);
      });

      if (typeof e !== "undefined") {
        e.target.classList.add("over");
      }
    },

    preventBrowserRedirect: function(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      return false;
    },

    whichAnimationEvent: function() {
      var a,
          el = document.createElement('fakeelement'),
          animations = {
            'animation':'animationend',
            'OAnimation':'oAnimationEnd',
            'MozTransition':'animationend',
            'WebkitTransition':'webkitAnimationEnd'
          };

      for (a in animations){
        if(el.style[a] !== undefined){
          return animations[a];
        }
      }
    },

    whichTransitionEvent: function() {
      var t,
          el = document.createElement('fakeelement'),
          transitions = {
            'transition':'transitionend',
            'OTransition':'oTransitionEnd',
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
          };

      for (t in transitions){
        if(el.style[t] !== undefined){
          return transitions[t];
        }
      }
    },

    getBrowserPrefix: function() {
      return (/mozilla/.test(navigator.userAgent.toLowerCase()) &&
             !/webkit/.test(navigator.userAgent.toLowerCase())) ? '-moz-' :
             (/webkit/.test(navigator.userAgent.toLowerCase())) ? '-webkit-' :
             (/msie/.test(navigator.userAgent.toLowerCase()))   ? '-ms-' :
             (/opera/.test(navigator.userAgent.toLowerCase()))  ? '-o-' : '';
    },

    a11yClick: function(e){
      if(e.type === 'click'){
        return true;
      } else if(e.type === 'keypress'){
        var code = e.charCode || e.keyCode;

        if((code === 32)|| (code === 13)){
            return true;
        }
      } else{
        return false;
      }
    }
  },

  bind: {
    draggables: function() {
      [].forEach.call(Drag.draggable_els, function(el, index) {
        el.addEventListener('dragstart', function(e) { Drag.handleDragStart(e); }, false);
        el.addEventListener('dragend', function(e) { Drag.handleDragEnd(e); }, false);
        el.addEventListener('touchstart', function(e) { Drag.handleTouchStart(e, index); }, false);
        el.addEventListener('touchmove', function(e) { Drag.handleTouchMove(e, index); }, false);
        el.addEventListener('touchend', function(e) { Drag.handleTouchEnd(e, index); }, false);
        el.addEventListener('selectstart', function(e) {
          e.preventDefault && e.preventDefault();
          this.dragDrop && this.dragDrop();  //activates DnD for IE
          return false;
        }, false);
      });
    },

    targets: function() {
      [].forEach.call(Drag.target_els, function(el) {
        el.addEventListener('dragenter', function(e) { Drag.handleDragEnter(e); }, false);
        el.addEventListener('dragleave', function(e) { Drag.handleDragLeave(e); }, false);
        el.addEventListener('dragover', function(e) { Drag.handleDragOver(e); }, false);
        el.addEventListener('drop', function(e) { Drag.handleDrop(e); }, false);
        el.addEventListener('click', function(e) { Drag.handleTarget(e); }, false);
        el.addEventListener('keypress', function(e) { Drag.handleTarget(e); }, false);
        el.addEventListener('touchstart', function(e) { Drag.handleTarget(e); }, false);
      });
    },

    endAnimations: function() {
      var transition_end = Drag.utils.whichTransitionEvent();

      // completion of overlay transition reveals modal
      transition_end && Drag.overlay.addEventListener(transition_end, function() {
        if (Drag.overlay.getAttribute("aria-hidden") === "false") {
          var modal = Drag.overlay.querySelector(".modal");
          modal.setAttribute("aria-hidden", "false");
        }
      }, false);
    },

    keydown: function() {
      // escape key should close modal
      document.onkeydown = function(e) {
        var ESCAPE = 27;
        e = e || window.event;

        if (e.keyCode == ESCAPE && Drag.modal.isOpen()) {
          Drag.modal.hide();
        }
      };
    }
  },

  init: function(config) {
    Drag.circle.width       = config.target_width;
    Drag.draggable_selector = config.draggable_selector;
    Drag.target_selector    = config.target_selector;
    Drag.draggable_els      = this.utils.getDraggableElements();
    Drag.target_els         = this.utils.getTargetElements();
    Drag.effectAllowed      = config.effectAllowed || "copy";
    Drag.dropEffect         = config.dropEffect || "copy";
    Drag.overlay            = document.querySelector(".overlay");

    Drag.bindEvents();
    Drag.touchSupport();
    Drag.enterStage();
  },

  enterStage: function() {
    var a             = [].slice.call(Drag.draggable_els),
        b             = [].slice.call(Drag.target_els),
        all_els       = a.concat(b),
        animation_end = Drag.utils.whichAnimationEvent(),
        prefix        = Drag.utils.getBrowserPrefix();

    [].forEach.call(all_els, function(el, index) {
      if (el.className !== "clone") {
        el.classList.add("item-load");
      }

      animation_end && el.addEventListener(animation_end, function() {
        el.classList.remove("item-load");
      }, false);
    });
  },

  bindEvents: function() {
     this.bind.draggables();
     this.bind.targets();
     this.bind.endAnimations();
     this.bind.keydown();
  },

  handleTarget: function(e) {
    var target   = e.target,
        list     = target.querySelector("ul") || undefined,
        list_len = list && list.querySelectorAll("li").length || 0;

    if (typeof list !== "undefined"
        && list_len > 0
        && this.utils.a11yClick(e) === true) {

      this.utils.removeTargetStyles("over", e);

      this.modal.create({
        event_title : target.querySelector(".event-name").innerHTML,
        num_friends : list_len,
        friends_list: list
      });
    }
  },

  touchSupport: function() {
    if (this.utils.isTouchDevice()) {
      var style, clone, bounds, clone_left, clone_top,
          that = this,
          cloneElement = function(el) {
            bounds = el.getBoundingClientRect();
            clone_left = bounds.left - that.circle.width * .25 + "px";
            clone_top = bounds.top - that.circle.width * .25 + "px";

            clone = el.cloneNode(true);
            clone.classList.add("clone");
            clone.setAttribute("style", "left:" + clone_left + ";top:" + clone_top + ";");
            el.insertAdjacentElement("afterend", clone);
          };

      [].forEach.call(this.draggable_els, function(el) {
        el.removeAttribute("draggable");
        style = "left:0; top:0";
        el.setAttribute("style", style);

        cloneElement(el);
      });
    }
  },

  handleTouchStart: function(e, index) {
    var target       = e.target,
        obj_left_pos = target.style.left || target.offsetLeft,
        obj_top_pos  = target.style.top || target.offsetTop;

    this.touchobj = e.changedTouches[0]           // reference first touch point
    this.obj_left = parseInt(obj_left_pos)        // get left position of box
    this.obj_top  = parseInt(obj_top_pos)         // get top position of box
    this.startx = parseInt(this.touchobj.clientX) // get x coord of touch point
    this.starty = parseInt(this.touchobj.clientY) // get y coord of touch point

    this.resetTargetStates();
    this.loadPositions();
    target.nextSibling.classList.add("shown");
    target.setAttribute("aria-grabbed", "true");

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

    if (e.preventDefault) {
      e.preventDefault();
    }

    this.detectCollision(e);
  },

  handleTouchEnd: function(e) {
    if (this.colliding) {
      this.handleDrop(e);
    } else {
      e.target.setAttribute("aria-grabbed", "false");
    }
  },

  loadPositions: function() {
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
        circle         = this.circle,
        radius         = circle.width * 0.5,
        rect1          = dragged.getBoundingClientRect(),
        x1             = rect1.left,
        y1             = rect1.top,
        that           = this,
        x2, y2, dx, dy, distance;

    this.utils.removeTargetStyles("over");

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

  handleDragEnd: function(e) {
    [].forEach.call(this.draggable_els, function (el) {
      el.classList.remove("over");
    });

    e.target.setAttribute("aria-grabbed", "false");
  },

  handleDrop: function(e) {
    var friend_text  = this.getFriendText(),
        friends_list = null,
        target       = document.querySelector(".over"),
        returnHome   = function(e) {
          var touch_target = e.target;
          touch_target.setAttribute("aria-grabbed", "false");
          touch_target.classList.add("enable-transition");
          touch_target.style.top = 0;
          touch_target.style.left = 0;
          touch_target.nextSibling.classList.remove("shown");
        },
        incrementFriendCount = function() {
          var list_len = friends_list.querySelectorAll("li").length;

          if (!friends_list.getAttribute("data-list-size")) {
            friends_list.setAttribute("data-list-size", list_len);
          } else {
            friends_list.dataset.listSize = list_len;
          }
        };


    this.utils.preventBrowserRedirect(e);

    if (target.childNodes.length <= 3) {
      friends_list = document.createElement("ul");
      target.appendChild(friends_list);
    } else {
      friends_list = document.querySelector(".over ul");
    }

    if (this.addItemToList(friends_list, friend_text) === true) {
      target.classList.add("item-dropped");
      incrementFriendCount();
    } else {
      target.classList.add("item-duplicate");
    }

    if (this.utils.isTouchDevice()) {
      returnHome(e);
    }
  },

  resetTargetStates: function() {
    Drag.colliding = false;
    [].forEach.call(this.draggable_els, function (el) {
      el.classList.remove("enable-transition");
    });

    [].forEach.call(this.target_els, function (el) {
      el.classList.remove("item-duplicate");
      el.classList.remove("item-dropped");
      el.classList.remove("over");
    });
  },

  removeInvitee: function(btn, invitee_name) {
    var li               = btn.parentNode,
        invitee_list     = document.querySelector(".over ul"),
        invitees         = invitee_list.querySelectorAll("li"),
        empty_html       = "<li>You&rsquo;ve removed all event invites.</li>",
        transition_end   = Drag.utils.whichTransitionEvent(),
        tmp_name,
        disableSubmit    = function() {
          document
            .querySelector(".modal [type=submit]")
            .setAttribute("disabled", "disabled");
        },
        removeInvitee    = function() {
          li.classList.add("item-remove-row");
          transition_end && li.addEventListener(transition_end, function() {
            try { li.parentNode.removeChild(li); } catch(err) {}
          }, false);
        },
        removeInviteeList = function() {
          invitee_list.parentNode.removeChild(invitee_list);
        };

    // remove the invitee from the modal
    removeInvitee();

    // remove the invitee from the target list beneath the modal
    [].forEach.call(invitees, function(invitee) {
      tmp_name = invitee.querySelector(".invitee-name").innerHTML;

      if (tmp_name === invitee_name) {
        invitee.parentNode.removeChild(invitee);
      }
    });

    invitee_list.dataset.listSize--;

    if (invitee_list.querySelectorAll("li").length <= 0) {
      li.parentNode.innerHTML = empty_html;
      removeInviteeList();
      disableSubmit();
    }

    return false;
  },

  addItemToList: function(list, new_item_text) {
    var items            = list.querySelectorAll("li .invitee-name"),
        duplicate        = false,
        addItem          = function() {
          var new_item   = document.createElement("li"),
              remove_btn = document.createElement("button"),
              item_txt   = document.createTextNode(new_item_text),
              item_span  = document.createElement("span"),
              btn_txt    = document.createTextNode("remove");

          remove_btn.setAttribute("value", "remove " + new_item_text);
          remove_btn.setAttribute("aria-label", "remove " + new_item_text);
          remove_btn.setAttribute("tabindex", "0");
          remove_btn.setAttribute("onclick", "return Drag.removeInvitee(this, '" + new_item_text +"')");
          remove_btn.appendChild(btn_txt);

          item_span.className = "invitee-name";
          item_span.setAttribute("tabindex", "0");
          item_span.appendChild(item_txt);

          new_item.appendChild(item_span);
          new_item.appendChild(remove_btn);

          list.appendChild(new_item);
        };

    [].forEach.call(items, function (item) {
      if (item.innerHTML === new_item_text) {
        duplicate = true;
      }
    });

    if (!duplicate) {
      addItem();
    }

    return !duplicate;
  },

  handleDragStart: function(e) {
    var target = e.target;
    target.setAttribute("aria-grabbed", "true");
    this.resetTargetStates();

    this.drag_src_el = e.target;

    e.dataTransfer.effectAllowed = Drag.effectAllowed;
    e.dataTransfer.setData('Text', target.innerHTML);
  },

  handleDragOver: function(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    e.dataTransfer.dropEffect = Drag.dropEffect;
    return false;
  },

  handleDragEnter: function(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    this.utils.removeTargetStyles("over", e);
    return false;
  },

  handleDragLeave: function(e) {
    e.target.classList.remove("over");
  }
}
