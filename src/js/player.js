import { Gameboard } from "./gameboard";

export const Player = function (value) {
  const name = value;
  const gameboard = Gameboard();

  const getName = () => name;

  const getGameboard = () => gameboard;

  return {
    getName,
    getGameboard,
  };
};
