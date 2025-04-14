export const shipPlacement = function () {
  let name;
  let playerGameboard;
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  const render = (player) => {
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
    gameboards.classList.add("boards");

    gameboards.append(renderGrid("primary"));
    mainContent.append(top, gameboards);
  };
};
