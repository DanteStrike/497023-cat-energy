`use strict`;

(function () {
  //  Services

  function getOffsetRect(elem) {

    let box = elem.getBoundingClientRect()

    let body = document.body
    let docElem = document.documentElement

    let scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
    let scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft

    let clientTop = docElem.clientTop || body.clientTop || 0
    let clientLeft = docElem.clientLeft || body.clientLeft || 0

    let top  = box.top +  scrollTop - clientTop
    let left = box.left + scrollLeft - clientLeft

    let elemCoords = {
      top: Math.round(top),
      left: Math.round(left)
    }

    return elemCoords;
  }

  function getCssValuePrefix() {
    const PREFIXES = ['-o-', '-ms-', '-moz-', '-webkit-'];
    let rtrnVal = '';//default to standard syntax

    // Create a temporary DOM object for testing
    let dom = document.createElement('div');

    for (var i = 0; i < PREFIXES.length; i++) {
        // Attempt to set the style
        dom.style.background = PREFIXES[i] + 'linear-gradient(#000000, #ffffff)';

        // Detect if the style was successfully set
        if (dom.style.background) {
            rtrnVal = PREFIXES[i];
        }
    }

    dom = null;
    delete dom;

    return rtrnVal;
  }

  (function() {
    var throttle = function(type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
             requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle("resize", "optimizedResize");
  })();

//  -----------------------------SLIDER------------------------------------------------------
  let slider = document.querySelector(`.slider`);
  let catBefore = slider.querySelector(`.slider__item--before`);
  let catAfter = slider.querySelector(`.slider__item--after`);

  let range = slider.querySelector(`.slider__range`);
  let rangeButton = range.querySelector(`.slider__range-button`);

  let sliderToogles = slider.querySelector(`.slider__toogles`);
  let sliderToogleBefore = sliderToogles.querySelector(`.slider__toogle--before`);
  let sliderToogleAfter = sliderToogles.querySelector(`.slider__toogle--after`);

  const TABLET_MIN_WIDTH = 768;

  const RANGE_BUTTON_BORDER_LEFT = 0;
  const RANGE_BUTTON_BORDER_RIGHT = range.clientWidth - 2 * parseInt(getComputedStyle(range).paddingRight);
  const RANGE_BUTTON_START = Math.round((RANGE_BUTTON_BORDER_LEFT + RANGE_BUTTON_BORDER_RIGHT) / 2);

  const LINEAR_GRADIENT_ORIENTATION = `to right`;
  const LINEAR_GRADIENT_COLOR_ONE = `rgb(242, 242, 242)`;
  const LINEAR_GRADIENT_COLOR_TWO = `rgb(234, 234, 234)`;

  let onSliderTooglesClick = function(evt) {
    evt.preventDefault();

    let target = evt.target;
    let deltaX;

    switch (target) {
      case sliderToogleBefore:
        deltaX = parseInt(rangeButton.style.left) - RANGE_BUTTON_BORDER_LEFT;
        catBefore.style.width = catBefore.clientWidth + deltaX + `px`;
        catAfter.style.width = catAfter.clientWidth - deltaX + `px`;
        rangeButton.style.left = RANGE_BUTTON_BORDER_LEFT + `px`;
        break;

      case sliderToogleAfter:
        deltaX = RANGE_BUTTON_BORDER_RIGHT - parseInt(rangeButton.style.left);
        catBefore.style.width = catBefore.clientWidth - deltaX + `px`;
        catAfter.style.width = catAfter.clientWidth + deltaX + `px`;
        rangeButton.style.left = RANGE_BUTTON_BORDER_RIGHT + `px`;
        break;

      default:
        break;
    }

    slider.style.background = getCssValuePrefix() + ``

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

      if ((newTargetCoordX >= rangeBorderLeft) && (newTargetCoordX <= rangeBorderRight)) {
        let deltaX = parseInt(target.style.left) - newTargetCoordX;
        catBefore.style.width = catBefore.clientWidth + deltaX + `px`;
        catAfter.style.width = catAfter.clientWidth - deltaX + `px`;

        target.style.left = newTargetCoordX + `px`;
        targetCoordX = getOffsetRect(target).left;
      }

      return;
    }

    let onThisMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener(`mousemove`, onThisMouseMove);
      document.removeEventListener(`mouseup`, onThisMouseUp);

      return;
    }

    document.addEventListener(`mousemove`, onThisMouseMove)
    document.addEventListener(`mouseup`, onThisMouseUp);

    return;
  }

  let onDocumentLoad = function (evt) {
    rangeButton.style.left = RANGE_BUTTON_START + `px`;
    rangeButton.style.margin = "0";
    rangeButton.addEventListener(`mousedown`, onRangeButtonMouseDown);
    sliderToogles.addEventListener(`click`, onSliderTooglesClick);

    return;
  }

  let onWindowResize = function (evt) {
    if ((window.innerWidth < TABLET_MIN_WIDTH) && (catBefore.style.width !== ``)) {
      rangeButton.style.left = RANGE_BUTTON_START + `px`;
      catBefore.style.width = ``;
      catAfter.style.width = ``;
    }

    return;
  }

  document.addEventListener(`DOMContentLoaded`, onDocumentLoad);
  window.addEventListener('optimizedResize', onWindowResize);
})();
