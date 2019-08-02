console.log("frontend running ")

let socket=io()

socket.on('connection',()=>{
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

        $.get( "/logged", ( messages ) =>{
            messages.forEach(data => {
                console.log(data)
                msgList.append(`<li class="list-group-item"> ${data.username}:${data.message} </li>`)
            });

          });
    })
    sendMessage.click(()=>{
        socket.emit('send_M',{
            message:inputMessage.val()
        })
        inputMessage.val("")

    })

    socket.on('receive_M',(data)=>{
        console.log(data)
        msgList.append(`<li class="list-group-item"> ${data.username}:${data.message} </li>`)
    })
})


