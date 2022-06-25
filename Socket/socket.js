
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.get('/', function (req, res) {
  // eslint-disable-next-line node/no-path-concat
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', function (socket) {
  console.log('客户端连接服务器')
  socket.on('disconnect', function () {
    console.log('客户端断开连接')
  })
  socket.on('send', function (msg) {
    console.log('message: ' + msg)

    // io.emit('自定义事件名称',发送的数据, { for: 'everyone' }) 将接收到的数据广播给所有用户
    io.emit('aaa', msg, { for: 'everyone' })
    /* 客户端接收数据
     socket.on('自定义事件名称', function (msg) {
      console.log(msg);
      $('#messages').append($('<li>').text(msg));
     });
    */
  })
})

http.listen(3000, function () {
  console.log('http://localhost:3000')
})
