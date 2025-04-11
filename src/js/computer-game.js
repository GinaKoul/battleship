import { PubSub } from "./pubsub";

export const OpponentGame = function (player, opponent) {
  const playerGameboard = player.getGameboard();
  const opponentGameboard = opponent.getGameboard();
  const chars = "ABCDEFGHIJ";

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
      }
    } else {
      attack();
    }
  };

  return {
    attack,
  };
};
