console.log("frontend running ")

let socket=io()

socket.on('connected',()=>{
    console.log(socket.id)
})


$(()=>{
    let inputMessage=$("#chatMessage")
    let username=$("#username")
    let sendMessage=$('#sendMessage')
    let login=$("#login")
    let msgList=$('#msgList')

    sendMessage.hide()
    inputMessage.hide()

    login.click(()=>{
        socket.emit('send_ID',{
            username:username.val(),
            // userId=socket.id
        })

        username.hide()
        inputMessage.show()
        login.hide()
        sendMessage.show()
    })
    sendMessage.click(()=>{
        socket.emit('send_M',{
            message:inputMessage.val()
        })

    })

    socket.on('receive_M',(data)=>{
        msgList.append(`<li> ${data.username}:${data.message} </li>`)
    })
})


// use a model (sequelize) to create chat app
// make mapping of socket id and username
// flow
// install mongodb