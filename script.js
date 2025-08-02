let currentQuestionIndex = 0;
let score = 0;
let questions = [];

const questionCountElem = document.getElementById('question-count');
const scoreElem = document.getElementById('score');
const questionTextElem = document.getElementById('question-text');
const optionsElem = document.getElementById('options');
const feedbackElem = document.getElementById('feedback');
const resultElem = document.getElementById('result');

fetch('questions.json')
  .then(res => res.json())
  .then(data => {
    questions = data;
    showQuestion();
  })
  .catch(err => {
    questionTextElem.textContent = "Error loading questions.";
    console.error(err);
  });

function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  questionCountElem.textContent = `Question: ${currentQuestionIndex + 1} / ${questions.length}`;
  scoreElem.textContent = `Score: ${score}`;

  questionTextElem.textContent = currentQuestion.question;

  currentQuestion.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.addEventListener('click', () => selectAnswer(index, currentQuestion.correct));
    optionsElem.appendChild(btn);
  });
}

function resetState() {
  feedbackElem.classList.add('hidden');
  feedbackElem.textContent = '';
  optionsElem.innerHTML = '';
  resultElem.innerHTML = '';
  resultElem.classList.add('hidden');
}

function selectAnswer(selectedIndex, correctIndex) {
  const buttons = optionsElem.querySelectorAll('button');

  if (selectedIndex === correctIndex) {
    buttons.forEach(btn => btn.disabled = true);
    buttons[selectedIndex].classList.add('correct');
    score++;
    updateScore();
    feedbackElem.textContent = "✅ Waa sax!";
    feedbackElem.style.color = "green";
    feedbackElem.classList.remove('hidden');

    setTimeout(() => {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        showQuestion();
      } else {
        showResults();
      }
    }, 1500);
  } else {
    buttons[selectedIndex].classList.add('wrong');
    feedbackElem.textContent = "❌ Khalad bay ahayd, fadlan dooro mid kale.";
    feedbackElem.style.color = "red";
    feedbackElem.classList.remove('hidden');

    setTimeout(() => {
      feedbackElem.classList.add('hidden');
      showQuestion();  // Dib u muujin su'aasha hadda, badhamada cusub
    }, 1500);
  }
}


function updateScore() {
  scoreElem.textContent = `Score: ${score}`;
}

function showResults() {
  document.querySelector('.quiz-container').innerHTML = `
    <h2>Natiijada Imtixaankaaga</h2>
    <p>Score: ${score} / ${questions.length} (${Math.round(score / questions.length * 100)}%)</p>
  `;
}
