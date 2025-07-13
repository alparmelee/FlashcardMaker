let quizQuestions = [];
let quizIndex = 0;
let quizScore = 0;
let missedQuestions = [];
let retryEnabled = false;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function generateQuizQuestions(shuffleEnabled) {
  // Check that 'flashcards' global variable exists and has data
  if (!window.flashcards || !Array.isArray(window.flashcards) || window.flashcards.length === 0) {
    alert("No flashcards available. Please load flashcards first.");
    return;
  }

  quizQuestions = window.flashcards.map((card, i, arr) => {
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
    quizQuestions = shuffle(quizQuestions);
  }
}

function startQuiz() {
  retryEnabled = document.getElementById("retry-toggle").checked;

  generateQuizQuestions(document.getElementById("shuffle-toggle").checked);
  if (!quizQuestions.length) return; // stop if no questions

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
  document.getElementById("timer").textContent = "30s";

  startTimer();
}

let timerInterval = null;
let timeLeft = 30;

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 30;
  document.getElementById("timer").textContent = `${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      disableChoices();

      if (retryEnabled) missedQuestions.push(quizQuestions[quizIndex]);

      document.getElementById("quiz-next").style.display = "inline-block";
    }
  }, 1000);
}

function disableChoices() {
  const buttons = document.getElementById("quiz-choices").querySelectorAll("button");
  buttons.forEach(btn => (btn.disabled = true));
}

function handleQuizChoice(button, selected, correct) {
  clearInterval(timerInterval);
  disableChoices();

  const buttons = document.getElementById("quiz-choices").querySelectorAll("button");
  buttons.forEach(btn => {
    if (btn.textContent === correct) {
      btn.style.backgroundColor = "lightgreen";
    } else if (btn === button && selected !== correct) {
      btn.style.backgroundColor = "lightcoral";
    }
  });

  if (selected === correct) {
    quizScore++;
  } else if (retryEnabled) {
    missedQuestions.push(quizQuestions[quizIndex]);
  }

  document.getElementById("quiz-next").style.display = "inline-block";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("quiz-next").onclick = () => {
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
});

function showQuizResults() {
  clearInterval(timerInterval);

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

  // Optionally show missed questions for review
  const reviewSection = document.getElementById("review-section");
  if (missedQuestions.length > 0) {
    reviewSection.innerHTML = "<h3>Review Missed Questions:</h3>";
    missedQuestions.forEach(q => {
      const div = document.createElement("div");
      div.innerHTML = `<strong>Q:</strong> ${q.question}<br/><strong>Answer:</strong> ${q.answer}<hr/>`;
      reviewSection.appendChild(div);
    });
  } else {
    reviewSection.innerHTML = "";
  }
}
