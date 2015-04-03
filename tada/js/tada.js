(function(window) {
  "use strict";

  if (!('webkitSpeechRecognition' in window)) {
    upgrade();
  } else {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() { }
    recognition.onresult = function(event) {  }
    recognition.onerror = function(event) {  }
    recognition.onend = function() {  }
  }
})(window);
