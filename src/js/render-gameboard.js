import { PubSub } from "./pubsub";

export const Game = (function () {
  let name;
  let playerGameboard;
  let opponentGameboard;
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  const shipState = (grid, target) => {
    if (target["ship"].isSunk()) {
      document
        .querySelector(`#${grid} [data-id=${target["shipType"]}]`)
        .classList.add("hit");
    }
  };

  const updatePrimaryGrid = () => {
    const primaryGrid = document.querySelector("#primary");
    playerGameboard.getPrimaryGrid().forEach((value, key) => {
      if (value["hit"]) {
        primaryGrid.querySelector(`[data-id=${key}]`).classList.add("hit");
        shipState("primary", value);
      } else if (value["ship"]) {
        primaryGrid.querySelector(`[data-id=${key}]`).classList.add("occupied");
      } else {
        primaryGrid.querySelector(`[data-id=${key}]`).classList.add("miss");
      }
    });
  };

  const updateSecondaryGrid = () => {
    const secondaryGrid = document.querySelector("#secondary");
    opponentGameboard.getPrimaryGrid().forEach((value, key) => {
      if (!value["hit"] && !value.hasOwnProperty("shipType")) {
        secondaryGrid.querySelector(`[data-id=${key}]`).classList.add("miss");
      } else if (value["hit"]) {
        secondaryGrid.querySelector(`[data-id=${key}]`).classList.add("hit");
        shipState("secondary", value);
      }
    });
  };

  const handleAttack = (event) => {
    const targetEl = event.target;
    const targetId = targetEl.getAttribute("data-id");
    opponentGameboard.receiveAttack(targetId);
    updateSecondaryGrid(targetEl, targetId);
    if (opponentGameboard.allShipsSunk()) {
      PubSub.trigger("EndGame");
    } else {
      PubSub.trigger("SwitchTurns");
    }
  };

  const createShip = (shipName, size) => {
    const ship = document.createElement("div");
    ship.setAttribute("data-id", shipName);
    ship.classList.add("ship");
    ship.setAttribute("draggable", true);
    for (let index = 0; index < size; index++) {
      const shipBox = document.createElement("div");
      shipBox.classList.add("ship-box");
      ship.appendChild(shipBox);
    }
    return ship;
  };

  const createShips = () => {
    const shipsOuter = document.createElement("div");
    shipsOuter.classList.add("ships");
    shipsOuter.append(
      createShip("carrier", 5),
      createShip("battleship", 4),
      createShip("destroyer", 3),
      createShip("submarine", 3),
      createShip("patrolBoat", 2)
    );
    return shipsOuter;
  };

  const renderGrid = (gridName) => {
    const grid = document.createElement("div");
    grid.classList.add("grid");

    const columnHeaders = document.createElement("div");
    columnHeaders.classList.add("column-titles");

    const rowHeaders = document.createElement("div");
    rowHeaders.classList.add("row-titles");

    for (let index = 1; index <= 10; index++) {
      const columnHeader = document.createElement("div");
      columnHeader.textContent = columns[index - 1];
      columnHeader.classList.add("grid-header");
      columnHeaders.appendChild(columnHeader);

      const rowHeader = document.createElement("div");
      rowHeader.textContent = index;
      rowHeader.classList.add("grid-header");
      rowHeaders.appendChild(rowHeader);

      columns.forEach((col) => {
        let gridBox = document.createElement("div");
        gridBox.setAttribute("data-id", `${col}${index}`);
        gridBox.classList.add("grid-box");
        if (gridName === "secondary") {
          gridBox.addEventListener("click", handleAttack, { once: true });
        }
        grid.appendChild(gridBox);
      });
    }

    const gridOuter = document.createElement("div");
    gridOuter.setAttribute("id", gridName);
    gridOuter.classList.add("grid-outer");
    gridOuter.append(columnHeaders, rowHeaders, grid, createShips(gridName));
    return gridOuter;
  };

  const renderBoards = () => {
    const mainContent = document.querySelector("#content");
    mainContent.textContent = "";

    const top = document.createElement("div");
    top.classList.add("top-section");
    const playerTurn = document.createElement("h2");
    const restartButton = document.createElement("button");
    playerTurn.textContent = `${name} it is your turn!`;
    restartButton.textContent = "New game";
    restartButton.addEventListener("click", () => {
      PubSub.trigger("RestartGame");
    });
    top.append(playerTurn, restartButton);

    const gameboards = document.createElement("div");
    gameboards.classList.add("boards");

    gameboards.append(renderGrid("primary"), renderGrid("secondary"));
    mainContent.append(top, gameboards);

    updatePrimaryGrid();
    updateSecondaryGrid();
  };

  const passDevice = () => {
    const mainContent = document.querySelector("#content");
    mainContent.textContent = "";

    const top = document.createElement("div");
    top.classList.add("top-section");
    const playerTurn = document.createElement("h2");
    const restartButton = document.createElement("button");
    playerTurn.textContent = `It is ${name}'s turn!`;
    restartButton.textContent = "Play";
    restartButton.addEventListener("click", renderBoards);
    top.append(playerTurn, restartButton);

    mainContent.appendChild(top);
  };

  const dropShip = (event) => {
    const ship = event.target;
    let clone = ship.cloneNode(true);
    clone.style.position = "absolute";
    let position = document.elementsFromPoint(event.clientX, event.clientY);
    let startPosition = position[0].getAttribute("data-id");
    console.log(startPosition);

    if (startPosition) {
      const direction = ship.getAttribute("data-direction");
      const shipLength = ship.childElementCount;

      if (direction === "horizontal") {
        const column = startPosition.charAt(0);
        let startingPoint = columns.findIndex((col) => col === column);
        for (
          let index = 0, currentPoint = startingPoint;
          index < shipLength;
          index++, currentPoint++
        ) {
          let currentCol = columns[currentPoint];
          if (!currentCol) {
            startingPoint -= 1;
          }
        }
        startPosition = columns[startingPoint] + startPosition.substring(1);
      }
      clone.addEventListener("dragend", dropShip);
      document.querySelector(`[data-id="${startPosition}"]`).appendChild(clone);
      ship.remove();
    }
  };

  const placeShips = (player) => {
    name = player.getName();
    playerGameboard = player.getGameboard();

    const mainContent = document.querySelector("#content");
    mainContent.textContent = "";

    const top = document.createElement("div");
    top.classList.add("top-section");
    const playerTurn = document.createElement("h2");
    const nextButton = document.createElement("button");
    playerTurn.textContent = `${name} time to place your ships!`;
    nextButton.textContent = "New game";

    top.append(playerTurn, nextButton);

    const gameboards = document.createElement("div");
    gameboards.classList.add("boards", "ship-placement");

    gameboards.append(renderGrid("primary"));
    mainContent.append(top, gameboards);

    const ships = document.querySelectorAll(".ship");
    ships.forEach((ship) => {
      ship.setAttribute("data-direction", "horizontal");
      ship.addEventListener("dragend", dropShip);
    });
  };

  const render = (player, opponent, playersNum) => {
    name = player.getName();
    playerGameboard = player.getGameboard();
    opponentGameboard = opponent.getGameboard();

    playersNum === "2" ? passDevice() : renderBoards();
  };

  return {
    render,
    placeShips,
  };
})();
