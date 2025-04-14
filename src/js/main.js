import "../css/style.css";
import { PubSub } from "./pubsub.js";
import { Storage } from "./storage.js";
import { startGame } from "./start.js";
import { InitializePlayers } from "./players-init.js";
import { Player } from "./player.js";
import { Game as UserBoard } from "./render-gameboard.js";
import { OpponentGame } from "./computer-game.js";

let playersNum = JSON.parse(Storage.getPlayersNumber());
let player1;
let player2;
let currentPlayer;
let automatedGame;

const endGame = () => {
  document.querySelector(
    ".top-section h2"
  ).textContent = `End of game! ${currentPlayer.getName()} is the winner`;
  document.querySelector(".boards").style.pointerEvents = "none";
};

const switchTurns = () => {
  currentPlayer = currentPlayer === player1 ? player2 : player1;
  console.log("switch");
  console.log(currentPlayer);
  play();
  // if (currentPlayer === player1) {
  //   currentPlayer = player2;
  //   if (playersNum === "2") {
  //     UserBoard.render(player2, player1, playersNum);
  //   } else {
  //     automatedGame.attack();
  //   }
  // } else if (currentPlayer === player2) {
  //   currentPlayer = player1;
  //   UserBoard.render(player1, player2, playersNum);
  // }
};

const play = () => {
  if (currentPlayer === player1) {
    UserBoard.render(player1, player2, playersNum);
  } else if (currentPlayer === player2) {
    if (playersNum === "2") {
      UserBoard.render(player2, player1, playersNum);
    } else {
      automatedGame.attack();
    }
  }
};

const userPlaceShips = () => {
  UserBoard.placeShips(currentPlayer);
  // const gameboard1 = player1.getGameboard();
  // gameboard1.placeShip("carrier", ["A1", "A2", "A3", "A4", "A5"]);
  // gameboard1.placeShip("battleship", ["B1", "B2", "B3", "B4"]);
  // gameboard1.placeShip("destroyer", ["C1", "C2", "C3"]);
  // gameboard1.placeShip("submarine", ["D1", "D2", "D3"]);
  // gameboard1.placeShip("patrolBoat", ["E1", "E2"]);

  // const gameboard2 = player2.getGameboard();
  // gameboard2.placeShip("carrier", ["A1", "A2", "A3", "A4", "A5"]);
  // gameboard2.placeShip("battleship", ["B1", "B2", "B3", "B4"]);
  // gameboard2.placeShip("destroyer", ["C1", "C2", "C3"]);
  // gameboard2.placeShip("submarine", ["D1", "D2", "D3"]);
  // gameboard2.placeShip("patrolBoat", ["E1", "E2"]);

  // play();
};

const playerInitFinished = () => {
  player1 = Player(JSON.parse(Storage.getFirstPlayerName()));
  player2 = Player(
    playersNum === "2" ? JSON.parse(Storage.getSecondPlayerName()) : "Computer"
  );
  currentPlayer = player1;
  automatedGame = OpponentGame(player1);
  userPlaceShips();
};

const InitPlayers = () => {
  InitializePlayers.render();
};

const gameStart = () => {
  startGame.render();
};

PubSub.on("InitPlayers", InitPlayers);
PubSub.on("PlayerInitFinished", playerInitFinished);
PubSub.on("EndGame", endGame);
PubSub.on("SwitchTurns", switchTurns);
PubSub.on("RestartGame", gameStart);

gameStart();
