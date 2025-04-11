import { PubSub } from "./pubsub.js";
import "../css/style.css";
import { Player } from "./player.js";
import { RenderGameboard } from "./render-gameboard.js";
import { OpponentGame } from "./computer-game.js";

const player1 = Player("gina");
const player2 = Player("computer");

let currentPlayer = player1;

const gameboard1 = player1.getGameboard();
gameboard1.placeShip("carrier", ["A1", "A2", "A3", "A4", "A5"]);
gameboard1.placeShip("battleship", ["B1", "B2", "B3", "B4"]);
gameboard1.placeShip("destroyer", ["C1", "C2", "C3"]);
gameboard1.placeShip("submarine", ["D1", "D2", "D3"]);
gameboard1.placeShip("patrolBoat", ["E1", "E2"]);

const gameboard2 = player2.getGameboard();
gameboard2.placeShip("carrier", ["A1", "A2", "A3", "A4", "A5"]);
gameboard2.placeShip("battleship", ["B1", "B2", "B3", "B4"]);
gameboard2.placeShip("destroyer", ["C1", "C2", "C3"]);
gameboard2.placeShip("submarine", ["D1", "D2", "D3"]);
gameboard2.placeShip("patrolBoat", ["E1", "E2"]);

const computer = OpponentGame(player2, player1);

RenderGameboard(player1, player2);

const endGame = () => {
  const message = `End of game! ${currentPlayer.getName()} is the winner`;
  document.querySelector(".top-section").prepend(message);
};

const switchTurns = () => {
  if (currentPlayer === player1) {
    currentPlayer = player2;
    computer.attack();
  } else if (currentPlayer === player2) {
    currentPlayer = player1;
    PubSub.trigger("UpdateBoard");
  }
};

PubSub.on("EndGame", endGame);
PubSub.on("SwitchTurns", switchTurns);
