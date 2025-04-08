export const RenderGameboard = function (player) {
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  const renderGrid = (gridName) => {
    const gridOuter = document.createElement("div");
    gridOuter.setAttribute("id", gridName);
    gridOuter.classList.add("grid");

    const columnHeaders = document.createElement("div");
    columnHeaders.classList.add("column-titles");

    const rowHeaders = document.createElement("div");
    rowHeaders.classList.add("column-titles");

    columns.forEach((col, index) => {
      let gridCol = document.createElement("div");
      gridCol.classList.add("grid-col");

      const columnHeader = document.createElement("div");
      columnHeader.textContent = col;
      columnHeader.classList.add("grid-header");
      columnHeaders.appendChild(columnHeader);

      const rowHeader = document.createElement("div");
      rowHeader.textContent = index + 1;
      rowHeader.classList.add("grid-header");
      rowHeaders.appendChild(rowHeader);

      for (let index = 1; index <= 10; index++) {
        let gridBox = document.createElement("div");
        gridBox.setAttribute("id", `${col}${index}`);
        gridBox.classList.add("grid-box");
        gridCol.appendChild(gridBox);
      }
      gridOuter.appendChild(gridCol);
    });
    gridOuter.append(columnHeaders, rowHeaders);
    return gridOuter;
  };

  const init = () => {
    const mainContent = document.querySelector("#content");
    mainContent.appendChild(renderGrid("primary"));
    mainContent.appendChild(renderGrid("secondary"));
  };

  init();
};
