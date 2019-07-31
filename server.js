const express = require('express')
const socket = require('socket.io')
const http = require('http')

const {connectdb}=require('./db')


const app = express()
const server = http.createServer(app)

const io = socket(server)

var addMsg=function (username,message){
    connectdb('chatApp')
    .then((db)=>{

        const msg=db.collection('messages')
        return msg.insertOne({
            username:username,
            message:message
    })
    .then (result=>console.log(result))
})}

// var viewMsg=function(){
    async function readMsgs() {
        db=await connectdb('chatApp')
        const msg = db.collection('messages')
        const msgArr = await msg.find({}).toArray()
        const allMsg=[]
        msgArr.forEach((m) => allMsg.push((m)))

        return allMsg
    }



    app.get('/logged',(req,res)=>{
        (async  function(){
            const z=await ( readMsgs())
            res.send(z)
         })()
    })
// }
// viewMsg()
io.on('connection', (socket) => {
    console.log("Connection Established ", socket.id )





    socket.on("send_ID",(data)=>{
        let userName=data.username

        socket.on("send_M",(data)=>{
            console.log("data received ",data.message)
            addMsg(userName,data.message)

            // io.emit("receive_M", {
            //     message: data.message,
            //     username:userName
            // })



            io.emit("receive_M",{
                username:userName,
                message:data.message
            }


            )
        })

    })


})

app.use('/', express.static(__dirname + '/front-end'))



server.listen(4848, () => {
    console.log("Server started on http://localhost:4848")
})
