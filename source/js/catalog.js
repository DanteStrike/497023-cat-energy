"use strict";

(function () {
  const LINK_BUTTON = "a.button";
  const LINK_ATTRIBUTE = "href";

  let linkButtons = document.querySelectorAll(LINK_BUTTON);
  linkButtons.forEach(function (element) {
    element.removeAttribute(LINK_ATTRIBUTE);
  });
})();
