document.querySelectorAll("[data-api]").forEach(e => {
  e.addEventListener("submit", function(ev) {
    ev.preventDefault();

    const query = Array.from(ev.target.querySelectorAll("[name]"))
      .map(e => `${e.name}=${e.value}`)
      .join("&");
    const apiPath = `${ev.target.dataset.api}?${query}`;
    
    console.log(apiPath)
    
    $.get(apiPath, function(data) {
      let pre = document.createElement("pre");
      let link = document.createElement("a")

      Object.assign(pre, {
        textContent: JSON.stringify(data, null, 2),
        style:
          "max-height:300px;overflow-y:scroll;background:rgba(255,255,255,.6);padding:.25rem"
      });
      Object.assign(link,{
        href: apiPath,
        textContent:apiPath
      })
      ev.target.parentElement.querySelector(".output").appendChild(link);
      ev.target.parentElement.querySelector(".output").appendChild(pre);
    });
  });
});
