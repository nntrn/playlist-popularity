window.addEventListener("DOMContentLoaded", event => {
  const theme = {
    primary: "#22dd64",
    accent: "#1DB954"
  };

  document.querySelectorAll("[data-bg]").forEach(e => {
    e.style.background = theme[e.dataset.bg];
    e.style.border = `1px solid ${theme[e.dataset.bg]}`;
  });

  // document.querySelectorAll('form').forEach(e=>{
  //   e.addEventListener('submit', function(ev){
  //     ev.preventDefault()
  //     console.log(ev)
  //   });
  // })

  document.querySelectorAll("[data-api]").forEach(e => {
    e.addEventListener("submit", function(ev) {
      ev.preventDefault();
      console.log(ev.target.dataset.api);
      console.log(ev)

      $.get(ev.target.dataset.api, function(data) {
        ev.target.parentElement.querySelector('.output').innerHTML = "<pre>hi</pre>"
          // "<pre>" + JSON.stringify(data, null, 2) + "</pre>";
      });
    });
  });
});
