function getLocalData(key) {
  return JSON.parse(localStorage.getItem(key));
}

function $get(query) {
  return document.getElementById(query);
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
    e[e.dataset.label || "textContent"] = flatData[e.dataset.api];
  });

  return clone;
}

function fillPage(url,data) {
  const div = Object.assign(document.createElement("a"), {
    href: url,
    textContent: url
  });

  document.body.appendChild(div);
  data.items.forEach((e, i) => {
    $get("items").appendChild(cloneHTML(e, i));
  });
}

function dataManager(userUrl, cb) {
  var dat = getLocalData(userUrl);

  if (!localStorage.getItem(userUrl)) {
    fetch(userUrl)
      .then(response => response.json())
      .then(data => {
        dat = data.body;
        fillPage(userUrl, dat);
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
