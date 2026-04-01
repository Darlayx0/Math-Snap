import './style.css';

// Game State
let score = 0;
let correctPoints = 0;
let wrongPoints = 0;
let timeLeft = 60;
let timerInterval = null;
let currentAnswer = 0;
let isPlaying = false;

// High Scores
let highScore = parseInt(localStorage.getItem('mathSnapHighScore')) || 0;
let highCorrect = parseInt(localStorage.getItem('mathSnapHighCorrect')) || 0;

const app = document.querySelector('#app');

function renderUI() {
  app.innerHTML = `
    <div class="game-container">
      <div class="header">
        <h1>Math Snap</h1>
        <div class="high-scores">
          <div>High Score: <span id="hs">${highScore}</span></div>
          <div>Most Correct: <span id="hc">${highCorrect}</span></div>
        </div>
      </div>
      
      ${!isPlaying ? `
        <div class="start-screen glass-panel">
          <h2>Ready to Snap?</h2>
          <p>Answer as many addition problems (1-100) as you can in 1 minute!</p>
          <ul>
            <li><span class="text-green">Correct:</span> +1 Point, +20 Score</li>
            <li><span class="text-red">Wrong:</span> +1 Wrong, -100 Score</li>
          </ul>
          <button id="start-btn" class="primary-btn pulse">Start Game</button>
        </div>
      ` : `
        <div class="game-screen glass-panel">
          <div class="stats-bar">
            <div class="stat time">Time: <span id="time" class="${timeLeft <= 10 ? 'text-red pulse' : ''}">${timeLeft}s</span></div>
            <div class="stat score">Score: <span id="score">${score}</span></div>
          </div>
          
          <div class="points-bar">
            <div class="stat correct">Correct: <span id="correct" class="text-green">${correctPoints}</span></div>
            <div class="stat wrong">Wrong: <span id="wrong" class="text-red">${wrongPoints}</span></div>
          </div>
          
          <div class="problem-container">
            <div id="problem" class="problem-text"></div>
          </div>
          
          <div class="input-container">
            <input type="number" id="answer-input" placeholder="Enter answer..." autofocus autocomplete="off" />
            <div class="feedback" id="feedback"></div>
          </div>
        </div>
      `}
    </div>
  `;
  
  if (!isPlaying) {
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
      if (document.getElementById('end-stats')) {
        // We are on end screen, hook up start button from there if we put it, but we put it in renderEndScreen possibly
      }
      startBtn.addEventListener('click', startGame);
    }
  } else {
    // We are playing
    const input = document.getElementById('answer-input');
    if (input) {
      input.focus();
      input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          checkAnswer(parseInt(input.value));
        }
      });
      // Optionally attach it to outside buttons if mobile, but keyboard usually suffices.
    }
  }
}

function renderEndScreen() {
  app.innerHTML = `
    <div class="game-container">
      <div class="header">
        <h1>Math Snap</h1>
      </div>
      <div class="end-screen glass-panel">
        <h2>Time's Up!</h2>
        <div class="final-stats">
          <div class="stat-box">
            <div class="stat-label">Final Score</div>
            <div class="stat-value text-primary">${score}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Correct</div>
            <div class="stat-value text-green">${correctPoints}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Wrong</div>
            <div class="stat-value text-red">${wrongPoints}</div>
          </div>
        </div>
        
        ${score > highScore || correctPoints > highCorrect ? `
          <div class="new-record pulse text-primary">🎉 New Record! 🎉</div>
        ` : ''}
        
        <button id="restart-btn" class="primary-btn">Play Again</button>
      </div>
    </div>
  `;
  
  document.getElementById('restart-btn').addEventListener('click', () => {
    isPlaying = false;
    renderUI();
  });
}

function generateProblem() {
  const num1 = Math.floor(Math.random() * 100) + 1;
  const num2 = Math.floor(Math.random() * 100) + 1;
  currentAnswer = num1 + num2;
  
  const problemEl = document.getElementById('problem');
  if (problemEl) {
    problemEl.textContent = `${num1} + ${num2} = ?`;
    // Add small animation
    problemEl.classList.remove('pop');
    void problemEl.offsetWidth; // trigger reflow
    problemEl.classList.add('pop');
  }
}

function checkAnswer(userAnswer) {
  if (isNaN(userAnswer)) return;
  
  const feedbackEl = document.getElementById('feedback');
  const input = document.getElementById('answer-input');
  
  if (userAnswer === currentAnswer) {
    score += 20;
    correctPoints += 1;
    showFeedback('Correct!', 'success');
  } else {
    score -= 100;
    wrongPoints += 1;
    showFeedback('Wrong!', 'error');
  }
  
  // Update stats UI immediately
  document.getElementById('score').textContent = score;
  document.getElementById('correct').textContent = correctPoints;
  document.getElementById('wrong').textContent = wrongPoints;
  
  input.value = '';
  input.focus();
  generateProblem();
}

function showFeedback(text, type) {
  const inputContainer = document.querySelector('.input-container');
  const fb = document.createElement('div');
  fb.className = `floating-feedback ${type}`;
  fb.textContent = text;
  inputContainer.appendChild(fb);
  
  setTimeout(() => {
    fb.remove();
  }, 1000);
}

function startGame() {
  score = 0;
  correctPoints = 0;
  wrongPoints = 0;
  timeLeft = 60;
  isPlaying = true;
  
  renderUI();
  generateProblem();
  
  timerInterval = setInterval(() => {
    timeLeft--;
    const timeEl = document.getElementById('time');
    if (timeEl) {
      timeEl.textContent = `${timeLeft}s`;
      if (timeLeft <= 10) {
        timeEl.classList.add('text-red', 'pulse');
      }
    }
    
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(timerInterval);
  isPlaying = false;
  
  // Update local storage
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('mathSnapHighScore', highScore);
  }
  if (correctPoints > highCorrect) {
    highCorrect = correctPoints;
    localStorage.setItem('mathSnapHighCorrect', highCorrect);
  }
  
  renderEndScreen();
}

// Initial render
renderUI();
