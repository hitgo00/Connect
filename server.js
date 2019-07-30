const express = require('express')
const socket = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)

const io = socket(server)

io.on('connection', (socket) => {
    console.log("Connection Established ", socket.id )



    socket.on("send_ID",(data)=>{
        let userName=data.username
        socket.on("send_M",(data)=>{
            console.log("data received ",data.message)

            io.emit("receive_M", {
                message: data.message,
                username:userName
            })
        })

    })

})

app.use('/', express.static(__dirname + '/front-end'))

server.listen(4848, () => {
    console.log("Server started on http://localhost:4848")
})
