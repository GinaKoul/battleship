export const Ship = function (value = null) {
  let length = value;
  let hits = 0;
  let sunk = false;

  const hit = () => hits + 1;

  const isSunk = () => {
    if (hits >= length) sunk = true;
    return sunk;
  };

  return {
    length,
    hits,
    sunk,
    hit,
    isSunk,
  };
};
