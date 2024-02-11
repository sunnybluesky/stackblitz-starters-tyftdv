let socket = io()
let ip = null
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.ipify.org/?format=json');
xhr.onload = () => {
  ip = JSON.parse(xhr.responseText).ip;
  console.log(ip);
};
xhr.send();

    socket.on("welcome",()=>{
      document.querySelector("#connecting").style.display = "none"
      loadScript("src/chat.js")
    })

    function loadScript(src){
      var el = document.createElement("script")
      el.src = src
      document.body.append(el)
    }