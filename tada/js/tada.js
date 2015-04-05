(function(window) {
  "use strict";

  var create_email     = false,
      final_transcript = "",
      recognizing      = false,
      ignore_onend,
      start_timestamp,
      toggle_listening = document.getElementById("toggle-listening"),
      output           = document.getElementById("output"),
      list;

  function startButton(event) {
    if (recognizing) {
      recognition.stop();
      return;
    }
    final_transcript = '';
    recognition.start();
    ignore_onend = false;


    start_timestamp = event.timeStamp;
  }

  function addItem() {
    var reg = /ad|add/i,
        str = final_transcript.replace(reg, ""),
        item;

    console.log(str);

    if (typeof list === "undefined") {
      list = document.createElement("ul");
      list.id = "list";
      output.appendChild(list);
    }

    item = document.createElement("li");
    item.appendChild(document.createTextNode(str));
    list.appendChild(item);

    final_transcript = "";
  }

  function parseTranscript() {
    console.log("parsing transcript...");

    if (final_transcript.length > 0) {

      if (~final_transcript.indexOf("ad") || ~final_transcript.indexOf("add")) {
        addItem();
      } else if (~final_transcript.indexOf("remove")) {
        removeItem();
      } else if (~final_transcript.indexOf("clear")) {
        if (window.confirm("Are you sure?")) {
          removeItems();
        }
      }

      //final_transcript = "";
    }
  }

  if ('webkitSpeechRecognition' in window) {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    toggle_listening.addEventListener("click", startButton, false);

    recognition.onstart = function() {
      console.log("starting...");
      recognizing = true;
    };

    recognition.onresult = function(event) {
      var interim_transcript = '',
          len                = event.results.length;
      for (var i = event.resultIndex; i < len; ++i) {
        if (event.results[i].isFinal) {
          console.log("results are final");
          final_transcript += event.results[i][0].transcript;
          console.log(final_transcript);
          parseTranscript();
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
    };

    recognition.onerror = function(event) {
      console.log("error!", event.error);
      if (event.error == 'no-speech') {
        showInfo('info_no_speech');
        ignore_onend = true;
      }
      if (event.error == 'audio-capture') {
        showInfo('info_no_microphone');
        ignore_onend = true;
      }
      if (event.error == 'not-allowed') {
        if (event.timeStamp - start_timestamp < 100) {
          showInfo('info_blocked');
        } else {
          showInfo('info_denied');
        }
        ignore_onend = true;
      }
    };

    recognition.onend = function() {  }
  }
})(window);
