let quizQuestions = [];
let quizIndex = 0;
let quizScore = 0;
let missedQuestions = [];
let retryEnabled = false;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function generateQuizQuestions(shuffleEnabled) {
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
      answer: card.definition,
    };
  });

  if (shuffleEnabled) {
    shuffle(quizQuestions);
  }
}

function startQuiz() {
  const shuffleEnabled = document.getElementById("shuffle-toggle").checked;
  retryEnabled = document.getElementById("retry-toggle").checked;

  generateQuizQuestions(shuffleEnabled);
  quizIndex = 0;
  quizScore = 0;
  missedQuestions = [];

  document.getElementById("quiz-result").style.display = "none";
  document.getElementById("quiz-question").style.display = "block";
  document.getElementById("quiz-choices").style.display = "block";
  document.getElementById("quiz-status").style.display = "block";
  document.getElementById("timer").style.display = "block";

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
  document.getElementById("quiz-status").textContent =
    `Question ${quizIndex + 1} of ${quizQuestions.length}`;
}

function handleQuizChoice(button, selected, correct) {
  const buttons = document.getElementById("quiz-choices").children;

  for (let btn of buttons) {
    btn.disabled = true;
    btn.style.backgroundColor = btn.textContent === correct ? "lightgreen" : "lightcoral";
  }

  if (selected === correct) {
    quizScore++;
  } else if (retryEnabled) {
    missedQuestions.push(quizQuestions[quizIndex]);
  }

  document.getElementById("quiz-next").style.display = "inline-block";
}

document.addEventListener("DOMContentLoaded", () => {
  const nextBtn = document.getElementById("quiz-next");

  nextBtn.onclick = () => {
    quizIndex++;

    if (quizIndex < quizQuestions.length) {
      showQuizQuestion();
    } else if (retryEnabled && missedQuestions.length > 0) {
      quizQuestions = [...missedQuestions];
      missedQuestions = [];
      quizIndex = 0;
      showQuizQuestion();
    } else {
      showQuizResults();
    }
  };

  // Populate topic dropdown from localStorage
  const saved = JSON.parse(localStorage.getItem("flashcardGroups") || "{}");
  window.flashcardGroups = saved;

  const select = document.getElementById("topic-select");
  select.innerHTML = '<option value="" disabled selected>Select a set</option>';
  for (const key in saved) {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = key;
    select.appendChild(opt);
  }
});

function showQuizResults() {
  document.getElementById("quiz-question").style.display = "none";
  document.getElementById("quiz-choices").style.display = "none";
  document.getElementById("quiz-next").style.display = "none";
  document.getElementById("quiz-status").style.display = "none";
  document.getElementById("timer").style.display = "none";

  const resultDiv = document.getElementById("quiz-result");
  resultDiv.style.display = "block";

  const total = quizQuestions.length + missedQuestions.length;
  const percent = (quizScore / total) * 100;
  let feedback = "";

  if (percent === 100) feedback = "🌟 Perfect score!";
  else if (percent >= 75) feedback = "👍 Great job!";
  else if (percent >= 50) feedback = "🙂 Good effort!";
  else feedback = "😅 Keep practicing!";

  resultDiv.innerHTML = `
    <h2>Quiz Complete!</h2>
    <p>You scored ${quizScore} out of ${total}.</p>
    <p>${feedback}</p>
    <button onclick="startQuiz()" class="btn">Try Again</button>
  `;
}
