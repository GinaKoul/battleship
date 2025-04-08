import { Gameboard } from "./gameboard.js";

test("Check if Gameboard factory exists", () => {
  expect(Gameboard).toBeDefined();
});

describe("Check if Gameboard factory methods are available", () => {
  const currentBoard = Gameboard();

  test("placeShip() method available", () => {
    expect(currentBoard.placeShip).toBeDefined();
  });

  test("receiveAttack() method available", () => {
    expect(currentBoard.receiveAttack).toBeDefined();
  });
});

describe("Check if placeShip() method is working as expected", () => {
  let currentBoard;
  beforeEach(() => {
    currentBoard = Gameboard();
    currentBoard.placeShip("carrier", ["A1", "A2", "A3", "A4", "A5", "A6"]);
  });

  test("placeShip() method adds boat", () => {
    currentBoard.placeShip("battleship", ["B1", "B2", "B3", "B4", "B5"]);
    expect(currentBoard.getPrimaryGrid().size).toBe(11);
  });

  test("placeShip() method does not add boat when it is already added", () => {
    currentBoard.placeShip("carrier", ["B1", "B2", "B3", "B4", "B5", "B6"]);
    expect(currentBoard.getPrimaryGrid().size).toBe(6);
  });

  test("placeShip() method does not add boat when another boat is added at the same coordinates", () => {
    currentBoard.placeShip("battleship", ["A1", "A2", "A3", "A4", "A5"]);
    expect(currentBoard.getPrimaryGrid().size).toBe(6);
  });
});

describe("receiveAttack() method is working as expected", () => {
  const currentBoard = Gameboard();
  currentBoard.placeShip("patrolBoat", ["B1", "B2"]);

  test("check if attack changes primary grid", () => {
    currentBoard.receiveAttack("B1");
    expect(currentBoard.getPrimaryGrid().get("B1")["hit"]).toBe(true);
  });

  test("check if attack changes secondary grid", () => {
    currentBoard.receiveAttack("E2");
    expect(currentBoard.getSecondaryGrid().get("E2")).toBe(false);
  });
});
