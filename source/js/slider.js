'use strict';

//  Polyfills

(function () {
  var throttle = function throttle(type, name, obj) {
    obj = obj || window;
    var running = false;
    var func = function func() {
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
  throttle('resize', 'optimizedResize');
})();

(function () {

  if (typeof window.CustomEvent === 'function') return false;

  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

//  -----------------------------------------------------------------------------------
(function () {
  //  Service

  function getOffsetRect(elem) {

    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docElem = document.documentElement;

    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

    var clientTop = docElem.clientTop || body.clientTop || 0;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;

    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    var elemCoords = {
      top: Math.round(top),
      left: Math.round(left)
    };

    return elemCoords;
  }

  //  -----------------------------SLIDER------------------------------------------------------
  var slider = document.querySelector('.slider');
  var sliderList = slider.querySelector('.slider__list');
  var catBefore = sliderList.querySelector('.slider__item--before');
  var catAfter = sliderList.querySelector('.slider__item--after');

  var range = slider.querySelector('.slider__range');
  var rangeButton = range.querySelector('.slider__range-button');

  var sliderToogles = slider.querySelector('.slider__toogles');
  var sliderToogleBefore = sliderToogles.querySelector('.slider__toogle--before');
  var sliderToogleAfter = sliderToogles.querySelector('.slider__toogle--after');

  var TABLET_MIN_WIDTH = 768;
  var DESKTOP_MIN_WIDTH = 1300;

  var DEVICE_MOBILE = 'mobile';
  var DEVICE_TABLET = 'tablet';
  var DEVICE_DESKTOP = 'desktop';

  var Z_INDEX_VISIBLE = '99';
  var Z_INDEX_HIDDEN = '-1';

  var RANGE_BUTTON_BORDER_LEFT = 0;
  var RANGE_BUTTON_BORDER_RIGHT = 428;
  var RANGE_BUTTON_START = Math.round((RANGE_BUTTON_BORDER_LEFT + RANGE_BUTTON_BORDER_RIGHT) / 2);

  var RANGE_BUTTON_MARGIN_LEFT_AUTO = '0 0 0 auto';
  var RANGE_BUTTON_MARGIN_RIGHT_AUTO = '0 auto 0 0';

  var LINEAR_GRADIENT_ORIENTATION = 'to right';
  var LINEAR_GRADIENT_COLOR_ONE = '#f2f2f2';
  var LINEAR_GRADIENT_COLOR_TWO = '#eaeaea';

  var collectSliderGradient = function collectSliderGradient() {
    var sliderListOffset = parseInt(getComputedStyle(sliderList).marginLeft);
    var sliderItemOffset = parseInt(getComputedStyle(catBefore).left);

    var background = '';
    var gradientLenght = catBefore.clientWidth + sliderListOffset + sliderItemOffset;

    background = 'linear-gradient(' + LINEAR_GRADIENT_ORIENTATION + ', ' + (LINEAR_GRADIENT_COLOR_ONE + ' ' + gradientLenght + 'px, ') + (LINEAR_GRADIENT_COLOR_TWO + ' ' + gradientLenght + 'px)');

    return background;
  };

  var onSliderTooglesClick = function onSliderTooglesClick(evt) {
    evt.preventDefault();

    var target = evt.target;
    var deltaX = void 0;

    switch (target) {
      case sliderToogleBefore:
        if (window.innerWidth <= TABLET_MIN_WIDTH) {
          catBefore.style.zIndex = Z_INDEX_VISIBLE;
          catAfter.style.zIndex = Z_INDEX_HIDDEN;
          rangeButton.style.margin = RANGE_BUTTON_MARGIN_RIGHT_AUTO;
        } else {
          deltaX = parseInt(rangeButton.style.left) - RANGE_BUTTON_BORDER_LEFT;
          catBefore.style.width = catBefore.clientWidth + deltaX + 'px';
          catAfter.style.width = catAfter.clientWidth - deltaX + 'px';
          rangeButton.style.left = RANGE_BUTTON_BORDER_LEFT + 'px';
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
          catBefore.style.width = catBefore.clientWidth - deltaX + 'px';
          catAfter.style.width = catAfter.clientWidth + deltaX + 'px';
          rangeButton.style.left = RANGE_BUTTON_BORDER_RIGHT + 'px';
          slider.style.background = collectSliderGradient();
        }

        break;

      default:
        break;
    }

    return;
  };

  var onRangeButtonMouseDown = function onRangeButtonMouseDown(evt) {
    evt.preventDefault();

    var target = evt.target;
    var targetCoordX = getOffsetRect(target).left;
    var mouseStartCoordX = evt.clientX;
    var mouseTargetPositionX = mouseStartCoordX - targetCoordX;

    var rangeBorderLeft = RANGE_BUTTON_BORDER_LEFT;
    var rangeBorderRight = RANGE_BUTTON_BORDER_RIGHT;

    var onThisMouseMove = function onThisMouseMove(moveEvt) {
      moveEvt.preventDefault();

      var mouseMoveCoordX = moveEvt.clientX;
      var newTargetCoordX = target.offsetLeft + mouseMoveCoordX - mouseTargetPositionX - targetCoordX;

      if (newTargetCoordX >= rangeBorderLeft && newTargetCoordX <= rangeBorderRight) {
        var deltaX = parseInt(target.style.left) - newTargetCoordX;
        catBefore.style.width = catBefore.clientWidth + deltaX + 'px';
        catAfter.style.width = catAfter.clientWidth - deltaX + 'px';
        slider.style.background = collectSliderGradient();

        target.style.left = newTargetCoordX + 'px';
        targetCoordX = getOffsetRect(target).left;
      }

      return;
    };

    var onThisMouseUp = function onThisMouseUp(upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onThisMouseMove);
      document.removeEventListener('mouseup', onThisMouseUp);

      return;
    };

    document.addEventListener('mousemove', onThisMouseMove);
    document.addEventListener('mouseup', onThisMouseUp);

    return;
  };

  var onWindowResize = function onWindowResize(evt) {
    if (window.innerWidth <= TABLET_MIN_WIDTH &&
        slider.dataset.device != DEVICE_MOBILE) {
      catBefore.style.width = '';
      catAfter.style.width = '';
      slider.style.background = '';
      rangeButton.style.left = '';
      slider.dataset.device = DEVICE_MOBILE;
    }

    if (window.innerWidth > TABLET_MIN_WIDTH && window.innerWidth <= DESKTOP_MIN_WIDTH
        && slider.dataset.device != DEVICE_TABLET) {
      catBefore.style.zIndex = '';
      catAfter.style.zIndex = '';
      catBefore.style.width = '';
      catAfter.style.width = '';
      rangeButton.style.left = RANGE_BUTTON_START + 'px';
      rangeButton.style.margin = '0';
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

  rangeButton.style.left = RANGE_BUTTON_START + 'px';
  rangeButton.style.margin = '0';
  rangeButton.addEventListener('mousedown', onRangeButtonMouseDown);
  sliderToogles.addEventListener('click', onSliderTooglesClick);
  window.addEventListener('optimizedResize', onWindowResize);
})();
