function browserPredicates(userAgent) {
  userAgent = userAgent || window.navigator.userAgent;

  let isChrome = /Chrome/i.test(userAgent) && !/Edge/i.test(userAgent);
  let isMobile = /iPhone|iPad|Android/i.test(userAgent);
  let isAndroid = /android/i.test(userAgent);
  let isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window["MSStream"];
  let isMacOS = /Mac/i.test(userAgent);
  let isAppleDevice = isIOS || isMacOS;

  return {
    isChrome,
    isMobile,
    isAndroid,
    isIOS,
    isMacOS,
    isAppleDevice
  };
}

function addStyleSheet(css, id = "") {
  let style = Object.assign(document.createElement("style"), {
    textContent: css,
    id: id
  });
  document.head.appendChild(style);
}

const windowStyle = `body{
  font-weight: 500
}
*::-webkit-scrollbar {
    width:0px;
}`;

if (!browserPredicates().isMacOS) {
  addStyleSheet(windowStyle, "browser-win");
}
