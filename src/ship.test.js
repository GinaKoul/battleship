import { Ship } from "./ship.js";

test("Check if Ship factory exists", () => {
  expect(Ship).toBeDefined();
});

describe("Check if Ship factory properties and methods are available", () => {
  const currentShip = Ship(5);

  test("length available", () => {
    expect(currentShip.length).toBeDefined();
  });

  test("hits available", () => {
    expect(currentShip.hits).toBeDefined();
  });

  test("sunk available", () => {
    expect(currentShip.sunk).toBeDefined();
  });

  test("hit method available", () => {
    expect(currentShip.hit).toBeDefined();
  });

  test("isSunk() method available", () => {
    expect(currentShip.isSunk).toBeDefined();
  });
});

describe("Check Ship factory functionality", () => {
  test("hit() functionality", () => {
    const currentShip = Ship(2);
    let currentHits = currentShip.hits;
    expect(currentShip.hit()).toBe(currentHits + 1);
  });

  describe("isSunk() functionality", () => {
    const currentShip = Ship(2);
    let currentLenght = currentShip.length;

    test("isSunk() returns false if hits is less than length", () => {
      currentShip.hit();
      let currentHits = currentShip.hits;
      expect(currentShip.isSunk()).toBe(currentHits >= currentLenght);
    });

    test("isSunk() returns true if hits is equal to length", () => {
      currentShip.hit();
      let currentHits = currentShip.hits;
      expect(currentShip.isSunk()).toBe(currentHits >= currentLenght);
    });

    test("isSunk() returns true if hits is greater than length", () => {
      currentShip.hit();
      let currentHits = currentShip.hits;
      expect(currentShip.isSunk()).toBe(currentHits >= currentLenght);
    });
  });
});
