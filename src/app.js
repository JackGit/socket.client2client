const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
  console.log(`a user connected: ${socket.id}`)

  socket.on('disconnect', () => {
    console.log(`a user disconnected: ${socket.id}`)
  })

  socket.on('message', (p1) => {
    console.log(`socket.id ${socket.id} message`, p1)
    if (p1.clientId) {
      socket.to(p1.clientId).send(p1.payload)
    }
  })
})

http.listen(3000, function () {
  console.log('listening on *:3000')
})


/*
a client connected
1. show his role
2. join into the group of that role, and broadcast the new connection
3. other clients receive the new joined client
4. any other client can get the new joined client id, and send msg

How to design the socket message,
to solve a problem, say we have terminals and controls:

1. all controls should able to know new terminal connection
2. all controls should able to know all existing terminal connections
3. control / terminal shouldn't need to know new connection of control / terminal
4. there is a centralized controller, should able to know all controls and all ternimal connections

 */
