function getPathName() {
  return window.location.pathname;
}

function getApiUrl(path) {
  return `/api${path}`;
}

const currentPage = getPathName();
const url = getApiUrl(currentPage);

function getLocalData(key) {
  return JSON.parse(localStorage.getItem(key));
}

function $get(query) {
  return document.getElementById(query);
}

// TODO: find a better way/lib to do this
function decodeSingleQuote(str){
  if(!str || typeof str !== 'string'){
    return str
  }
  return str.replace(/&#x27;/g,"'")
}

function flattenObject(data) {
  var result = {};
  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (var i = 0, l = cur.length; i < l; i++)
        recurse(cur[i], prop + "[" + i + "]");
      if (l == 0) result[prop] = [];
    } else {
      var isEmpty = true;
      for (var p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + "." + p : p);
      }
      if (isEmpty && prop) result[prop] = {};
    }
  }
  recurse(data, "");
  return result;
}

function cloneHTML(itemData, index = 0) {
  const flatData = flattenObject(itemData);

  var clone = document
    .querySelector('#items .card[data-index="-1"]')
    .cloneNode(true);
  (clone.id = "playlist-" + itemData.id), (clone.dataset.index = index);
  clone.querySelectorAll("[data-api]").forEach(e => {
    e[e.dataset.label || "textContent"] = decodeSingleQuote(flatData[e.dataset.api]);
  });

  return clone;
}

function fillPage(data) {
  data.items.forEach((item, i) => {
    $get("items").appendChild(cloneHTML(item, i));
  });
}

function dataManager(userUrl, cb) {
  var dat = getLocalData(userUrl);

  if (!localStorage.getItem(userUrl)) {
    fetch(userUrl)
      .then(response => response.json())
      .then(data => {
        dat = data.body;
        fillPage(dat);
        console.log("fetched", data);
        localStorage.setItem(
          userUrl,
          JSON.stringify({
            ...data.body,
            fetched: new Date().toLocaleString()
          })
        );
      });
  }
  cb(dat);
}

dataManager(url, fillPage);
