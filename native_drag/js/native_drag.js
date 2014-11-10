var Drag = {
  drag_src_el  : null,
  draggable_els: null,
  target_els   : null,

  getDraggableElements: function() {
    return document.querySelectorAll("[aria-dropeffect='copy'] [draggable='true']");
  },

  getTargetElements: function() {
    return document.querySelectorAll(".event");
  },

  init: function() {
    this.initVars();
    this.bindEvents();
  },

  initVars: function() {
    this.draggable_els = this.getDraggableElements();
    this.target_els = this.getTargetElements();
  },

  bindEvents: function() {
    var that = this;

    [].forEach.call(that.draggable_els, function(el) {
      el.addEventListener('dragstart', function(e) { that.handleDragStart(e); });
      el.addEventListener('dragend', function(e) { that.handleDragEnd(e); });
    });

    [].forEach.call(that.target_els, function(el) {
      el.addEventListener('dragenter', function(e) { that.handleDragEnter(e); });
      el.addEventListener('dragleave', function(e) { that.handleDragLeave(e); });
      el.addEventListener('dragover', function(e) { that.handleDragOver(e); });
      el.addEventListener('drop', function(e) { that.handleDrop(e); });
    });
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

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', target.innerHTML);
  },

  handleDragOver: function(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    e.dataTransfer.dropEffect = "move";
    return false;
  },

  handleDragEnter: function(e) {
    e.target.classList.add("over");
  },

  handleDragLeave: function(e) {
    e.target.classList.remove("over");
  }
}
