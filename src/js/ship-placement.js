import { PubSub } from "./pubsub";
import { Game as UserBoard } from "./render-gameboard.js";

export const shipPlacement = (function () {
  let name;
  let playerGameboard;
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  let occupiedPositions = new Map();
  let playersTotal;
  let playerNum = 0;

  const placeShips = () => {
    let carrierPositions = [];
    let battleshipPositions = [];
    let destroyerPositions = [];
    let submarinePositions = [];
    let patrolBoatPositions = [];

    occupiedPositions.forEach((value, key) => {
      switch (value) {
        case "carrier": {
          carrierPositions.push(key);
          break;
        }
        case "battleship": {
          battleshipPositions.push(key);
          break;
        }
        case "destroyer": {
          destroyerPositions.push(key);
          break;
        }
        case "submarine": {
          submarinePositions.push(key);
          break;
        }
        case "patrolBoat": {
          patrolBoatPositions.push(key);
          break;
        }
      }
    });

    playerGameboard.placeShip("carrier", carrierPositions);
    playerGameboard.placeShip("battleship", battleshipPositions);
    playerGameboard.placeShip("destroyer", destroyerPositions);
    playerGameboard.placeShip("submarine", submarinePositions);
    playerGameboard.placeShip("patrolBoat", patrolBoatPositions);

    if (playerNum < 2 && playersTotal === "2") {
      PubSub.trigger("ShipPlacement");
    } else {
      playerNum = 0;
      PubSub.trigger("Play");
    }
  };

  const moveShip = (ship, startPosition) => {
    let clone = ship.cloneNode(true);
    clone.style.position = "absolute";

    if (clone.firstChild?.childElementCount <= 0) {
      const rotateButton = document.createElement("span");
      rotateButton.classList.add("rotate");
      rotateButton.addEventListener("click", rotateShip);
      clone.firstChild.appendChild(rotateButton);
    } else {
      clone.querySelector(".rotate").addEventListener("click", rotateShip);
    }

    clone.addEventListener("dragend", dropShip);
    document.querySelector(`[data-id="${startPosition}"]`).appendChild(clone);
    ship.remove();
  };

  const updatePositions = (ship, prevPositions, shipPositions) => {
    const shipId = ship.getAttribute("data-id");
    prevPositions.forEach((pos) => {
      occupiedPositions.delete(pos);
    });
    shipPositions.forEach((pos) => {
      occupiedPositions.set(pos, shipId);
    });
  };

  const getStartHorizontal = (ship, startPosition) => {
    let prevPositions = [];
    let shipPositions = [];
    const column = startPosition.charAt(0);
    let columnStart = columns.findIndex((col) => col === column);
    let rowStart = startPosition.substring(1);
    const shipLength = ship.childElementCount;

    for (
      let index = 0, currentCol = columnStart, currentRow = rowStart;
      index < shipLength;
      index++, currentCol++, currentRow++
    ) {
      let currentPosition;
      if (currentCol >= 10) {
        columnStart -= 1;
        prevPositions.push(startPosition.charAt(0) + rowStart--);
        currentPosition = columns[columnStart] + startPosition.substring(1);
      } else {
        prevPositions.push(startPosition.charAt(0) + currentRow);
        currentPosition = columns[currentCol] + startPosition.substring(1);
      }
      if (occupiedPositions.get(currentPosition) && index !== 0) {
        return;
      } else {
        shipPositions.push(currentPosition);
      }
    }
    updatePositions(ship, prevPositions, shipPositions);
    return columns[columnStart] + startPosition.substring(1);
  };

  const getStartVertical = (ship, startPosition) => {
    let prevPositions = [];
    let shipPositions = [];
    const column = startPosition.charAt(0);
    let columnStart = columns.findIndex((col) => col === column);
    let rowStart = startPosition.substring(1);
    const shipLength = ship.childElementCount;

    for (
      let index = 0, currentCol = columnStart, currentRow = rowStart;
      index < shipLength;
      index++, currentCol++, currentRow++
    ) {
      let currentPosition;
      if (currentRow > 10) {
        rowStart -= 1;
        prevPositions.push(columns[columnStart--] + startPosition.substring(1));
        currentPosition = startPosition.charAt(0) + rowStart;
      } else {
        prevPositions.push(columns[currentCol] + startPosition.substring(1));
        currentPosition = startPosition.charAt(0) + currentRow;
      }
      if (occupiedPositions.get(currentPosition) && index !== 0) {
        console.log("hi");
        return;
      } else {
        shipPositions.push(currentPosition);
      }
    }
    updatePositions(ship, prevPositions, shipPositions);
    return startPosition.charAt(0) + rowStart;
  };

  const rotateShip = (event) => {
    const position = event.target.closest(".grid-box");
    const ship = position?.querySelector(".ship");
    let startPosition = position?.getAttribute("data-id");

    if (startPosition) {
      const direction = ship.getAttribute("data-direction");

      if (direction === "vertical") {
        startPosition = getStartHorizontal(ship, startPosition);
        if (startPosition) {
          ship.setAttribute("data-direction", "horizontal");
        }
      } else if (direction === "horizontal") {
        startPosition = getStartVertical(ship, startPosition);
        if (startPosition) {
          ship.setAttribute("data-direction", "vertical");
        }
      }
      if (startPosition) moveShip(ship, startPosition);
    }
  };

  const dropShip = (event) => {
    const ship = event.target;
    let position = document.elementsFromPoint(event.clientX, event.clientY);
    let startPosition = position[0].getAttribute("data-id");

    if (startPosition) {
      const direction = ship.getAttribute("data-direction");

      if (direction === "horizontal") {
        startPosition = getStartHorizontal(ship, startPosition);
      } else if (direction === "vertical") {
        startPosition = getStartVertical(ship, startPosition);
      }

      if (startPosition) {
        if (document.querySelector(".ships").childElementCount <= 1) {
          document
            .querySelector(".top-section button")
            .classList.remove("disabled");
        }
        moveShip(ship, startPosition);
      }
    }
  };

  const renderBoard = () => {
    const mainContent = document.querySelector("#content");
    mainContent.textContent = "";

    const top = document.createElement("div");
    top.classList.add("top-section");
    const playerTurn = document.createElement("h2");
    const nextButton = document.createElement("button");
    nextButton.classList.add("disabled");
    playerTurn.textContent = `${name} time to place your ships!`;
    nextButton.textContent = "Next";
    nextButton.addEventListener("click", placeShips);

    top.append(playerTurn, nextButton);

    const gameboards = document.createElement("div");
    gameboards.classList.add("boards", "ship-placement");

    gameboards.append(UserBoard.renderGrid("primary"));
    mainContent.append(top, gameboards);

    const ships = document.querySelectorAll(".ship");
    ships.forEach((ship) => {
      ship.setAttribute("data-direction", "horizontal");
      ship.addEventListener("dragend", dropShip);
    });
  };

  const passDevice = () => {
    const mainContent = document.querySelector("#content");
    mainContent.textContent = "";

    const top = document.createElement("div");
    top.classList.add("top-section");
    const playerTurn = document.createElement("h2");
    const nextButton = document.createElement("button");
    playerTurn.textContent = `It is ${name}'s turn!`;
    nextButton.textContent = "Place Ships";
    nextButton.addEventListener("click", renderBoard);
    top.append(playerTurn, nextButton);

    mainContent.appendChild(top);
  };

  const render = (player, playersNum) => {
    playersTotal = playersNum;
    playerNum++;
    name = player.getName();
    playerGameboard = player.getGameboard();
    occupiedPositions = new Map();

    playersNum === "2" ? passDevice() : renderBoard();
  };

  return {
    render,
  };
})();
