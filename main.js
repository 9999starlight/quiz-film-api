function quiz() {
  // hide intro; selectors; append question number and timer
  const introContainer = document.querySelector('.introContainer');
  const container = document.querySelector('#container');
  document.querySelector('.header').innerHTML = `
  <h3 id="questionNumber" class="shadow"></h3>
  <h3 id="countdown" class="shadow"></h3>`;
  const timer = document.querySelector('#countdown');
  let questions = [];
  let currentQuestion = 0;
  let outcome = 0;
  introContainer.classList.remove('flex');
  introContainer.classList.add('none');

  // fetch Open Trivia API data for questions
  fetch('https://opentdb.com/api.php?amount=20&category=11')
    .then(res => res.json())
    .then((data) => {
      data.results.forEach((d) => {
        questions.push([d.question, d.correct_answer, d.incorrect_answers]);
      });
      createQuestions();
      document.querySelector('.mainContainer').classList.remove('none');
      document.querySelector('.mainContainer').classList.add('flex');

      /* stop function at the end of quiz; result; reset counter;
      empty array for new fetch */
      function createQuestions() {
        if (currentQuestion >= questions.length) {
          theEnd();
          clearInterval(sInt);
          currentQuestion = 0;
          outcome = 0;
          questions = [];
          return false;
        }
        // questions, options, random sort for options, display
        document.querySelector('#questionNumber').innerHTML =
          `${currentQuestion + 1} / ${questions.length}`;
        const question = questions[currentQuestion][0];
        const allOptions = [];
        allOptions.push(questions[currentQuestion][2][0],
          questions[currentQuestion][2][1],
          questions[currentQuestion][2][2],
          questions[currentQuestion][1]);
        // clear container for the next round; appending variable; display
        container.innerHTML = '';
        let questionList = '';
        allOptions.sort(() => Math.random() - 0.5)
          .forEach(op => {
            if (op !== undefined && op == questions[currentQuestion][1]) {
              questionList += `<label><input type = 'radio' name = 'options'
             id = 't' value = '${op}'><div>${op}</div></label>`;
            } else if (op !== undefined) {
              questionList += `<label><input type = 'radio' name = 'options'
            value = '${op}'><div>${op}</div></label>`;
            }
          });
        container.innerHTML += `<div class = 'question borderR'>${question}
        <div>`;
        container.innerHTML += questionList;
        container.innerHTML += `<button id = "next">Next question</button>`;
        document.querySelector('#next').addEventListener('click', answerCheck);
      }

      // timer settings; counting time difference and setting display
      const countFrom = new Date().getTime() + 601000;
      const sInt = setInterval(function () {
        const currentTime = new Date().getTime();
        const timeDifference = countFrom - currentTime;
        let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        seconds < 10 ? seconds = `0${seconds}` : seconds;
        minutes < 10 ? minutes = `0${minutes}` : minutes;
        if (timeDifference >= 0) {
          timer.innerHTML = `${minutes} : ${seconds}`;
        } else {
          clearInterval(sInt);
          theEnd();
          timer.innerHTML = "Time's up!";
        }
      }, 1000, createQuestions);

      // check if answer is correct; outcome counter; display red or green;
      function answerCheck() {
        document.querySelector('#next').removeEventListener('click', answerCheck);
        const options = document.querySelectorAll('input[name="options"]');
        options.forEach((op) => {
          let att = op.getAttribute('id');
          if (att === 't') {
            op.parentNode.classList.add('correctBorder');
          }
          if (op.checked) {
            if (att === 't') {
              outcome++;
              op.parentNode.classList.add('correct');
            } else {
              op.parentNode.classList.add('incorrect');
            }
          }
        });
        console.log(outcome);
        // Next question; setTimeout to show if question is correct
        currentQuestion++;
        setTimeout(function () {
          createQuestions();
        }, 1000);
      }

      // display for the end of the quiz
      function theEnd() {
        const percentage =
          parseFloat((outcome * 100) / questions.length).toFixed(2);
        container.innerHTML =
          `<div class = 'question borderR'>You won ${outcome}
        of ${questions.length} points or ${percentage}%</div>
        <a href="index.html">Play again</a>`;
        document.querySelector('#questionNumber').innerHTML = `Finished!`;
      }
    }).catch(err => {
      console.log(err.message);
      introContainer.classList.remove('none');
      introContainer.innerHTML +=
        `<h1 class = "errorMessage">Request failed, please try again later!</h1>`;
    });
}
document.querySelector('#startQuiz').addEventListener('click', quiz);