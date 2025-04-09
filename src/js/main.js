import "../css/style.css";
import { Player } from "./player.js";
import { RenderGameboard } from "./render-gameboard.js";

const player1 = Player("gina");
const player2 = Player("demi");

RenderGameboard(player1, player2);
