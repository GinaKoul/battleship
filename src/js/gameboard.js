import { Ship } from "./ship.js";

export const Gameboard = function () {
  let primaryGrid = new Map();
  let secondaryGrid = new Map();
  const boats = new Map();
  boats.set("carrier", { ship: Ship(5), added: false });
  boats.set("battleship", { ship: Ship(4), added: false });
  boats.set("destroyer", { ship: Ship(3), added: false });
  boats.set("submarine", { ship: Ship(3), added: false });
  boats.set("patrolBoat", { ship: Ship(2), added: false });

  const getPrimaryGrid = () => {
    return primaryGrid;
  };

  const getSecondaryGrid = () => {
    return secondaryGrid;
  };

  const allBoatsSunk = () => {
    return boats.size > 0;
  };

  const placeShip = (shipType, coordinates) => {
    let newShip = boats.get(shipType);
    if (newShip["added"]) return;
    let validCoordinates = coordinates.every((x) => !primaryGrid.get(x));
    if (!validCoordinates) return;
    coordinates.forEach((element) => {
      primaryGrid.set(element, {
        hit: false,
        shipType: shipType,
        ship: newShip["ship"],
      });
    });
    newShip["added"] = true;
  };

  const receiveAttack = (target) => {
    if (secondaryGrid.get(target)) return;
    let targetShip = primaryGrid.get(target);
    if (targetShip) {
      targetShip["hit"] = true;
      targetShip["ship"].hit();
      if (targetShip["ship"].isSunk()) boats(targetShip["shipType"]).delete();
      secondaryGrid.set(target, true);
    } else {
      secondaryGrid.set(target, false);
    }
  };

  return {
    getPrimaryGrid,
    getSecondaryGrid,
    allBoatsSunk,
    placeShip,
    receiveAttack,
  };
};
