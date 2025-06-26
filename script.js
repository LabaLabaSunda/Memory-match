const board = document.getElementById("game-board");
const timerDisplay = document.getElementById("timer");
const matchSound = document.getElementById("match-sound");
const wrongSound = document.getElementById("wrong-sound");
const restartBtn = document.getElementById("restart");
const stars = document.getElementById("stars");

let timer = 0;
let interval;
let flippedCards = [];
let matched = [];

const imagePaths = Array.from(
  { length: 10 },
  (_, i) => `Images/img${i + 1}.png`
);

function startTimer() {
  clearInterval(interval);
  timer = 0;
  timerDisplay.textContent = "Time: 0s";
  interval = setInterval(() => {
    timer++;
    timerDisplay.textContent = `Time: ${timer}s`;
  }, 1000);
}

function createCard(image) {
  const card = document.createElement("div");
  card.classList.add("card");

  const inner = document.createElement("div");
  inner.classList.add("card-inner");

  const front = document.createElement("div");
  front.classList.add("card-front");

  const back = document.createElement("div");
  back.classList.add("card-back");

  const img = document.createElement("img");
  img.src = image;
  back.appendChild(img);

  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  card.addEventListener("click", () => {
    if (
      flippedCards.length < 2 &&
      !card.classList.contains("flip") &&
      !card.classList.contains("matched")
    ) {
      card.classList.add("flip");
      flippedCards.push({ card, image });
      if (flippedCards.length === 2) checkMatch();
    }
  });

  return card;
}

function checkMatch() {
  const [first, second] = flippedCards;
  if (first.image === second.image) {
    matchSound.play();
    first.card.classList.add("matched");
    second.card.classList.add("matched");
    matched.push(first.image);
    flippedCards = [];
    if (matched.length === imagePaths.length) {
      clearInterval(interval);
      stars.style.animation = "pop-stars 1s ease forwards";
      setTimeout(() => alert(`You win!\nTime: ${timer} Second`), 500);
    }
  } else {
    wrongSound.play();
    setTimeout(() => {
      first.card.classList.remove("flip");
      second.card.classList.remove("flip");
      flippedCards = [];
    }, 1000);
  }
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function initGame() {
  board.innerHTML = "";
  matched = [];
  flippedCards = [];
  stars.style.animation = "none";
  void stars.offsetWidth;
  const cards = shuffle([...imagePaths, ...imagePaths]);
  cards.forEach((img) => board.appendChild(createCard(img)));
  startTimer();
}

restartBtn.addEventListener("click", initGame);

window.onload = initGame;
