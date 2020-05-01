const express = require('express')
const app = express()
const http = require('http')
const server = http.Server(app)
const io = require('socket.io')(server)

io.on('connection', socket => {
  
  broadcastNewChatter(socket);
  introUser(socket);

  console.log('a user connected')
  socket.on('chat-message', data => {
    console.log('a user sent a chat message:', data)
    console.log(typeof data);
    io.emit('chat-message', data)
  })
  socket.on('typing', (data) => {
    console.log(`${data} is typing...`);
    io.emit('typing-message', data)
  })  

})

function introUser(socket) {
  socket.emit('get-name', 'Introduce yourself!')
}

function broadcastNewChatter() {
  const message = {
    name: '',
    payload: 'Sombody joined the chat room!', 
  }
  io.emit('server-message', message)
}

server.listen(3000, () => console.log('socket.io server up on 3000'))

