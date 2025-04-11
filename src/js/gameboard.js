import { PubSub } from "./pubsub.js";
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

  const allShipsSunk = () => {
    return boats.size <= 0;
  };

  const placeShip = (shipType, coordinates) => {
    let newShip = boats.get(shipType);
    if (newShip["added"]) return;
    let validCoordinates = coordinates.every((x) => !primaryGrid.get(x));
    if (!validCoordinates) return;
    coordinates.forEach((coordinate) => {
      primaryGrid.set(coordinate, {
        hit: false,
        shipType: shipType,
        ship: newShip["ship"],
      });
    });
    newShip["added"] = true;
  };

  const receiveAttack = (target) => {
    let gridTarget = primaryGrid.get(target);
    if (gridTarget) {
      if (!gridTarget["ship"] || gridTarget["hit"]) return false;
      gridTarget["hit"] = true;
      gridTarget["ship"].hit();
      if (gridTarget["ship"].isSunk()) boats.delete(gridTarget["shipType"]);
      return true;
    } else {
      primaryGrid.set(target, {
        hit: false,
      });
      return true;
    }
  };

  return {
    getPrimaryGrid,
    getSecondaryGrid,
    allShipsSunk,
    placeShip,
    receiveAttack,
  };
};
