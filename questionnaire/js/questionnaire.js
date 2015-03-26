"use strict";
var Questionnaire = {
  current_question_index: 0,

  init: function() {
    this.initVars();
    this.loadQuestions();
    this.bindings();
    this.begin();
  },

  begin: function() {
    setTimeout(function(self) {
      document
        .querySelector("ol li:first-child")
        .setAttribute("aria-hidden", "false");
    });
  },

  createElement: function(el) {
    return document.createElement(el);
  },

  initVars: function() {
    this.questions_list = this.createElement("ol");
    this.questions_container = document.querySelector("#questions-container");
    this.submit_button = this.questions_container.querySelector("button");
  },

  bindings: function() {
    var option_labels = document.getElementsByClassName("option_label"),
        len           = option_labels.length,
        i             = 0;

    this.submit_button.addEventListener("click", this.showNextQuestion.bind(this), false);

    for(; i < len; i++) {
      option_labels[i].addEventListener("click", this.enableSubmitButton.bind(this), false);
    }
  },

  disableSubmitButton: function() {
    this.submit_button.setAttribute("disabled", "disabled");
  },

  enableSubmitButton: function() {
    this.submit_button.removeAttribute("disabled");
  },

  focusFirstOption: function() {
    document.querySelector("ol > li[aria-hidden=false] [type=radio]:first-of-type").focus();
  },

  showNextQuestion: function() {
    var question_index = this.getActiveQuestionIndex(),
        current_list_item;

    if (question_index >= questions.length) {
      current_list_item = document
        .querySelector("ol > li:nth-child(" + question_index + ")");

      current_list_item.classList.add("final");
      current_list_item.innerHTML = "<span class='question-text'>Thanks for voting!</span>";
    } else {
      this.setListItemState();
      this.setActiveQuestionIndex(this.getActiveQuestionIndex());
      this.setListItemState("false");
    }

    this.disableSubmitButton();
  },

  setListItemState: function() {
    var index = this.getActiveQuestionIndex(),
        state = arguments.length ? "false" : "true";

    document
      .querySelector("ol > li:nth-child(" + index + ")")
      .setAttribute("aria-hidden", state);
  },

  getActiveQuestionIndex: function() {
    return this.current_question_index+1;
  },

  setActiveQuestionIndex: function(index) {
    this.current_question_index = index;
  },

  loadQuestions: function() {
    var question_len = questions.length,
        question_options,
        question_options_length,
        ul, li, li_option, i, question_text,
        option_label, option_input, option_id,

        createOptions = function(index) {
          for (var i = 0; i < question_options_length; i++) {
            li_option = this.createElement("li");
            option_label = this.createElement("label");
            option_label.className = "option_label";
            option_label.innerHTML = question_options[i];
            option_input = this.createElement("input");
            option_input.type = "radio";
            option_input.name = "rdo_" + index;
            option_label.appendChild(option_input);
            li_option.appendChild(option_label);
            ul.appendChild(li_option);
          }
        }.bind(this),

        createCard = function(index, question) {
          question_options = questions[index].options;
          question_options_length = questions[index].options.length;

          question_text = this.createElement("span");
          ul = this.createElement("ul");
          li = this.createElement("li");

          question_text.classList.add("question-text");
          question_text.innerHTML = questions[index].question;

          createOptions(index);

          li.dataset.questionId = index;
          li.setAttribute("aria-hidden", "true");
          li.appendChild(question_text);
          li.appendChild(ul);
          this.questions_list.appendChild(li);
        }.bind(this);

    for (var i = 0; i < question_len; i++) {
      createCard(i, questions[i]);
    }

    this.questions_container.setAttribute("aria-busy", "false");

    this.questions_container
      .querySelector(".inner")
      .insertBefore(this.questions_list, this.submit_button);
  }
};
