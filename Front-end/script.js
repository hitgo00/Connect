console.log("frontend running ")

let socket=io()

socket.on('connected',()=>{
    console.log(socket.id)
})


$(()=>{
    let inputMessage=$("#chatMessage")

    let sendMessage=$('#sendMessage')

    let msgList=$('#msgList')

    $.get( "/logged", ( messages ) =>{

        messages.forEach(data => {
            msgList.append(`<li class="list-group-item"> ${data.username}:${data.message} </li>`)
        });

    });

    sendMessage.click(()=>{
        if(inputMessage.val()){
        socket.emit('send_M',{
            message:inputMessage.val()
        })
        inputMessage.val("")
        }

    })

    socket.on('receive_M',(data)=>{
        console.log(data)
        msgList.prepend(`<li class="list-group-item"> ${data.username}:${data.message} </li>`)
    })
})


