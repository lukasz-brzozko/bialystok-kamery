// ==UserScript==
// @name         Białystok kamery
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a simple panel to switch a camera
// @author       Łukasz Brzózko
// @match        http://kamery.szr.bialystok.pl:81/*
// @icon         http://szr.bialystok.pl/favicon.ico
// @resource     openProps https://unpkg.com/open-props@1.5.11/open-props.min.css
// @resource     openPropsNormalize https://unpkg.com/open-props@1.5.11/normalize.min.css
// @resource     openPropsButtons https://unpkg.com/open-props@1.5.11/buttons.min.css
// @updateURL    https://raw.githubusercontent.com/lukasz-brzozko/bialystok-kamery/main/index.meta.js
// @downloadURL  https://raw.githubusercontent.com/lukasz-brzozko/bialystok-kamery/main/index.user.js
// @grant        GM_getResourceText
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  "use strict";

  const DIRECTION = "DIRECTION";

  const openPropsCss = GM_getResourceText("openProps");
  const openPropsNormalizeCss = GM_getResourceText("openPropsNormalize");
  const openPropsNormalizBtnsCss = GM_getResourceText("openPropsButtons");

  GM_addStyle(openPropsCss);
  GM_addStyle(openPropsNormalizeCss);
  GM_addStyle(openPropsNormalizBtnsCss);

  const style = document.createElement("style");

  style.textContent = `
  .btn {
    position: fixed;
    left: 0;
    bottom: 0;
    min-height: 75px;
    transition: all 0.3s ease;
  }

  .btn.next {
    left: auto;
    right: 0;
  }

  .btn.loading {
    opacity: 0.5;
    pointer-events: none;
  }
`;

  document.head.appendChild(style);

  let btnsEl = [];

  const ACTIONS = {
    prev: "prev",
    next: "next",
  };

  const btns = [
    {
      text: "Poprzednia kamera",
      action: ACTIONS.prev,
    },
    {
      text: "Następna kamera",
      action: ACTIONS.next,
    },
  ];

  const replacePathname = ({ camNumber, newCamNumber }) => {
    window.location.pathname = window.location.pathname.replace(
      camNumber,
      newCamNumber
    );
  };

  const generateNewCamNumber = ({ prevCamNumber, action }) => {
    return action === ACTIONS.next ? ++prevCamNumber : --prevCamNumber;
  };

  const setNewLocation = (action = ACTIONS.next) => {
    const { pathname } = window.location;

    const regex = /\d+/;
    const camNumber = pathname.match(regex);
    let parsedCamNumber = parseInt(camNumber, 10);

    if (!parsedCamNumber || isNaN(parsedCamNumber)) return;

    let newCamNumber = generateNewCamNumber({
      prevCamNumber: parsedCamNumber,
      action,
    });

    replacePathname({ camNumber, newCamNumber });

    setInterval(() => {
      newCamNumber = generateNewCamNumber({
        prevCamNumber: newCamNumber,
        action,
      });

      console.info({ newCamNumber });

      replacePathname({ camNumber, newCamNumber });
    }, 1000);
  };

  const handleBtnClick = (e) => {
    const { action } = e.currentTarget.dataset;

    sessionStorage.setItem(DIRECTION, action);

    btnsEl.forEach((btn) => {
      btn.classList.add("loading");
      btn.textContent = "Ładowanie";
    });

    setNewLocation(action);
  };

  const generateBtn = ({ text, action }) => {
    const btn = document.createElement("button");

    btn.dataset.action = action;
    btn.className = `btn ${action}`;
    btn.textContent = text;

    document.body.appendChild(btn);

    btn.addEventListener("click", handleBtnClick);

    return btn;
  };

  const init = () => {
    const img = document.querySelector("body > img");

    if (!img) setNewLocation(sessionStorage.getItem(DIRECTION));

    btnsEl = btns.map(generateBtn);
  };

  init();
})();
