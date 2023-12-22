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
    askName();
  }

  const handleMenuClick = (event) => {
    switch (event.target.dataset?.val) {
      case "1":
        updateLevel(1);
        gameLoop();
        break;
      case "2":
        console.log("Will Show Leaderboard Now...");
        break;
      case "3":
        name = prompt("Enter name to be updated:") || "Guest";
        displayMenu();
    }
  };

  function askName() {
    container.innerHTML = `
    <section>
      <h2>Please enter your name</h2>
      <form onsubmit="event.preventDefault(); handleNameSubmit()">
        <input name="name" class="name-input" />
        <button type="submit">OK</button>
      </form>
    </section>
    `;
  }

  // eslint-disable-next-line no-unused-vars
  function handleNameSubmit() {
    console.log("c");
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
    for (let i = 0; i < level; i++) {
      alert(generatedNumbers[i]);
    }
  }

  function getNumbersFromUser() {
    for (let i = 0; i < level; i++) {
      let enteredValue = prompt(
        "Enter values in order one at a time: (press enter after every value)"
      );
      if (enteredValue === "" || enteredValue === null) {
        enteredValue = NaN;
      }
      enteredNumbers.push(Number(enteredValue));
    }
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
    getNumbersFromUser();
    if (verifyLevel()) {
      updateLevel(level + 1);
      gameLoop();
    } else {
      alert(`Your score is: ${level}`);
    }
  }
}

startGame(myGameContainer);
