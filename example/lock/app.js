const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.get('/lock', function (req, res) {
  res.sendFile(__dirname + '/lock.html')
})

app.get('/lock-controller', function (req, res) {
  res.sendFile(__dirname + '/lock-controller.html')
})

const lockSockets = {}

io.on('connection', (socket) => {
  console.log(`a user connected: ${socket.id}`)

  socket.on('/lock/login', data => {
    lockSockets[data.id] = socket
    socket.broadcast.emit('/lock/login', data)
  })

  socket.on('/lock/lock', data => {
    const lockSocket = lockSockets[data.lockId]
    lockSocket.emit('/lock/lock')
  })

  socket.on('/lock/unlock', data => {
    const lockSocket = lockSockets[data.lockId]
    lockSocket.emit('/lock/unlock')
  })

  socket.on('disconnect', () => {
    console.log(`a user disconnected: ${socket.id}`)
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

/*
A control / terminal connected, how to identify its role?
  1. send role information while doing connection?
  2. after connected, send role information?
  3. connect a role-specified namespace?
    3.1 is able send message cross namespaces?
 */


/*
  About design,
  1. try to think about SAO message queue: request queue and response queue
  2. how about design socket event name like RESTful API
 */
