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
      
      const query = Array.from(ev.target.querySelectorAll('[name]')).map(e=>`${e.name}=${e.value}`).join('&')
      const apiPath = `${ev.target.dataset.api}?${query}`
      
      $.get(apiPath, function(data) {
        ev.target.parentElement.querySelector('.output').innerHTML = "<pre>" + JSON.stringify(data, null, 2) + "</pre>"
          // "<pre>" + JSON.stringify(data, null, 2) + "</pre>";
      });
    });
  });
});
