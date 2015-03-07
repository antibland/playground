"use strict";
var credits = (function() {
  var names = [],
      len   = roles.length,
      vid   = document.querySelector("video"),
      main  = document.querySelector("main");

  function init() {
    var choices = document.querySelector("#choices");

    for (var i = 0; i < len; i++) {
      names.push(chance.name());
    }

    choices.addEventListener("change", function(e) {
      var choice = this.value,
          source0, source1;

      if (choice === "blank" || choice === "star-wars") {
        vid.style.display = "none";
      } else {
        vid.style.display = "block";
        vid.setAttribute("id", this.value);
        source0 = vid.querySelectorAll("source")[0];
        source1 = vid.querySelectorAll("source")[1];
        source0.setAttribute("src", "media/" + this.value + ".mp4");
        source0.setAttribute("type", "video/mp4");
        source1.setAttribute("src", "media/" + this.value + ".ogg");
        source1.setAttribute("type", 'video/ogg; codecs="theora, vorbis"');
        vid.load();
      }

      restartCredits(choice);
    });

    buildCredits();
  }

  function restartCredits(choice) {
    main.classList.remove("animate", "star-wars");

    setTimeout(function() {
      main.classList.add("animate", choice);
    }, 300);
  }

  function buildCredits() {
    var dl, dt, dd, i;

    dl = document.createElement("dl");

    for (i = 0; i < len; i++) {
      dt = document.createElement("dt");
      dt.appendChild(document.createTextNode(roles[i]));
      dd = document.createElement("dd");
      dd.appendChild(document.createTextNode(names[i]));
      dl.appendChild(dt);
      dl.appendChild(dd);
    }

    main.appendChild(dl);
    main.classList.add("animate");
  }

  return { init : init };
})();
