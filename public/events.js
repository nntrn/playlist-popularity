window.addEventListener("DOMContentLoaded", event => {
  const theme = {
    primary: "#22dd64",
    accent: "#1DB954"
  };

  document.querySelectorAll("[data-bg]").forEach(e => {
    e.style.background = theme[e.dataset.bg];
    e.style.border = `1px solid ${theme[e.dataset.bg]}`;
  });


  document.querySelectorAll("[data-api]").forEach(e => {
    e.addEventListener("submit", function(ev) {
      ev.preventDefault();
      
      const query = Array.from(ev.target.querySelectorAll('[name]')).map(e=>`${e.name}=${e.value}`).join('&')
      const apiPath = `${ev.target.dataset.api}?${query}`
      
      $.get(apiPath, function(data) {
        let pre = document.createElement('pre')
        pre.textContent = JSON.stringify(data, null, 2)
        Object.assign(pre, {
          textContent:JSON.stringify(data, null, 2),
          style:'max-height:300px;overflow-y:scroll;background:rgba(255,255,255,.6);padding:.25rem'
          
        })
        ev.target.parentElement.querySelector('.output').appendChild(pre)
  
      });
    });
  });
});
