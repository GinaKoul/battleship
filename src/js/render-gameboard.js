export const RenderGameboard = function (player, opponent) {
  const name = player.getName();
  const gameboard = player.getGameboard();
  const opponentGameboard = opponent.getGameboard();
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  const addBoats = () => {
    gameboard.getPrimaryGrid().forEach((value, key) => {
      document.getElementById(key).classList.add("occupied");
    });
  };

  const handleAttack = (event) => {
    opponentGameboard.receiveAttack(event.target.getAttribute("id"));
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
          gridBox.addEventListener("click", handleAttack);
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
    mainContent.appendChild(renderGrid("primary"));
    mainContent.appendChild(renderGrid("secondary"));

    gameboard.placeShip("carrier", ["A1", "A2", "A3", "A4", "A5"]);
    gameboard.placeShip("battleship", ["B1", "B2", "B3", "B4"]);
    gameboard.placeShip("destroyer", ["C1", "C2", "C3"]);
    gameboard.placeShip("submarine", ["D1", "D2", "D3"]);
    gameboard.placeShip("patrolBoat", ["E1", "E2"]);

    addBoats();
  };

  init();
};
