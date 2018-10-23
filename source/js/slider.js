"use strict";

//Polyfill optimizedResize
(function () {
  let throttle = function (type, name, obj) {
    obj = obj || window;

    let running = false;
    let func = function () {
      if (running) {

        return;
      }
      running = true;
      requestAnimationFrame(function () {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };

    obj.addEventListener(type, func);
  };

  /* init - you can init any event */
  throttle("resize", "optimizedResize");
})();

//Polyfill CustomEvent ie11
(function () {
  if (typeof window.CustomEvent === "function") return false;

  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    let evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

(function () {
  //Service
  function getOffsetRect(elem) {

    let box = elem.getBoundingClientRect();

    let body = document.body;
    let docElem = document.documentElement;

    let scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    let scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

    let clientTop = docElem.clientTop || body.clientTop || 0;
    let clientLeft = docElem.clientLeft || body.clientLeft || 0;

    let top = box.top + scrollTop - clientTop;
    let left = box.left + scrollLeft - clientLeft;

    let elemCoords = {
      top: Math.round(top),
      left: Math.round(left)
    };

    return elemCoords;
  }

  //SLIDER
  const TABLET_MIN_WIDTH = 768;
  const DESKTOP_MIN_WIDTH = 1300;

  const DEVICE_MOBILE = "mobile";
  const DEVICE_TABLET = "tablet";
  const DEVICE_DESKTOP = "desktop";

  const Z_INDEX_VISIBLE = "99";
  const Z_INDEX_HIDDEN = "-1";

  const RANGE_BUTTON_BORDER_LEFT = 0;
  const RANGE_BUTTON_BORDER_RIGHT = 428;
  const RANGE_BUTTON_START = Math.round((RANGE_BUTTON_BORDER_LEFT + RANGE_BUTTON_BORDER_RIGHT) / 2);

  const RANGE_BUTTON_MARGIN_LEFT_AUTO = "0 0 0 auto";
  const RANGE_BUTTON_MARGIN_RIGHT_AUTO = "0 auto 0 0";

  const LINEAR_GRADIENT_ORIENTATION = "to right";
  const LINEAR_GRADIENT_COLOR_ONE = "#f2f2f2";
  const LINEAR_GRADIENT_COLOR_TWO = "#eaeaea";

  let slider = document.querySelector(".slider");
  let sliderList = slider.querySelector(".slider__list");
  let catBefore = sliderList.querySelector(".slider__item--before");
  let catAfter = sliderList.querySelector(".slider__item--after");

  let range = slider.querySelector(".slider__range");
  let rangeButton = range.querySelector(".slider__range-button");

  let sliderToogles = slider.querySelector(".slider__toogles");
  let sliderToogleBefore = sliderToogles.querySelector(".slider__toogle--before");
  let sliderToogleAfter = sliderToogles.querySelector(".slider__toogle--after");

  let collectSliderGradient = function () {
    let sliderListOffset = parseInt(getComputedStyle(sliderList).marginLeft);
    let sliderItemOffset = parseInt(getComputedStyle(catBefore).left);

    let background = "";
    let gradientLenght = catBefore.clientWidth + sliderListOffset + sliderItemOffset;
    background = "linear-gradient(" + LINEAR_GRADIENT_ORIENTATION + ", " + (LINEAR_GRADIENT_COLOR_ONE + " " + gradientLenght + "px, ") + (LINEAR_GRADIENT_COLOR_TWO + " " + gradientLenght + "px)");

    return background;
  };

  let onSliderTooglesClick = function (evt) {
    evt.preventDefault();

    let target = evt.target;
    let deltaX = 0;

    switch (target) {
      case sliderToogleBefore:
        if (window.innerWidth <= TABLET_MIN_WIDTH) {
          catBefore.style.zIndex = Z_INDEX_VISIBLE;
          catAfter.style.zIndex = Z_INDEX_HIDDEN;
          rangeButton.style.margin = RANGE_BUTTON_MARGIN_RIGHT_AUTO;
        } else {
          deltaX = parseInt(rangeButton.style.left) - RANGE_BUTTON_BORDER_LEFT;
          catBefore.style.width = catBefore.clientWidth + deltaX + "px";
          catAfter.style.width = catAfter.clientWidth - deltaX + "px";
          rangeButton.style.left = RANGE_BUTTON_BORDER_LEFT + "px";
          slider.style.background = collectSliderGradient();
        }

        break;

      case sliderToogleAfter:
        if (window.innerWidth <= TABLET_MIN_WIDTH) {
          catAfter.style.zIndex = Z_INDEX_VISIBLE;
          catBefore.style.zIndex = Z_INDEX_HIDDEN;
          rangeButton.style.margin = RANGE_BUTTON_MARGIN_LEFT_AUTO;
        } else {
          deltaX = RANGE_BUTTON_BORDER_RIGHT - parseInt(rangeButton.style.left);
          catBefore.style.width = catBefore.clientWidth - deltaX + "px";
          catAfter.style.width = catAfter.clientWidth + deltaX + "px";
          rangeButton.style.left = RANGE_BUTTON_BORDER_RIGHT + "px";
          slider.style.background = collectSliderGradient();
        }

        break;

      default:
        break;
    }

    return;
  };

  let onRangeButtonMouseDown = function (evt) {
    evt.preventDefault();

    let target = evt.target;
    let targetCoordX = getOffsetRect(target).left;
    let mouseStartCoordX = evt.clientX;
    let mouseTargetPositionX = mouseStartCoordX - targetCoordX;

    let rangeBorderLeft = RANGE_BUTTON_BORDER_LEFT;
    let rangeBorderRight = RANGE_BUTTON_BORDER_RIGHT;

    let onThisMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      let mouseMoveCoordX = moveEvt.clientX;
      let newTargetCoordX = target.offsetLeft + mouseMoveCoordX - mouseTargetPositionX - targetCoordX;

      if (newTargetCoordX >= rangeBorderLeft && newTargetCoordX <= rangeBorderRight) {
        let deltaX = parseInt(target.style.left) - newTargetCoordX;
        catBefore.style.width = catBefore.clientWidth + deltaX + "px";
        catAfter.style.width = catAfter.clientWidth - deltaX + "px";
        slider.style.background = collectSliderGradient();
        target.style.left = newTargetCoordX + "px";
        targetCoordX = getOffsetRect(target).left;
      }

      return;
    };

    let onThisMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener("mousemove", onThisMouseMove);
      document.removeEventListener("mouseup", onThisMouseUp);

      return;
    };

    document.addEventListener("mousemove", onThisMouseMove);
    document.addEventListener("mouseup", onThisMouseUp);

    return;
  };

  let onWindowResize = function (evt) {
    if (window.innerWidth <= TABLET_MIN_WIDTH &&
        slider.dataset.device != DEVICE_MOBILE) {
      catBefore.style.width = "";
      catAfter.style.width = "";
      slider.style.background = "";
      rangeButton.style.left = "";
      slider.dataset.device = DEVICE_MOBILE;
    }

    if (window.innerWidth > TABLET_MIN_WIDTH && window.innerWidth <= DESKTOP_MIN_WIDTH
        && slider.dataset.device != DEVICE_TABLET) {
      catBefore.style.zIndex = "";
      catAfter.style.zIndex = "";
      catBefore.style.width = "";
      catAfter.style.width = "";
      rangeButton.style.left = RANGE_BUTTON_START + "px";
      rangeButton.style.margin = "0";
      slider.style.background = collectSliderGradient();
      slider.dataset.device = DEVICE_TABLET;
    }

    if (window.innerWidth > DESKTOP_MIN_WIDTH
        && slider.dataset.device != DEVICE_DESKTOP) {
      slider.style.background = collectSliderGradient();
      slider.dataset.device = DEVICE_DESKTOP;
    }

    return;
  };

  rangeButton.style.left = RANGE_BUTTON_START + "px";
  rangeButton.style.margin = "0";
  rangeButton.addEventListener("mousedown", onRangeButtonMouseDown);
  sliderToogles.addEventListener("click", onSliderTooglesClick);
  window.addEventListener("optimizedResize", onWindowResize);
})();
