  var board = document.getElementById("gameBoard");
  var levelText = document.getElementById("levelText");
  var movesEl = document.getElementById("moves");
  var timeEl = document.getElementById("time");
  var nextLevelBtn = document.getElementById("nextLevelBtn");
  var popup = document.getElementById("popup");
  var resultTitle = document.getElementById("resultTitle");
  var resultStats = document.getElementById("resultStats");
  var starsEl = document.getElementById("stars");

  var levels = [];
  for(var i=2; i<=8; i++)
{
levels.push(i);
}
  var emojiSet = [
    "🐶","🐱","🦊","🦁","🐯","🐨","🐼","🐸",
    "🐵","🦄","🐙","🐝","🐢","🐻","🦒","🐘",
  ];

  var moveLimit = 0; 
  var levelIndex = 0;
  var cards = [];
  var firstCard = null;
  var secondCard = null;
  var lockBoard = false;
  var moves = 0;
  var matchedPairs = 0;
  var time = 0;
  var timer = null;
  var levelWon = false;

  function shuffle(arr){
    arr.sort(() => Math.random() - 0.5);
  }

  function startTimer(){
    if(timer) return;
    timer = setInterval(() => {
      time++;
      timeEl.textContent = time;
    },1000);
  }

  function stopTimer(){
    clearInterval(timer);
    timer = null;
  }

  function calMoveLimit(size){
    return size * size;
  }

  function setupLevel(){
    var size = levels[levelIndex];
    moveLimit = calMoveLimit(size);

    document.querySelector(".stats div:nth-child(2)").innerHTML =
      'Moves: <span id="moves">0</span>/' + moveLimit;

    var totalCards = size * size;
    var pairs = Math.floor(totalCards / 2);

    board.style.gridTemplateColumns = `repeat(${size}, 60px)`;
    board.innerHTML = "";

    levelText.textContent = size + "×" + size;
    moves = 0;
    matchedPairs = 0;
    time = 0;
    movesEl = document.getElementById("moves");
    movesEl.textContent = "0";
    timeEl.textContent = "0";
    stopTimer();

    var levelemojiSet = emojiSet.slice(0, pairs);
    cards = levelemojiSet.concat(levelemojiSet);
    shuffle(cards);

    cards.forEach(sym => {
      var card = document.createElement("div");
      card.className = "card";
      card.dataset.symbol = sym;
      card.innerHTML = sym;
      card.onclick = () => flipCard(card);
      board.appendChild(card);
    });
  }

  function flipCard(card){
    if(lockBoard) return;
    if(card.classList.contains("flipped") || card.classList.contains("matched")) return;
    if(moves >= moveLimit) return;

    startTimer();
    card.classList.add("flipped");

    if(!firstCard){
      firstCard = card;
      return;
    }

    secondCard = card;
    lockBoard = true;
    moves++;
    movesEl.textContent = moves;

    if(firstCard.dataset.symbol === secondCard.dataset.symbol){
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      matchedPairs++;
      resetTurn();

      var size = levels[levelIndex];
      var neededPairs = Math.floor((size * size) / 2);

      if(matchedPairs === neededPairs){
        levelWon = true;
        stopTimer();
        showPopup(true);
      }

    } else {
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetTurn();

        if(moves >= moveLimit){
          levelWon = false;
          stopTimer();
          showPopup(false);
        }
      },1000);
    }
  }

  function resetTurn(){
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
  }

  function getStars(){
    if(moves <= moveLimit * 0.5) return "⭐⭐⭐";
    if(moves <= moveLimit * 0.8) return "⭐⭐";
    return "⭐";
  }

  function showPopup(win){
    popup.style.display = "flex";

    if(win){
      resultTitle.textContent = "🎉 Level Completed! 🥳";
      resultStats.textContent =
        "Moves: " + moves + " / " + moveLimit + " | Time: " + time + "s";
      starsEl.textContent = getStars();
      nextLevelBtn.textContent = "Next Level";
    } else {
      resultTitle.textContent = "❌ Level Not Completed!";
      resultStats.textContent =
        "Moves: " + moves + " / " + moveLimit + " | Time: " + time + "s";
      starsEl.textContent = "";
      nextLevelBtn.textContent = "Try Again";
    }
  }

  function nextOrRetry(){
    popup.style.display = "none";

    if(levelWon && levelIndex < levels.length - 1){
      levelIndex++;
    }

    setupLevel();
  }

  document.getElementById("resetBtn").onclick = function(){
    popup.style.display = "none";
    board.classList.add("fade");

    setTimeout(() => {
      setupLevel();
      board.classList.remove("fade");
      board.classList.add("fade-show");

      setTimeout(() => {
        board.classList.remove("fade-show");
      },400);

    },400);
  };

  setupLevel();
