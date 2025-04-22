import { storageAvailable } from "./storage-availability.js";

export const Storage = (function () {
  const localAvailability = storageAvailable("localStorage");
  const sessionAvailability = storageAvailable("sessionStorage");

  const setPlayersNumber = (value) => {
    if (sessionAvailability) {
      sessionStorage.setItem("PlayersNumber", JSON.stringify(value));
    }
  };

  const getPlayersNumber = () => {
    return sessionStorage.getItem("PlayersNumber");
  };

  const setFirstPlayerName = (value) => {
    if (sessionAvailability) {
      sessionStorage.setItem("FirstPlayerName", JSON.stringify(value));
    }
  };

  const getFirstPlayerName = () => {
    return sessionStorage.getItem("FirstPlayerName");
  };

  const setSecondPlayerName = (value) => {
    if (sessionAvailability) {
      sessionStorage.setItem("SecondPlayerName", JSON.stringify(value));
    }
  };

  const getSecondPlayerName = () => {
    return sessionStorage.getItem("SecondPlayerName");
  };

  const clear = () => {
    sessionStorage.clear();
  };

  return {
    setPlayersNumber,
    getPlayersNumber,
    setFirstPlayerName,
    getFirstPlayerName,
    setSecondPlayerName,
    getSecondPlayerName,
    clear,
  };
})();
