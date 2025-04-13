import { storageAvailable } from "./storage-availability.js";

export const Storage = (function () {
  const localAvailability = storageAvailable("localStorage");
  const sessionAvailability = storageAvailable("sessionStorage");

  function setPlayersNumber(value) {
    if (sessionAvailability) {
      sessionStorage.setItem("PlayersNumber", JSON.stringify(value));
    }
  }

  function getPlayersNumber() {
    return sessionStorage.getItem("PlayersNumber");
  }

  function setFirstPlayerName(value) {
    if (sessionAvailability) {
      sessionStorage.setItem("FirstPlayerName", JSON.stringify(value));
    }
  }

  function getFirstPlayerName() {
    return sessionStorage.getItem("FirstPlayerName");
  }

  function setSecondPlayerName(value) {
    if (sessionAvailability) {
      sessionStorage.setItem("SecondPlayerName", JSON.stringify(value));
    }
  }

  function getSecondPlayerName() {
    return sessionStorage.getItem("SecondPlayerName");
  }
  return {
    setPlayersNumber,
    getPlayersNumber,
    setFirstPlayerName,
    getFirstPlayerName,
    setSecondPlayerName,
    getSecondPlayerName,
  };
})();
