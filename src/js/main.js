import "../css/style.css";
import { PubSub } from "./pubsub.js";
import { Storage } from "./storage.js";
import { startGame } from "./pages/start.js";
import { InitializePlayers } from "./pages/players-init.js";
import { Player } from "./player.js";
import { Game as UserBoard } from "./pages/render-gameboard.js";
import { shipPlacement } from "./pages/ship-placement.js";
import { OpponentGame } from "./computer-game.js";

let playersNum;
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

const placeShips = () => {
  if (currentPlayer === player2 && playersNum === "1") {
    automatedGame.placeShips();
  } else {
    shipPlacement.render(currentPlayer, playersNum);
  }
  switchTurns();
};

const playerInitFinished = () => {
  playersNum = JSON.parse(Storage.getPlayersNumber());
  player1 = Player(JSON.parse(Storage.getFirstPlayerName()));
  player2 = Player(
    playersNum === "2" ? JSON.parse(Storage.getSecondPlayerName()) : "Computer"
  );
  currentPlayer = player1;
  automatedGame = OpponentGame(player2, player1);
  PubSub.trigger("ShipPlacement");
};

const InitPlayers = () => {
  InitializePlayers.render();
};

const gameStart = () => {
  Storage.clear();
  startGame.render();
};

PubSub.on("InitPlayers", InitPlayers);
PubSub.on("PlayerInitFinished", playerInitFinished);
PubSub.on("ShipPlacement", placeShips);
PubSub.on("Play", play);
PubSub.on("EndGame", endGame);
PubSub.on("SwitchTurns", switchTurns);
PubSub.on("RestartGame", gameStart);

gameStart();
