const SPEED = randomNumberBetween(0.005, 0.03);

const INITIAL_VELOCITY = 0.05
const VELOCITY_INCREASE = 0.00001

const bgMusic = document.getElementById("bgMusic");

  function startMusic() {
    bgMusic.currentTime = 0;
    bgMusic.play().catch(e => {
      console.log("Audio play failed:", e);
    });
  }

class Ball {
  constructor(ballElem) {
    this.ballElem = ballElem
    this.reset()
    this.lastPaddleHitTime = 0
    this.lastHitter = null // 🆕 Track who hit last
  }

  get x() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"))
  }

  set x(value) {
    this.ballElem.style.setProperty("--x", value)
  }

  get y() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"))
  }

  set y(value) {
    this.ballElem.style.setProperty("--y", value)
  }

  rect() {
    return this.ballElem.getBoundingClientRect()
  }

  reset() {
    this.x = 50
    this.y = 50
    this.direction = { x: 0 }
    while (
      Math.abs(this.direction.x) <= 0.2 ||
      Math.abs(this.direction.x) >= 0.9
    ) {
      const heading = randomNumberBetween(0, 2 * Math.PI)
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) }
    }
    this.velocity = INITIAL_VELOCITY
    this.lastHitter = null // Reset on score
  }

  update(delta, paddles) {
    this.x += this.direction.x * this.velocity * delta
    this.y += this.direction.y * this.velocity * delta
    this.velocity += VELOCITY_INCREASE * delta

    const rect = this.rect()
    const now = performance.now()

    // Bounce off top and bottom
    if (rect.bottom >= window.innerHeight) {
      this.direction.y *= -1
      this.y = 100 - (rect.height / window.innerHeight * 100)
      
    } else if (rect.top <= 0) {
      this.direction.y *= -1
      this.y = (rect.height / window.innerHeight * 100)
      
    }

    // Paddle collision
    for (const paddle of paddles) {
      const paddleRect = paddle.rect()
      if (isCollision(paddleRect, rect) && now - this.lastPaddleHitTime > 100) {
        this.direction.x *= -1
        this.lastPaddleHitTime = now
        this.lastHitter = (paddle === playerPaddle) ? "player" : "computer"

        if (this.direction.x < 0) this.x -= 1
        else this.x += 1

        
        break
      }
    }
  }
}

class Paddle {
  constructor(paddleElem) {
    this.paddleElem = paddleElem
    this.speed = randomNumberBetween(0.005, 0.03)
    this.reset()
  }

  get position() {
    return parseFloat(
      getComputedStyle(this.paddleElem).getPropertyValue("--position")
    )
  }

  get height() {
    return parseFloat(getComputedStyle(this.paddleElem).height) / window.innerHeight * 100
  }

  set position(value) {
    const min = this.height / 2
    const max = 100 - this.height / 2
    value = Math.min(Math.max(value, min), max)
    this.paddleElem.style.setProperty("--position", value)
  }

  rect() {
    return this.paddleElem.getBoundingClientRect()
  }

  reset() {
    this.position = 50
  }

  update(delta, ballHeight) {
    this.position += SPEED * delta * (ballHeight - this.position)
  }
}

// Initialization
const ball = new Ball(document.getElementById("ball"))
const playerPaddle = new Paddle(document.getElementById("player-paddle"))
const computerPaddle = new Paddle(document.getElementById("computer-paddle"))
const playerScoreElem = document.getElementById("player-score")
const computerScoreElem = document.getElementById("computer-score")

let lastTime = null
function update(time) {
  if (lastTime != null) {
    const delta = time - lastTime
    ball.update(delta, [playerPaddle, computerPaddle])

    // 🧠 Only move computer paddle after player hits the ball
    if (ball.lastHitter === "player" || ball.lastHitter === null && ball.direction.x > 0) {
      computerPaddle.update(delta, ball.y)
    }

    if (isLose()) handleLose()
  }
  
  lastTime = time
  window.requestAnimationFrame(update)
}

function isLose() {
  const rect = ball.rect()
  return rect.right >= window.innerWidth || rect.left <= 0
}

function handleLose() {
  const rect = ball.rect()
  if (rect.right >= window.innerWidth) {
    playerScoreElem.textContent = parseInt(playerScoreElem.textContent) + 1
  } else {
    computerScoreElem.textContent = parseInt(computerScoreElem.textContent) + 1
  }

  ball.reset()
  computerPaddle.reset()
}

// Controls
document.addEventListener("mousemove", e => {
  playerPaddle.position = (e.y / window.innerHeight) * 100
});

document.addEventListener("touchmove", e => {
  e.preventDefault(); // 🛑 Prevent screen scroll
  const touch = e.touches[0];
  playerPaddle.position = (touch.clientY / window.innerHeight) * 100;
}, { passive: false }); // 👈 Important to allow preventDefault


document.addEventListener("touchstart", e => {
  e.preventDefault();
}, { passive: false });



window.requestAnimationFrame(update);






 document.addEventListener('DOMContentLoaded', () => {
	 hideScrollbar();
    document.addEventListener("click", () => {
    startMusic();
  }, { once: true });
  });


// Utility functions
function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min
}

function isCollision(rect1, rect2) {
  return (
    rect1.left <= rect2.right &&
    rect1.right >= rect2.left &&
    rect1.top <= rect2.bottom &&
    rect1.bottom >= rect2.top
  )
}


function hideScrollbar() {
  document.body.style.overflow = 'hidden';
}

function showScrollbar() {
  document.body.style.overflow = 'auto';
}


function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}
