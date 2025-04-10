import { PubSub } from "./pubsub";

export const RenderGameboard = (function () {
  let name;
  let playerGameboard;
  let opponentGameboard;
  let columns;

  const addShips = () => {
    playerGameboard.getPrimaryGrid().forEach((value, key) => {
      document.getElementById(key).classList.add("occupied");
    });
  };

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

  const updateSecondaryGrid = (targetEl, targetId) => {
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

  const render = (player, opponent) => {
    name = player.getName();
    playerGameboard = player.getGameboard();
    opponentGameboard = opponent.getGameboard();
    columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

    const mainContent = document.querySelector("#content");
    mainContent.textContent = "";

    const top = document.createElement("div");
    top.classList.add("top-section");
    const restartButton = document.createElement("button");
    restartButton.textContent = "New game";
    top.appendChild(restartButton);

    const gameboards = document.createElement("div");
    gameboards.classList.add("boards");

    PubSub.on("UpdateBoard", updatePrimaryGrid);

    gameboards.append(renderGrid("primary"), renderGrid("secondary"));
    mainContent.append(top, gameboards);

    updatePrimaryGrid();
    updateSecondaryGrid();
    // addShips();
  };

  return {
    render,
  };
})();
