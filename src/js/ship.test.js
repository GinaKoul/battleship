import { Ship } from "./ship.js";

test("Check if Ship factory exists", () => {
  expect(Ship).toBeDefined();
});

describe("Check if Ship factory methods are available", () => {
  const currentShip = Ship(5);

  test("hit() method available", () => {
    expect(currentShip.hit).toBeDefined();
  });

  test("isSunk() method available", () => {
    expect(currentShip.isSunk).toBeDefined();
  });
});

describe("Check Ship factory functionality", () => {
  test("hit() functionality", () => {
    const currentShip = Ship(2);
    expect(currentShip.hit()).toBe(1);
  });

  describe("isSunk() functionality", () => {
    const currentShip = Ship(2);

    test("isSunk() returns false if hits is less than length", () => {
      currentShip.hit();
      expect(currentShip.isSunk()).toBe(false);
    });

    test("isSunk() returns true if hits is equal to length", () => {
      currentShip.hit();
      expect(currentShip.isSunk()).toBe(true);
    });

    test("isSunk() returns true if hits is greater than length", () => {
      currentShip.hit();
      expect(currentShip.isSunk()).toBe(true);
    });
  });
});
