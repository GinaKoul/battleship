import { PubSub } from "./pubsub";

export const RenderGameboard = function (player, opponent) {
  const name = player.getName();
  const playerGameboard = player.getGameboard();
  const opponentGameboard = opponent.getGameboard();
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  const addBoats = () => {
    playerGameboard.getPrimaryGrid().forEach((value, key) => {
      document.getElementById(key).classList.add("occupied");
    });
  };

  const updatePrimaryGrid = () => {
    playerGameboard.getPrimaryGrid().forEach((value, key) => {
      if (value["hit"]) {
        document.getElementById(key).classList.add("hit");
      } else if (value["ship"]) {
        document.getElementById(key).classList.add("occupied");
      } else {
        document.getElementById(key).classList.add("miss");
      }
    });
  };

  const updateSecondaryGrid = (targetEl, targetId) => {
    const targetBox = opponentGameboard.getPrimaryGrid().get(targetId);
    targetBox["shipType"]
      ? targetEl.classList.add("hit")
      : targetEl.classList.add("miss");
  };

  const handleAttack = (event) => {
    const targetEl = event.target;
    const targetId = targetEl.getAttribute("id");
    opponentGameboard.receiveAttack(targetId);
    updateSecondaryGrid(targetEl, targetId);
    if (opponentGameboard.allBoatsSunk()) {
      PubSub.trigger("EndGame");
    } else {
      PubSub.trigger("SwitchTurns");
    }
  };

  const renderGrid = (gridName) => {
    const grid = document.createElement("div");
    grid.setAttribute("id", gridName);
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
        gridBox.setAttribute("id", `${col}${index}`);
        gridBox.classList.add("grid-box");
        if (gridName === "secondary") {
          gridBox.addEventListener("click", handleAttack, { once: true });
        }
        grid.appendChild(gridBox);
      });
    }

    const gridOuter = document.createElement("div");
    gridOuter.classList.add("grid-outer");
    gridOuter.append(columnHeaders, rowHeaders, grid);
    return gridOuter;
  };

  const init = () => {
    const mainContent = document.querySelector("#content");

    PubSub.on("UpdateBoard", updatePrimaryGrid);

    mainContent.textContent = "";
    mainContent.appendChild(renderGrid("primary"));
    mainContent.appendChild(renderGrid("secondary"));

    addBoats();
  };

  init();
};
