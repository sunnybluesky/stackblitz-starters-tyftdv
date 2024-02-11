console.log(`Node.js v${process.versions.node}!`);
const crypto = require('crypto');



const fs = require("fs");
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname+"/public"))

let chat_log = []
let userlist = []
/* {
  name:"name",
  id:socket.id,
  position:{
    x:0,
    y:0,
  },
} */

io.on('connection', (socket) => {
  io.to(socket.id).emit('welcome')
  
  socket.on('disconnect', () => {
  })
  socket.on("request-log",()=>{
    io.to(socket.id).emit("request-log",chat_log)
  })
  socket.on("send-message",(msg,ip)=>{
    var hash = crypto.createHash('sha256');
    var hashedIp = hash.update("ip").digest('hex').substring(0, 16);
    io.emit("send-message",msg,hashedIp)
    chat_log.push(`${msg}ঙ${hashedIp}`)
    writeData()
  }) 
});

server.listen(3000, () => {
  console.log('listening on *:3000');
  readData()
});

function writeData(){
  // 書き込むデータ準備
  const data = chat_log.join("\n");
  
  // 書き込み
  fs.writeFile("log.txt", data, (err) => {
    if (err) throw err;
  });
  }
  function readData(){
    var text = fs.readFileSync("log.txt", 'utf8');
  var lines = text.toString().split('\n');
  chat_log = lines
  console.log("read chatlog length:"+lines.length)
  }
  


//　コ　ン　ソ　ー　ル　入　力
const readline = require('readline');
const inputString = (prompt) => {
  const readInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolive) =>
    readInterface.question(prompt, (inputString) => {
      readInterface.close();
      resolive(inputString);
    })
  );
};

function input_string() {
  (async () => {
    const string = await inputString('\x1b[39m');
    switch (string) {
      case 'help':
        console.log('\x1b[33m');
        console.log('コマンドの使い方は以下の通りです。');
        console.log('ーーーーーーーーーーーーーーーーーーー');
        console.log('「help」コマンドの使い方を表示します。');
        console.log('「clear」コンソールをクリアします。');
        console.log('「time」現在時刻を表示します。');
        console.log('「chat-log-delete」メッセージのログを消去します。');
        console.log('ーーーーーーーーーーーーーーーーーーー\x1b[39m');
        break;
      case 'clear':
        console.clear();
        console.log('「clear」コマンドが実行されました。');
        break;
      case 'time':
        console.log('「time」コマンドが実行されました。');
        console.log(new Date());
        break;
      case 'chat-log-delete':
      chat_log=[]
      writeData()
      console.log('「chat-log-delete」コマンドが実行されました。');
      break;
      case "":
      break;
      default:
        console.log('\x1b[31m該当するコマンドがありません。');
    }
    input_string();
  })();
}
console.log('\x1b[33m 「help」で各コマンドの説明が表示されます。');
input_string();
