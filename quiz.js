let quizQuestions = [];
let quizIndex = 0;
let quizScore = 0;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function generateQuizQuestions() {
  quizQuestions = flashcards.map((card, i, arr) => {
    const incorrect = arr
      .filter((_, j) => j !== i)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(fc => fc.definition);

    const choices = shuffle([...incorrect, card.definition]);

    return {
      question: `What is "${card.term}"?`,
      choices: choices,
      answer: card.definition
    };
  });

  shuffle(quizQuestions);
}

function startQuiz() {
  generateQuizQuestions();
  quizIndex = 0;
  quizScore = 0;

  document.getElementById("quiz-result").style.display = "none";
  document.getElementById("quiz-question").style.display = "block";
  document.getElementById("quiz-choices").style.display = "block";

  showQuizQuestion();
}

function showQuizQuestion() {
  const q = quizQuestions[quizIndex];
  document.getElementById("quiz-question").textContent = q.question;

  const choicesDiv = document.getElementById("quiz-choices");
  choicesDiv.innerHTML = "";

  q.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.className = "btn";
    btn.onclick = () => handleQuizChoice(btn, choice, q.answer);
    choicesDiv.appendChild(btn);
  });

  document.getElementById("quiz-next").style.display = "none";
}

function handleQuizChoice(button, selected, correct) {
  const buttons = document.getElementById("quiz-choices").children;

  for (let btn of buttons) {
    btn.disabled = true;
    btn.style.backgroundColor = btn.textContent === correct ? "green" : "red";
  }

  if (selected === correct) {
    quizScore++;
  }

  document.getElementById("quiz-next").style.display = "inline-block";
}

function showQuizResults() {
  document.getElementById("quiz-question").style.display = "none";
  document.getElementById("quiz-choices").style.display = "none";
  document.getElementById("quiz-next").style.display = "none";

  const resultDiv = document.getElementById("quiz-result");
  resultDiv.style.display = "block";
  resultDiv.innerHTML = `
    <h2>Quiz Complete!</h2>
    <p>You scored ${quizScore} out of ${quizQuestions.length}.</p>
    <button onclick="startQuiz()" class="btn">Try Again</button>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const nextBtn = document.getElementById("quiz-next");
  nextBtn.onclick = () => {
    quizIndex++;
    if (quizIndex < quizQuestions.length) {
      showQuizQuestion();
    } else {
      showQuizResults();
    }
  };
});
