import { PubSub } from "./pubsub";
import { Storage } from "./storage";

export const startGame = (function (doc) {
  const updatePlayers = () => {
    const radioValue = doc.querySelector("input[type='radio']:checked")?.value;
    if (radioValue) {
      Storage.setPlayersNumber(radioValue);
      PubSub.trigger("InitPlayers");
    }
  };

  const render = () => {
    const mainContent = doc.querySelector("#content");
    mainContent.textContent = "";

    const playersSelection = doc.createElement("form");
    const formTitle = doc.createElement("h2");
    formTitle.textContent = "Select number of players";

    const radioField1 = doc.createElement("div");
    const radio1Player = doc.createElement("input");
    const label1Player = doc.createElement("label");
    radioField1.classList.add("radio-field");
    radio1Player.setAttribute("type", "radio");
    radio1Player.setAttribute("name", "players");
    radio1Player.setAttribute("id", "players1");
    radio1Player.setAttribute("value", 1);
    radio1Player.setAttribute("checked", "checked");
    label1Player.setAttribute("for", "players1");
    label1Player.textContent = "1 Player";
    radioField1.append(radio1Player, label1Player);

    const radioField2 = doc.createElement("div");
    const radio2Player = doc.createElement("input");
    const label2Player = doc.createElement("label");
    radioField2.classList.add("radio-field");
    radio2Player.setAttribute("type", "radio");
    radio2Player.setAttribute("name", "players");
    radio2Player.setAttribute("id", "players2");
    radio2Player.setAttribute("value", 2);
    label2Player.setAttribute("for", "players2");
    label2Player.textContent = "2 Players";
    radioField2.append(radio2Player, label2Player);

    const buttonNext = doc.createElement("button");
    buttonNext.setAttribute("type", "button");
    buttonNext.textContent = "Next";
    buttonNext.addEventListener("click", updatePlayers);

    playersSelection.append(formTitle, radioField1, radioField2, buttonNext);

    mainContent.appendChild(playersSelection);
  };

  return {
    render,
  };
})(document);
