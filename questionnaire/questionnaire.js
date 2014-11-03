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
          self.setActiveQuestionIndex(0);
        }(this));
      },

      initVars: function() {
        this.questions_list = document.createElement("ol");
        this.questions_container = document.querySelector("#questions-container");
        this.submit_button = this.questions_container.querySelector("button");
      },

      bindings: function() {
        var that = this,
            option_labels = document.querySelectorAll("ol ul li label"),
            len = option_labels.length;

        this.submit_button.addEventListener("click", function() {
          that.showNextQuestion();
        });

        for(var i = 0; i < len; i++) {
          option_labels[i].addEventListener("click", function() {
            that.enableSubmitButton();
          });
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
        this.setListItemState();
        this.setActiveQuestionIndex(this.getActiveQuestionIndex());
        this.setListItemState("false");
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
            that = this,
            createCard   = function(index, question) {
              var question_text           = document.createElement("span"),
                  question_options        = questions[index].options,
                  question_options_length = questions[index].options.length,
                  ul                      = document.createElement("ul"),
                  li                      = document.createElement("li"),
                  li_option,
                  option_label,
                  option_input,
                  option_id;

                question_text.classList.add("question-text");
                question_text.innerHTML = questions[index].question;

                for (var i = 0; i < question_options_length; i++) {
                  li_option = document.createElement("li");
                  option_label = document.createElement("label");
                  option_label.innerHTML = question_options[i];
                  option_input = document.createElement("input");
                  option_input.type = "radio";
                  option_input.name = "rdo_" + index;
                  option_label.appendChild(option_input);
                  li_option.appendChild(option_label);
                  ul.appendChild(li_option);
                }

                li.dataset.questionId = index;
                li.setAttribute("aria-hidden", "true");
                li.appendChild(question_text);
                li.appendChild(ul);
                that.questions_list.appendChild(li);
            };

        for (var i = 0; i < question_len; i++) {
          createCard(i, questions[i]);
        }

        this.questions_container.setAttribute("aria-busy", "false");
        this.questions_container
          .querySelector(".inner")
          .appendChild(this.questions_list);
      }
    };
