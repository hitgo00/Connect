console.log("frontend running ")

let socket=io()

socket.on('connected',()=>{
    console.log(socket.id)
})


$(()=>{
    let inputMessage=$("#chatMessage")

    let sendMessage=$('#sendMessage')

    let loader=$('#loader')

    let msgList=$('#msgList')


    $.get( "/logged", ( messages ) =>{

        messages.forEach(data => {
            var str = data.date
            var date = new Date(str);
            dateTime=`${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}  `
            msgList.append(`<li class="list-group-item"> (${dateTime})${data.username}: ${data.message}  </li>`)
        });
        loader.hide()

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
        var str = data.date
            var date = new Date(str);
            dateTime=`${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}  `
            msgList.prepend(`<li class="list-group-item"> (${dateTime})${data.username}: ${data.message}  </li>`)
    })
})


