window.addEventListener('DOMContentLoaded', (event) => {
  
  const theme={
    primary: '#22dd64',
    accent: '#1DB954'
  }
  
  document.querySelectorAll('[data-bg]').forEach(e=>{
    e.style.background = theme[e.dataset.bg]
    e.style.border = `1px solid ${theme[e.dataset.bg]}`
  })
  
  document.querySelectorAll('form').forEach(e=>{
    e.addEventListener('submit', function(ev){
      ev.preventDefault()
      console.log(ev)
    });
  })
  
  
  
});