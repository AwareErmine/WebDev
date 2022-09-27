const icons = {
  rocks: "🪨",
  papers: "📄",
  scissors: "✂️",
};

const game = {
  user: {
    rocks: 5,
    papers: 5,
    scissors: 5,
  },
  computer: {
    rocks: 5,
    papers: 5,
    scissors: 5,
  },
};

const selected = {
  elem: null,
  type: null,
};

const weaponToDeafeater = {
  // weapon to what defeats it
  rocks: "papers",
  papers: "scissors",
  scissors: "rocks",
};

var roundCount = 0;

function htmlToElement(html) {
  var template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;

  return template.content.firstChild;
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function getWinner(computerChoice, userChoice) {
  if (computerChoice == userChoice) return "nobody";
  else if (weaponToDeafeater[computerChoice] == userChoice) return "user";
  else if (weaponToDeafeater[userChoice] == computerChoice) return "computer";

  console.log(computerChoice, userChoice);
  return "everybody✨"; // when would this happen
}

function getComputerChoice() {
  return weaponToDeafeater[
    shuffle(Object.keys(game.user)).find(
      (weapon) =>
        game.computer[weaponToDeafeater[weapon]] > 0 && game.user[weapon] > 0
    )
  ];
}

function battle() {
  // Computer choice, reset user choice, say who won, add to log
  const computerChoice = getComputerChoice();
  const computerChoiceBox = document.getElementById("computerChoice");
  computerChoiceBox.innerHTML = icons[computerChoice];

  // Make winner changes
  const winner = getWinner(computerChoice, selected.type);
  const winnerHeading = document.getElementById("winner");
  winnerHeading.innerHTML = `${winner} wins!`;

  // Update supplies
  let loserChoice = selected.type;
  if (winner != "nobody") {
    const loser = winner == "computer" ? "user" : "computer";
    loserChoice = loser == "computer" ? computerChoice : selected.type;

    game[winner][loserChoice] = game[winner][loserChoice] + 1;
    game[loser][loserChoice] = game[loser][loserChoice] - 1;
  }

  // Reset + visually update
  const userChoiceCount = document.getElementById(`user${loserChoice}`);
  userChoiceCount.innerHTML = "x" + game.user[loserChoice];
  const computerChoiceCount = document.getElementById(`computer${loserChoice}`);
  computerChoiceCount.innerHTML = "x" + game.computer[loserChoice];

  const battleButton = document.getElementById("battle");
  battleButton.innerHTML = "Next Round";
  battleButton.onclick = () => nextRound(computerChoice, winner);
}

function addToLog(computerChoice, winner) {
    // Add results to log
    roundCount++;
    const log = document.getElementById("log-cards");
    log.prepend(
        htmlToElement(`
            <div class="log-card">
                <p>${roundCount}</p>
                <h1>${icons[computerChoice]} vs ${icons[selected.type]}</h1>
                <h3>${winner} won</h3>
            </div>
        `)
    );
}

function onWeaponClick(evt, type) {
  if (game.user[type] == 0) return;
  const battleButton = document.getElementById("battle");
  if (battleButton.innerHTML == "Next Round") return;

  if (selected.elem) selected.elem.classList.remove("chosen-one");
  evt.currentTarget.classList.add("chosen-one");
  selected.elem = evt.currentTarget;
  selected.type = type;
  const choiceBox = document.getElementById("userChoice");
  choiceBox.innerHTML = icons[type];

  const computerChoiceBox = document.getElementById("computerChoice");
  computerChoiceBox.innerHTML = "?";

  // Un-disable battle button when player makes choice
  battleButton.innerHTML = "BATTLE!";
  battleButton.disabled = false;
}

function nextRound(computerChoice, winner) {
  addToLog(computerChoice, winner);
  selected.elem.classList.remove("chosen-one");

  // Update choices
  const choiceBox = document.getElementById("userChoice");
  choiceBox.innerHTML = "?";
  const computerChoiceBox = document.getElementById("computerChoice");
  computerChoiceBox.innerHTML = "?";

  // Update button
  const battleButton = document.getElementById("battle");
  battleButton.disabled = true;
  battleButton.innerHTML = "BATTLE!";
  battleButton.onclick = battle;

  // Update prompt
  const winnerHeading = document.getElementById("winner");
  winnerHeading.innerHTML = `Select an item!`;

  // Update Weapons
  const userChoiceCount = document.getElementById(`user${selected.type}`);
  userChoiceCount.innerHTML = "x" + game.user[selected.type];
  const computerChoiceCount = document.getElementById(
    `computer${selected.type}`
  );
  computerChoiceCount.innerHTML = "x" + game.computer[selected.type];
}

function renderWeapons(id, player) {
  const elem = document.getElementById(id);
  Object.keys(icons).map((key) => {
    const weapon = htmlToElement(`
            <div ${
              player == "user"
                ? `onclick="onWeaponClick(event, '${key}')" class="user-weapon"`
                : "class='computer-weapon'"
            }>
                ${icons[key]}<span id="${player}${key}">x${
      game[player][key]
    }</span>
            <div>
        `);
    elem.appendChild(weapon);
  });
}

function onPageLoad(evt) {
  renderWeapons("userWeaponsContainer", "user");
  renderWeapons("computerWeaponsContainer", "computer");
  // Disable battle button until player makes choice
  const battleButton = document.getElementById("battle");
  battleButton.disabled = true;
}

document.addEventListener("DOMContentLoaded", onPageLoad);
