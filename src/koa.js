const Koa = require('koa')
const http = require('http')
const socket = require('socket.io')

const app = new Koa()
const server = http.createServer(app.callback())
const io = socket(server)

app.use(async ctx => {
  ctx.body = 'Hello World'
})

io.on('connection', () => {
  console.log('io.connection')
})

server.listen(3000)
