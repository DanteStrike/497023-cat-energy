"use strict";

(function () {
  const MAIN_MENU_BUTTON_MENU = "header__button--menu";
  const MAIN_MENU_BUTTON_JS = "header__button--nojs";
  const HEADER_BORDER = "header__wrap--border-bottom";

  let mainMenuButton = document.querySelector(".header__button");
  let headerWrap = document.querySelector(".header__wrap")

  let onMainMenuButtonClick = function (evt) {
    evt.preventDefault();

    let target = evt.target;

    target.classList.toggle(MAIN_MENU_BUTTON_MENU);
    headerWrap.classList.toggle(HEADER_BORDER);
  }

  mainMenuButton.classList.remove(MAIN_MENU_BUTTON_JS);
  headerWrap.classList.toggle(HEADER_BORDER);
  mainMenuButton.addEventListener("click", onMainMenuButtonClick);
})();
