import { Player } from "../player.js";

test("Check if Player factory exists", () => {
  expect(Player).toBeDefined();
});

describe("check if Player methods are defined", () => {
  expect(Player().getGameboard).toBeDefined();
});
