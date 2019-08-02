const express = require('express')
const socket = require('socket.io')
const http = require('http')

const {connectdb}=require('./db')


const app = express()
const server = http.createServer(app)




const passport= require('./setuppassport')
const session =require('express-session')


app.set('view engine', 'hbs')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))




app.use(
    session({
        secret:'hello world chatApp',
        resave:false,
        saveUninitialized:true

    })
)


app.use(passport.initialize())
app.use(passport.session())







const io = socket(server)

var addMsg= async function (username,message){
    db=await connectdb('chatApp')
    const messages=db.collection('messages')
    const result=await messages.insertOne({
            username:username,
            message:message
    })
    console.log(result)
}


async function readMsgs() {
    db=await connectdb('chatApp')
    const messages = db.collection('messages')
    const msgArr = await messages.find({}).toArray()
    const allMsg=[]
    msgArr.forEach((m) => allMsg.push((m)))

    return allMsg
}


app.get('/signup', (req, res) => res.render('signup'))
app.post('/signup', async(req, res) => {
    db=await connectdb('chatApp')
    const Users=db.collection('users')
  Users.insertOne({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })
    .then((user) => {
      console.log(user)
      res.redirect('/login')
    })
    .catch((err) => {
      console.error(err)
      res.redirect('/signup')
    })
})


app.get('/login', (req, res) => res.render('login'))

app.post( '/login',
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
  }),
)

function checkLoggedIn(req, res, next) {
    if (req.user) {
      return next()
    }
    res.redirect('/login')
  }



app.get('/logged',checkLoggedIn,(req,res)=>{
    (async  function(){
        const m=await ( readMsgs())
        res.send(m)
    })()
})

io.on('connection', (socket) => {
    console.log("Connection Established ", socket.id )

    socket.on("send_ID",(data)=>{
        let userName=data.username
        // let userName=req.user.username

        socket.on("send_M",(data)=>{
            console.log("data received ",data.message)
            addMsg(userName,data.message)


            io.emit("receive_M",{
                username:userName,
                message:data.message
            })
        })
    })
})

app.use('/home', express.static(__dirname + '/front-end'))



server.listen(4848, () => {
    console.log("Server started on http://localhost:4848")
})
