import { PubSub } from "./pubsub";

export const OpponentGame = function (opponent) {
  let opponentGameboard = opponent.getGameboard();
  const chars = "ABCDEFGHIJ";

  const attack = (opponent) => {
    // opponentGameboard = opponent.getGameboard();
    const randomTarget =
      chars.charAt(Math.floor(Math.random() * 9)) +
      Math.floor(Math.random() * (10 - 1) + 1);
    const validAttack = opponentGameboard.receiveAttack(randomTarget);
    if (validAttack) {
      if (opponentGameboard.allShipsSunk()) {
        PubSub.trigger("EndGame");
      } else {
        PubSub.trigger("SwitchTurns");
      }
    } else {
      attack();
    }
  };

  return {
    attack,
  };
};
