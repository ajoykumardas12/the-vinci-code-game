import "./styles.css";
const myGameContainer = document.getElementById("game");

function startGame(container) {
  let name;
  let generatedNumbers = [];
  let enteredNumbers = [];
  let level = 1;

  start();

  function randomNumber() {
    return Math.floor(Math.random() * 10);
  }

  function start() {
    loadNameFromLocalStorage();
  }

  function loadNameFromLocalStorage() {
    const currentPlayer = localStorage.getItem("currentPlayer");
    if (!currentPlayer) {
      askName();
    } else {
      name = currentPlayer;
      displayMenu();
    }
  }

  function askName() {
    container.innerHTML = `
    <section>
      <h2>Please enter your name</h2>
      <form id="welcome-name-form">
        <input name="name" id="welcome-name" class="name-input" />
        <button type="submit">OK</button>
      </form>
    </section>
    `;
    const welcomeNameInput = document.querySelector("#welcome-name");
    welcomeNameInput && welcomeNameInput.focus();

    const enterNameForm = document.querySelector("#welcome-name-form");
    if (enterNameForm)
      enterNameForm.addEventListener("submit", handleNameSubmit);
  }

  function handleNameSubmit(event) {
    event.preventDefault();
    const newName = container.getElementsByTagName("input")[0].value;
    name = newName;
    addNameToLocalStorage(name);
    displayMenu();
  }

  function addNameToLocalStorage(name) {
    localStorage.setItem("currentPlayer", name);
    const players = JSON.parse(localStorage.getItem("players"));
    if (players && !players.includes(name)) {
      localStorage.setItem("players", JSON.stringify([...players, name]));
    } else {
      localStorage.setItem("players", JSON.stringify([name]));
    }
  }

  function displayMenu() {
    container.innerHTML = `Welcome ${name},
    <ol>
      <li data-val="1">Start New Game</li>
      <li data-val="2">See Leaderboard</li>
      <li data-val="3">Update Name</li>
    </ol>`;
    container.removeEventListener("click", handleMenuClick);
    container.addEventListener("click", handleMenuClick);
  }

  function updateName() {
    container.innerHTML = `
      <section>
        <h2>Please enter new name to update</h2>
        <form id="update-name-form">
          <input name="name" id="update-name" class="name-input" />
          <button type="submit">OK</button>
        </form>
      </section>
      `;
    const updateNameInput = document.querySelector("#update-name");
    updateNameInput && updateNameInput.focus();

    const updateNameForm = document.querySelector("#update-name-form");
    if (updateNameForm)
      updateNameForm.addEventListener("submit", handleUpdateNameSubmit);
  }

  function replaceNameInLocalStorage(oldName, updatedName) {
    console.log(oldName, updatedName);
    localStorage.setItem("currentPlayer", updatedName);
    const players = JSON.parse(localStorage.getItem("players"));
    if (players) {
      const index = players.indexOf(oldName);
      console.log(`found player ${oldName} at idx ${index}`);
      players[index] = updatedName;
      const newPlayers = [...players];
      console.log(newPlayers, players);
      localStorage.setItem("players", JSON.stringify(players));
    } else {
      localStorage.setItem("players", JSON.stringify([updatedName]));
    }

    // TODO: update leaderboard
  }

  function handleUpdateNameSubmit() {
    event.preventDefault();
    const updatedName = container.getElementsByTagName("input")[0].value;
    const oldName = name;
    name = updatedName;
    replaceNameInLocalStorage(oldName, updatedName);
    displayMenu();
  }

  function handleMenuClick(event) {
    switch (event.target.dataset?.val) {
      case "1":
        updateLevel(1);
        gameLoop();
        break;
      case "2":
        console.log("Will Show Leaderboard Now...");
        break;
      case "3":
        updateName();
    }
  }

  function updateLevel(newLevel = 1) {
    generatedNumbers = [];
    enteredNumbers = [];
    level = newLevel;
  }

  function generateNumbersForLevel() {
    for (let i = 0; i < level; i++) {
      generatedNumbers.push(randomNumber());
    }
  }

  function displayNumbersForLevel() {
    console.log(generatedNumbers);

    const numbersScreen = document.createElement("div");
    numbersScreen.innerHTML = `<div>Level ${level}</div>`;
    const currentNumberContainer = document.createElement("div");
    numbersScreen.appendChild(currentNumberContainer);

    container.innerHTML = "";
    container.appendChild(numbersScreen);

    function updateCurrentNumber(number) {
      currentNumberContainer.innerText = number;
    }

    let index = 0;
    updateCurrentNumber(generatedNumbers[0]);
    index++;

    const loop = setInterval(() => {
      if (index >= generatedNumbers.length) {
        clearInterval(loop);
        setTimeout(() => {
          getNumbersFromUser();
        }, 1000);
      } else {
        level !== 1 && updateCurrentNumber(generatedNumbers[index++]);
      }
    }, 1000);
  }

  function getNumbersFromUser() {
    let index = 0;

    const getNumbersScreen = document.createElement("div");
    getNumbersScreen.innerHTML = `<div>Level ${level}</div>`;

    const form = document.createElement("form");
    // const numberInputsContainer = document.createElement("div");

    const input = document.createElement("input");
    input.type = "number";
    const button = document.createElement("button");
    button.textContent = "OK";
    button.type = "submit";
    form.append(input, button);
    form.addEventListener("submit", handleNumberSubmit);

    getNumbersScreen.append(form);
    container.innerHTML = ``;
    container.append(getNumbersScreen);
    input.focus();

    function handleNumberSubmit(event) {
      event.preventDefault();
      let enteredNumber = container.getElementsByTagName("input")[0].value;
      if (enteredNumber === "" || enteredNumber === null) {
        enteredNumber = NaN;
      }
      enteredNumbers.push(Number(enteredNumber));
      input.value = "";

      if (index === level - 1) {
        if (verifyLevel()) {
          updateLevel(level + 1);
          gameLoop();
        } else {
          showResult();
        }
      }
      index++;
    }
  }

  function storeResult(playerName, score) {
    let storedResults = JSON.parse(localStorage.getItem("results"));

    if (storedResults) {
      if (storedResults[score]) {
        storedResults[score] = [...storedResults[score], playerName];
      } else {
        storedResults[score] = [playerName];
      }
    } else {
      storedResults = { [score]: playerName };
    }

    localStorage.setItem("results", JSON.stringify(storedResults));
  }

  function showResult() {
    const score = level - 1;
    const resultScreen = document.createElement("div");
    const result = document.createElement("p");
    result.textContent = `Your score is: ${score}`;

    const showLeaderBoardButton = document.createElement("button");
    showLeaderBoardButton.innerHTML = `<a href="/leaderboard">Leaderboard</a>`;

    const playAgainButton = document.createElement("button");
    playAgainButton.textContent = "Play Again";
    playAgainButton.addEventListener("click", () => {
      updateLevel(1);
      gameLoop();
    });

    const backToMenuButton = document.createElement("button");
    backToMenuButton.textContent = "Back to Menu";
    backToMenuButton.addEventListener("click", displayMenu);

    resultScreen.append(
      result,
      showLeaderBoardButton,
      playAgainButton,
      backToMenuButton
    );

    storeResult(name, score);

    container.innerHTML = ``;
    container.append(resultScreen);
  }

  function verifyLevel() {
    for (let i = 0; i < level; i++) {
      if (enteredNumbers[i] !== generatedNumbers[i]) return false;
    }
    return true;
  }

  function gameLoop() {
    generateNumbersForLevel();
    displayNumbersForLevel();
  }
}

startGame(myGameContainer);
