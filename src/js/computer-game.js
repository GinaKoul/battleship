import { PubSub } from "./pubsub";

export const OpponentGame = function (player, opponent) {
  let playerGameboard = player.getGameboard();
  let opponentGameboard = opponent.getGameboard();
  const chars = "ABCDEFGHIJ";
  const ships = new Map();
  ships.set("carrier", 5);
  ships.set("battleship", 4);
  ships.set("destroyer", 3);
  ships.set("submarine", 3);
  ships.set("patrolBoat", 2);

  const placeShips = () => {
    ships.forEach((value, key) => {
      const dir = Math.round(Math.random());
      let startPoint;
      let max;
      let stablePoint;
      if (dir === 0) {
        startPoint = Math.floor(Math.random() * 9);
        stablePoint = Math.floor(Math.random() * (10 - 1) + 1);
        max = 9;
      } else {
        startPoint = Math.floor(Math.random() * (10 - 1) + 1);
        stablePoint = Math.floor(Math.random() * 9);
        max = 10;
      }
      let points = [];
      for (
        let index = 0, currentPoint = startPoint;
        index < value;
        index++, currentPoint++
      ) {
        let cur = currentPoint <= max ? currentPoint : startPoint--;
        if (dir === 0) {
          points.push(chars.charAt(cur) + stablePoint);
        } else {
          points.push(chars.charAt(stablePoint) + cur);
        }
      }
      if (playerGameboard.placeShip(key, points)) {
        if (ships.size <= 0) PubSub.trigger("Play");
      } else {
        console.log(ships);
        placeShips();
      }
    });
  };

  const attack = () => {
    const randomTarget =
      chars.charAt(Math.floor(Math.random() * 9)) +
      Math.floor(Math.random() * (10 - 1) + 1);
    const validAttack = opponentGameboard.receiveAttack(randomTarget);
    if (validAttack) {
      if (opponentGameboard.allShipsSunk()) {
        PubSub.trigger("EndGame");
      } else {
        PubSub.trigger("SwitchTurns");
        PubSub.trigger("Play");
      }
    } else {
      attack();
    }
  };

  return {
    placeShips,
    attack,
  };
};
