import { Storage } from "./storage";
import { PubSub } from "./pubsub.js";

export const InitializePlayers = (function (doc) {
  let playersTotal;
  let playerNum = 0;

  const updateName = () => {
    const playerName = doc.querySelector("[name='playerName']")?.value;
    if (playerName) {
      if (playerNum < 2) {
        Storage.setFirstPlayerName(playerName);
        if (playersTotal === "2") {
          PubSub.trigger("InitPlayers");
        } else {
          PubSub.trigger("PlayerInitFinished");
        }
      } else {
        Storage.setSecondPlayerName(playerName);
        playerNum = 0;
        PubSub.trigger("PlayerInitFinished");
      }
    }
  };

  const render = () => {
    playersTotal = JSON.parse(Storage.getPlayersNumber());
    playerNum++;

    const mainContent = doc.querySelector("#content");
    mainContent.textContent = "";

    const playersSelection = doc.createElement("form");
    const formTitle = doc.createElement("h2");
    formTitle.textContent = `Please enter player ${playerNum} name`;

    const formField = doc.createElement("div");
    const playerField = doc.createElement("input");
    const playerLabel = doc.createElement("label");
    formField.classList.add("form-field");
    playerField.setAttribute("type", "text");
    playerField.setAttribute("name", "playerName");
    playerField.setAttribute("id", "player");
    playerLabel.setAttribute("for", "player");
    playerLabel.textContent = "Player Name";
    formField.append(playerLabel, playerField);

    const buttonNext = doc.createElement("button");
    buttonNext.setAttribute("type", "button");
    buttonNext.textContent = "Next";
    buttonNext.addEventListener("click", updateName);

    playersSelection.append(formTitle, formField, buttonNext);

    mainContent.appendChild(playersSelection);
  };

  return {
    render,
  };
})(document);
