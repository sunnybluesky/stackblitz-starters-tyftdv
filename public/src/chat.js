//main
let chat = {
  setup:function(){
    this.frame.style = `
    transform: translateY(${window.outerHeight-535}px);
    display:inline;`
    socket.emit("request-log")
    document.querySelector(".chat-form > span").innerHTML = cookie.search("name")
    this.input.addEventListener("keydown",(e)=>{
      if(e.key === "Enter" && this.input.value !== ""){
        socket.emit("send-message",`${cookie.search("name")}ঙ${this.input.value}`,ip)
        this.input.value = ""
      }
    })
  },
  add:function(str,id){
    this.contents.innerHTML += `<span title="ID:${id}">${str}</span><br>`
  },
  frame:document.querySelector(".chat-frame"),
  contents:document.querySelector(".chat-contents"),
  input:document.querySelector(".chat-form > input"),
  log:[],
}
socket.on("request-log",(log)=>{
  chat.log = log
  for(var i=0;i<=log.length-1;i++){
    chat.add(log[i].split("ঙ")[0]+" : "+log[i].split("ঙ")[1],log[i].split("ঙ")[2])
  }
})
socket.on("send-message",(msg,id)=>{
  chat.log.push(msg)
  chat.add(msg.split("ঙ")[0]+" : "+msg.split("ঙ")[1],id)
})


//cookie
let cookie = {
  setup:function(){
    this.add("name","guest")
    this.update()
  },
  update:function(){
    this.arr = document.cookie.split("ጇ")
    var index_1 = this.arr
    this.key = []
    this.value = []
    for(var i=1;i<=index_1.length-1;i++){
      var index_2 = index_1[i].split('ጆ')
      this.key.push(index_2[0])
      this.value.push(index_2[1])
    }

  },
  add:function(key,value){
    if(key===undefined || value===undefined){

    }else{
    document.cookie += `ጇ${key}ጆ${value}`
  }
  },
  sync:function(){
    var str = ""
    for(var i=0;i<=this.key.length-1;i++){
      str += `ጇ${this.key[i]}ጆ${this.value[i]}`
    }
    document.cookie = str;
    this.update()
  },
  replace:function(key="",value=""){
    this.value[this.key.indexOf(key)] = value
    this.sync()
  },
  search:function(str){
    return this.value[this.key.indexOf(str)]
  },
  check:function(){
    console.log(this.key)
    console.log(this.value)
  },
  arr:[],
  key:[],
  value:[],

}

if(document.cookie === ""){
  document.cookie = cookie.setup()
}else{
  cookie.update()
}

// chat(name dialog)
var nameInputDialog = document.querySelector(".name-input")
if(cookie.search("name") === "guest"){
  nameInputDialog.showModal();
}else{
  chat.setup()
}
document.querySelector(".name-input > .input").addEventListener("keydown",(e)=>{
  if(e.key === "Enter"){
    nameInput()
  }
})
document.querySelector(".name-input > .button").addEventListener("click",()=>{
  nameInput()
})
function nameInput(){
  var len = document.querySelector(".name-input > .input").value.length
  if(len < 2){
    document.querySelector(".name-input > .notice").innerHTML = `名前は２文字以上にしてください。`
  }else if(len > 20){
    document.querySelector(".name-input > .notice").innerHTML = `名前は20文字以内にしてください。`
  }else{
    //success
    nameInputDialog.close();
    cookie.replace("name",document.querySelector(".name-input > .input").value)
    chat.setup()
  }
  
}

