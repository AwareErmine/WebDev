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
    selected: {
      elem: null,
      type: null,
      repeats: 0,
    },
  },
  computer: {
    rocks: 5,
    papers: 5,
    scissors: 5,
    selected: {
      elem: null,
      type: null,
      repeats: 0,
    },
  },
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
    shuffle(Object.keys(icons)).find(
      (weapon) =>
        game.computer[weaponToDeafeater[weapon]] > 0 && game.user[weapon] > 0
    )
  ];
}

function getFormattedAmtForPlayer(player, choice) {
  return "x" + game[player][choice];
}

function setPlayerChoice(player, choice) {
  if (choice == game[player].selected.type) {
    if (game[player].selected.repeats == 3) {
      // on the fourth repeat they lose a weapon
      game[player].selected.repeats = 0;
      game[player][choice] -= 1;
      console.log(game[player]);
    } else {
      // they repeated the weapon
      game[player].selected.repeats += 1;
    }
  } else {
    // it's a new weapon! what originality!
    game[player].selected.repeats = 1;
    game[player].selected.type = choice;
  }
}

function battle() {
  // Computer choice get + display
  const computerChoice = getComputerChoice();
  const computerChoiceBox = document.getElementById("computerChoice"); // the big one in the middle
  computerChoiceBox.innerHTML = icons[computerChoice];
  document
    .getElementById(`computer${computerChoice}weaponbox`)
    .classList.add("chosen-one");

  // Make winner changes
  const winner = getWinner(computerChoice, game.user.selected.type);
  const winnerHeading = document.getElementById("winner");
  winnerHeading.innerHTML = `${winner} wins!`;

  setPlayerChoice("computer", computerChoice);
  setPlayerChoice("user", game.user.selected.type); // this "finalizes" the selection

  if (winner != "nobody") {
    const loser = winner == "computer" ? "user" : "computer";
    // winner gets loser's weapon
    if (game[loser][game[loser].selected.type] != 0) {
      game[winner][game[loser].selected.type] += 1;
      game[loser][game[loser].selected.type] -= 1;
    }
  }

  // Battle button --> next round
  const battleButton = document.getElementById("battle");
  battleButton.innerHTML = "Next Round";
  battleButton.onclick = () => nextRound(computerChoice, winner);
}

function addToLog(computerChoice, winner) {
  roundCount++;
  const log = document.getElementById("log-cards");
  log.prepend(
    htmlToElement(`
            <div class="log-card">
                <p>${roundCount}</p>
                <center><h2>${winner} won</2></center>
                <div class="log-card-breakdown">
                    <div class="log-card-column">
                        <h1>${icons[computerChoice]}</h1>
                        <h3>${winner == "computer" ? "+" : "-"}1</h3>
                        <h4>${"| ".repeat(game.computer.selected.repeats)}</h4>
                    </div>
                    <h1>vs</h1>
                    <div class="log-card-column">
                        <h1>${icons[game.user.selected.type]}</h1>
                        <h3>${winner == "user" ? "+" : "-"}1</h3>
                        <h4>${"| ".repeat(game.user.selected.repeats)}</h4>
                    </div>
                </div>
            </div>
        `)
  );
}

function onWeaponClick(evt, type) {
  if (game.user[type] == 0) return;
  const battleButton = document.getElementById("battle");
  if (battleButton.innerHTML == "Next Round") return;

  if (game.user.selected.elem)
    game.user.selected.elem.classList.remove("chosen-one");
  evt.currentTarget.classList.add("chosen-one");
  game.user.selected.elem = evt.currentTarget;
  game.user.selected.type = type;
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
  game.user.selected.elem.classList.remove("chosen-one");
  document
    .getElementById(`computer${computerChoice}weaponbox`)
    .classList.remove("chosen-one");

  // Update the value for the weapon you used on the user side
  const userChoiceCount = document.getElementById(
    `user${game.user.selected.type}`
  );
  userChoiceCount.innerHTML = getFormattedAmtForPlayer(
    "user",
    game.user.selected.type
  );

  // Update the value for the weapon you used on the computer side
  const computerUserChoiceCount = document.getElementById(
    `computer${game.user.selected.type}`
  );
  computerUserChoiceCount.innerHTML = getFormattedAmtForPlayer(
    "computer",
    game.user.selected.type
  );

  // Update the value for the computer's choice on user side
  const userComputerChoiceCount = document.getElementById(
    `user${computerChoice}`
  );
  userComputerChoiceCount.innerHTML = getFormattedAmtForPlayer(
    "user",
    computerChoice
  );

  // Update the value for the weapon the computer used on the computer side
  const computerChoiceCount = document.getElementById(
    `computer${computerChoice}`
  );
  computerChoiceCount.innerHTML = getFormattedAmtForPlayer(
    "computer",
    computerChoice
  );

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

function onKeyPress(evt) {
  if (evt.code === "Enter") {
    // Next round would be a pain...
    const battleButton = document.getElementById("battle");
    if (battleButton.disabled) return;
    else if (battleButton.innerHTML == "BATTLE!") {
      battle();
      return;
    }
  }
}

document.addEventListener("DOMContentLoaded", onPageLoad);
document.addEventListener("keydown", onKeyPress);
