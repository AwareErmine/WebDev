const icons = {
  rocks: "🪨",
  papers: "📄",
  scissors: "✂️",
};

const game = {
  user: {
    rocks: 15,
    papers: 15,
    scissors: 15,
  },
  computer: {
    rocks: 15,
    papers: 15,
    scissors: 15,
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

function getFormattedAmtForPlayer(player, choice) {
    return "x" + ~~(game[player][choice]/3) + "R" + game[player][choice]%3;
}

function battle() {
  // Computer choice, reset user choice, say who won, add to log
  const computerChoice = getComputerChoice();
  const computerChoiceBox = document.getElementById("computerChoice"); // the big one in the middle
  computerChoiceBox.innerHTML = icons[computerChoice];
  document.getElementById(`computer${computerChoice}weaponbox`).classList.add("chosen-one");

  // Make winner changes
  const winner = getWinner(computerChoice, selected.type);
  const winnerHeading = document.getElementById("winner");
  winnerHeading.innerHTML = `${winner} wins!`;
  
  // Battle button --> next round 
  const battleButton = document.getElementById("battle");
  battleButton.innerHTML = "Next Round";
  battleButton.onclick = () => nextRound(computerChoice, winner);
}

function addToLog(computerChoice, winner, weaponAmt) {
    const loser = winner == "computer" ? "user" : "computer";
    const loserChoice = loser == "computer" ? computerChoice : selected.type;

    roundCount++;
    const log = document.getElementById("log-cards");
    log.prepend(
        htmlToElement(`
            <div class="log-card">
                <p>${roundCount}</p>
                <center><h2>${winner} won</2></center>
                <div class="log-card-breakdown">
                    <center>
                        <h1>${icons[computerChoice]}</h1>
                        <h3>${winner == "computer" ? "+" : "-"}${weaponAmt}</h3>
                    </center>
                    <h1>vs</h1>
                    <center>
                        <h1>${icons[selected.type]}</h1>
                        <h3>${winner == "user" ? "+" : "-"}${weaponAmt}</h3>
                    </center>
                </div>
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
  // Update supplies
  let weaponAmt = 0;
  if (winner != "nobody") {
    const loser = winner == "computer" ? "user" : "computer";
    const loserChoice = loser == "computer" ? computerChoice : selected.type;

    // used the weapon
    game.computer[computerChoice] -= 1;
    game.user[selected.type] -= 1;

    // the winner gets the damaged weapon blah blah blah
    weaponAmt = game[loser][loserChoice] % 3 || 3;
    game[winner][loserChoice] += weaponAmt;
    game[loser][loserChoice] -= weaponAmt;
  }

  addToLog(computerChoice, winner, weaponAmt);
  selected.elem.classList.remove("chosen-one");
  document.getElementById(`computer${computerChoice}weaponbox`).classList.remove("chosen-one");

  // Update the value for the weapon you used on the user side
  const userChoiceCount = document.getElementById(`user${selected.type}`);
  userChoiceCount.innerHTML = getFormattedAmtForPlayer('user', selected.type);

  // Update the value for the weapon you used on the computer side
  const computerUserChoiceCount = document.getElementById(`computer${selected.type}`);
  computerUserChoiceCount.innerHTML = getFormattedAmtForPlayer('computer', selected.type);

  // Update the value for the computer's choice on user side
  const userComputerChoiceCount = document.getElementById(`user${computerChoice}`);
  userComputerChoiceCount.innerHTML = getFormattedAmtForPlayer('user', computerChoice);

  // Update the value for the weapon the computer used on the computer side
  const computerChoiceCount = document.getElementById(`computer${computerChoice}`);
  computerChoiceCount.innerHTML = getFormattedAmtForPlayer('computer', computerChoice);

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
}

function renderWeapons(id, player) {
  const elem = document.getElementById(id);
  Object.keys(icons).map((key) => {
    const weapon = htmlToElement(`
            <div ${
              player == "user"
                ? `onclick="onWeaponClick(event, '${key}')" class="user-weapon"`
                : "class='computer-weapon'"
            } id="${player}${key}weaponbox">
                ${icons[key]}<span id="${player}${key}">x${game[player][key] / 3}R${game[player][key] % 3}</span>
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

function onKeyPress(evt) {
    if (evt.code === "Enter") {
        // Next round would be a pain...
        const battleButton = document.getElementById("battle");
        if (battleButton.disabled) return;
        else if (battleButton.innerHTML == "BATTLE!") { 
            battle();
            return;
        };
    }
}

document.addEventListener("DOMContentLoaded", onPageLoad);
document.addEventListener("keydown", onKeyPress);
