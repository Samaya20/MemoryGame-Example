// Preloader animation text (saytın özü verir bu scripti)

function setTextAnimation(
  delay,
  duration,
  strokeWidth,
  timingFunction,
  strokeColor,
  repeat
) {
  let paths = document.querySelectorAll("path");
  let mode = repeat ? "infinite" : "forwards";
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const length = path.getTotalLength();
    path.style["stroke-dashoffset"] = `${length}px`;
    path.style["stroke-dasharray"] = `${length}px`;
    path.style["stroke-width"] = `${strokeWidth}px`;
    path.style["stroke"] = `${strokeColor}`;
    path.style[
      "animation"
    ] = `${duration}s svg-text-anim ${mode} ${timingFunction}`;
    path.style["animation-delay"] = `${i * delay}s`;
  }
}
setTextAnimation(0.03, 3.4, 2, "ease-out", "#b5b9d4", true);

// Preloader

window.onload = () => {
  const preloader = document.getElementById("preloader");
  setTimeout(() => {
    preloader.style.opacity = 0;
    preloader.style.visibility = "hidden";
  }, 5000);
};

// Main scripts

let flippedCards = [];
let point = 0;
let mistakes = 0;
let startTime;


fetch("cards.json")
  .then((response) => response.json())
  .then((data) => {
    const cardsWrapper = document.getElementById("cardsWrapper");

    //  randomla hərəsindən 2 dənə çıxara bilərdim, özüm three dots anlayışını praktika etmək üçün belə yazdım
    const datas = [...data, ...data];

    datas.forEach((card) => {
      cardsWrapper.innerHTML += `
            <div class="card-item" data-name="${card.name}" onclick="flipCard(this)">
                <div class="card-inner">
                    <div class="front-face">
                        <img src="${card.image}" class="card-image"/>
                    </div>
                    <div class="back-face">?</div>
                </div>
            </div>
            `;
    });

    startTime = Date.now();
    startTimer();
    shuffleCards();
  });

function flipCard(card) {
  if (flippedCards.length < 2 && !flippedCards.includes(card)) {
    card.classList.add("flipped");
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      setTimeout(checkCards, 1000);
    }
  }
}

function checkCards() {
  let [firstCard, secondCard] = flippedCards;

  let firstCardName = firstCard.getAttribute("data-name");
  let secondCardName = secondCard.getAttribute("data-name");

  if (firstCardName === secondCardName) {
    point++;
    document.getElementById("point").innerText = point;
  } else {
    mistakes++;
    document.getElementById("mistake").innerText = mistakes;

    flippedCards.forEach((card) => card.classList.remove("flipped"));
  }

  flippedCards = [];

  if (point === 5) {
    alert("You are Winner!");
    restartGame();
  }
}

function restartGame() {
  flippedCards = [];
  point = 0;
  mistakes = 0;
  document.getElementById("point").innerText = point;
  document.getElementById("mistake").innerText = mistakes;

  document
    .querySelectorAll(".card-item")
    .forEach((card) => card.classList.remove("flipped"));

  startTime = Date.now();
  startTimer();
  shuffleCards();
}

function startTimer() {
  setInterval(updateTimer, 1000);
}


/* Bu timer məsələsini özüm fikirləşmədim fərqli resurslardan öyrənib yazdım olmasını istədiyim üçün.
spanın içindəki formata uyğun olsun deyə belə uzandı)*/

function updateTimer() {
  let elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  let hours = Math.floor(elapsedTime / 3600);
  let minutes = Math.floor((elapsedTime - hours * 3600) / 60);
  let seconds = elapsedTime % 60;

  let formattedTime =
    padZero(hours) + ":" + padZero(minutes) + ":" + padZero(seconds);

  document.getElementById("time").innerText = formattedTime;
}

function padZero(num) {
  return num < 10 ? "0" + num : num;
}

function shuffleCards() {
  const cards = document.querySelectorAll(".card-item");
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * cards.length);
    card.style.order = randomPos;
  });
}
