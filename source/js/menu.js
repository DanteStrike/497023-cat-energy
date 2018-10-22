"use strict";

(function () {
  const MAIN_MENU_BUTTON_MENU = "header__button--menu";
  const MAIN_MENU_BUTTON_JS = "header__button--nojs";

  let mainMenuButton = document.querySelector(".header__button");

  let onMainMenuButtonClick = function (evt) {
    evt.preventDefault();

    let target = evt.target;

    target.classList.toggle(MAIN_MENU_BUTTON_MENU);
  }

  mainMenuButton.classList.remove(MAIN_MENU_BUTTON_JS);
  mainMenuButton.addEventListener("click", onMainMenuButtonClick);
})();
