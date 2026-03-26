// ===== BASKETBALL CURSOR =====
document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.createElement('div');
  cursor.id = 'basketball-cursor';
  cursor.innerHTML = '🏀';
  document.body.appendChild(cursor);

  document.documentElement.style.cursor = 'none';

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.display = 'block';
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.display = 'none';
  });

  document.addEventListener('mousedown', () => {
    cursor.style.transform = 'scale(0.85) rotate(15deg)';
  });

  document.addEventListener('mouseup', () => {
    cursor.style.transform = 'scale(1) rotate(0deg)';
  });

  const clickables = document.querySelectorAll('a, button, input, textarea, .nav-link, .nav-btn, .cta-button, .game-btn, .level-btn, .project-card, .about-item, .contact-item');
  
  clickables.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(1.3)';
      cursor.innerHTML = '🏀';
      cursor.style.filter = 'drop-shadow(0 0 20px rgba(255, 140, 0, 1)) drop-shadow(0 0 40px rgba(255, 140, 0, 0.6))';
    });

    element.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      cursor.style.filter = 'drop-shadow(0 0 10px rgba(255, 140, 0, 0.6))';
    });
  });

  console.log("🏀 Basketball cursor activated!");
});

// ===== SHOW/HIDE SECTIONS =====
function showSection(sectionId) {
  const sections = document.querySelectorAll('.page-section');
  sections.forEach(section => {
    section.classList.remove('active');
  });

  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.classList.add('active');
    window.scrollTo(0, 0);
  }

  // FIXED: Use data attribute instead of onclick parsing
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') === sectionId) {
      link.classList.add('active');
    }
  });

  console.log(`📄 Switched to ${sectionId} section`);
}

// ===== STAR RATING =====
const stars = document.querySelectorAll(".rating span");
let selectedRating = 0;

// FIXED: Check if stars exist to prevent errors
if (stars.length > 0) {
  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      selectedRating = index + 1;
      stars.forEach(s => s.classList.remove("selected"));
      for (let i = 0; i < selectedRating; i++) {
        stars[i].classList.add("selected");
      }
      console.log(`⭐ Rating set to ${selectedRating}`);
    });
  });
}

// ===== FEEDBACK FORM =====
const feedbackForm = document.getElementById("feedbackForm");
let isSubmitting = false; // FIXED: Prevent duplicate submissions

if (feedbackForm) {
  feedbackForm.addEventListener("submit", function(e) {
    e.preventDefault();

    // FIXED: Prevent double submission
    if (isSubmitting) return;
    isSubmitting = true;

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const formMessage = document.getElementById("formMessage");

    // Validation
    if(name.length < 2){
      formMessage.textContent = "Please enter a valid name.";
      formMessage.style.color = "#ff00ff";
      isSubmitting = false;
      return;
    }
    if(!email.includes("@") || !email.includes(".")){
      formMessage.textContent = "Please enter a valid email.";
      formMessage.style.color = "#ff00ff";
      isSubmitting = false;
      return;
    }
    if(message.length < 10){
      formMessage.textContent = "Message must be at least 10 characters.";
      formMessage.style.color = "#ff00ff";
      isSubmitting = false;
      return;
    }
    if(selectedRating === 0){
      formMessage.textContent = "Please select a rating.";
      formMessage.style.color = "#ff00ff";
      isSubmitting = false;
      return;
    }

    // FIXED: Better email validation
    formMessage.textContent = "✅ Feedback submitted successfully!";
    formMessage.style.color = "#00ffcc";
    feedbackForm.reset();
    stars.forEach(s => s.classList.remove("selected"));
    selectedRating = 0;
    
    setTimeout(() => {
      formMessage.textContent = "";
      isSubmitting = false;
    }, 3000);
  });
}

// ===== SNAKE GAME =====
const canvas = document.getElementById('gameCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');

  let snake = [{x: 200, y: 200}];
  let food = {x: 300, y: 300};
  let score = 0;
  let gameRunning = false;
  let gamePaused = false;
  let currentLevel = 1;
  let gameSpeed = 5;
  let gameLoop;

  const levels = {
    1: {name: 'Easy', speed: 5},
    2: {name: 'Medium', speed: 8},
    3: {name: 'Hard', speed: 12}
  };

  let dx = 10;
  let dy = 0;
  let nextDx = 10;
  let nextDy = 0;

  const gridSize = 10;

  window.setLevel = function(level, event) {
    if (gameRunning) return;

    currentLevel = level;
    gameSpeed = levels[level].speed;

    document.querySelectorAll('.level-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    event.target.classList.add('active');

    document.getElementById('level').textContent = levels[level].name;
    document.getElementById('speed').textContent = gameSpeed;

    resetGame();
  };

  function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
  }

  function draw() {
    ctx.fillStyle = '#0d0d0d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#ff8c00' : '#00ffcc';
      ctx.fillRect(segment.x, segment.y, gridSize - 2, gridSize - 2);
    });

    ctx.fillStyle = '#ff00ff';
    ctx.beginPath();
    ctx.arc(food.x + gridSize/2, food.y + gridSize/2, gridSize/2 - 1, 0, Math.PI*2);
    ctx.fill();
  }

  function update() {
    dx = nextDx;
    dy = nextDy;

    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
      endGame("Game Over! Hit wall! 🧱");
      return;
    }

    for (let s of snake) {
      if (head.x === s.x && head.y === s.y) {
        endGame("Game Over! Hit yourself! 💥");
        return;
      }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score += 10;
      document.getElementById('score').textContent = score;
      generateFood();
    } else {
      snake.pop();
    }
  }

  function loop() {
    if (!gameRunning || gamePaused) return;
    update();
    draw();
  }

  window.startGame = function() {
    if (gameRunning && !gamePaused) return;
    
    gameRunning = true;
    gamePaused = false;
    document.getElementById('pauseBtn').textContent = "⏸️ Pause";
    
    clearInterval(gameLoop);
    gameLoop = setInterval(loop, 1000 / gameSpeed);
  };

  window.pauseGame = function() {
    if (!gameRunning) return;
    
    gamePaused = !gamePaused;
    document.getElementById('pauseBtn').textContent = gamePaused ? "▶️ Resume" : "⏸️ Pause";
  };

  window.resetGame = function() {
    snake = [{x: 200, y: 200}];
    score = 0;
    gameRunning = false;
    gamePaused = false;
    dx = 10;
    dy = 0;
    nextDx = 10;
    nextDy = 0;

    document.getElementById('score').textContent = 0;
    document.getElementById('gameMessage').textContent = "";
    document.getElementById('pauseBtn').textContent = "⏸️ Pause";

    clearInterval(gameLoop);
    generateFood();
    draw();
  };

  function endGame(msg) {
    gameRunning = false;
    clearInterval(gameLoop);
    document.getElementById('gameMessage').textContent = msg;
  }

  document.addEventListener('keydown', e => {
    if (!gameRunning) return;

    if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && dy === 0) {
      nextDx = 0; nextDy = -gridSize;
    }
    if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && dy === 0) {
      nextDx = 0; nextDy = gridSize;
    }
    if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && dx === 0) {
      nextDx = -gridSize; nextDy = 0;
    }
    if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && dx === 0) {
      nextDx = gridSize; nextDy = 0;
    }
  });

  window.addEventListener('load', () => {
    window.resetGame();
    console.log("🐍 Snake Game initialized!");
  });
}

console.log("✅ Portfolio loaded successfully!");