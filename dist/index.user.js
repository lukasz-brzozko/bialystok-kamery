// ==UserScript==
// @name         Białystok kamery
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Adds a simple panel to switch a camera
// @author       Łukasz Brzózko
// @match        http://kamery.szr.bialystok.pl:81/kam*
// @icon         http://szr.bialystok.pl/favicon.ico
// @resource     openProps https://unpkg.com/open-props@1.5.11/open-props.min.css
// @resource     openPropsNormalize https://unpkg.com/open-props@1.5.11/normalize.min.css
// @resource     openPropsButtons https://unpkg.com/open-props@1.5.11/buttons.min.css
// @updateURL    https://raw.githubusercontent.com/lukasz-brzozko/bialystok-kamery/main/dist/index.meta.js
// @downloadURL  https://raw.githubusercontent.com/lukasz-brzozko/bialystok-kamery/main/dist/index.user.js
// @grant        GM_getResourceText
// @grant        GM_addStyle
// ==/UserScript==
(function () {
  "use strict";

  var DIRECTION = "DIRECTION";
  var openPropsCss = GM_getResourceText("openProps");
  var openPropsNormalizeCss = GM_getResourceText("openPropsNormalize");
  var openPropsNormalizBtnsCss = GM_getResourceText("openPropsButtons");
  GM_addStyle(openPropsCss);
  GM_addStyle(openPropsNormalizeCss);
  GM_addStyle(openPropsNormalizBtnsCss);
  var style = document.createElement("style");
  style.textContent = "\n  .btn {\n    position: fixed;\n    left: 0;\n    bottom: 0;\n    min-height: 75px;\n    transition: all 0.3s ease;\n  }\n\n  .btn.next {\n    left: auto;\n    right: 0;\n  }\n\n  .btn.loading {\n    opacity: 0.5;\n    pointer-events: none;\n  }\n";
  document.head.appendChild(style);
  var btnsEl = [];
  var ACTIONS = {
    prev: "prev",
    next: "next"
  };
  var btns = [{
    text: "Poprzednia kamera",
    action: ACTIONS.prev
  }, {
    text: "Następna kamera",
    action: ACTIONS.next
  }];
  var replacePathname = function replacePathname(_ref) {
    var camNumber = _ref.camNumber,
      newCamNumber = _ref.newCamNumber;
    window.location.pathname = window.location.pathname.replace(camNumber, newCamNumber);
  };
  var generateNewCamNumber = function generateNewCamNumber(_ref2) {
    var prevCamNumber = _ref2.prevCamNumber,
      action = _ref2.action;
    return action === ACTIONS.next ? ++prevCamNumber : --prevCamNumber;
  };
  var setNewLocation = function setNewLocation() {
    var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ACTIONS.next;
    var pathname = window.location.pathname;
    var regex = /\d+/;
    var camNumber = pathname.match(regex);
    var parsedCamNumber = parseInt(camNumber, 10);
    if (!parsedCamNumber || isNaN(parsedCamNumber)) return;
    var newCamNumber = generateNewCamNumber({
      prevCamNumber: parsedCamNumber,
      action: action
    });
    replacePathname({
      camNumber: camNumber,
      newCamNumber: newCamNumber
    });
    setInterval(function () {
      newCamNumber = generateNewCamNumber({
        prevCamNumber: newCamNumber,
        action: action
      });
      console.info({
        newCamNumber: newCamNumber
      });
      replacePathname({
        camNumber: camNumber,
        newCamNumber: newCamNumber
      });
    }, 1000);
  };
  var handleBtnClick = function handleBtnClick(e) {
    var action = e.currentTarget.dataset.action;
    sessionStorage.setItem(DIRECTION, action);
    btnsEl.forEach(function (btn) {
      btn.classList.add("loading");
      btn.textContent = "Ładowanie";
    });
    setNewLocation(action);
  };
  var generateBtn = function generateBtn(_ref3) {
    var text = _ref3.text,
      action = _ref3.action;
    var btn = document.createElement("button");
    btn.dataset.action = action;
    btn.className = "btn ".concat(action);
    btn.textContent = text;
    document.body.appendChild(btn);
    btn.addEventListener("click", handleBtnClick);
    return btn;
  };
  var init = function init() {
    var img = document.querySelector("body > img");
    if (!img) setNewLocation(sessionStorage.getItem(DIRECTION));
    btnsEl = btns.map(generateBtn);
  };
  init();
})();