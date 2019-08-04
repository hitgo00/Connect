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
            message:message,
            date:new Date()
    })
    console.log(result)
}


async function readMsgs() {
    db=await connectdb('chatApp')
    const messages = db.collection('messages')
    const msgArr = await messages.find({}).sort({date: -1}).toArray()
    const allMsg=[]
    msgArr.forEach((m) => allMsg.push((m)))

    return allMsg
}


function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}



app.get('/signup', (req, res) => res.render('signup'))
app.post('/signup', async(req, res) => {

  if(validateEmail(req.body.email)){


    db=await connectdb('chatApp')
    const Users=db.collection('users')



  Users.findOne({username:req.body.username})
  .then(user=>{
    if(user){
    let errorM="username already taken"
    res.render('signup',{errorM})
    }

    else{
      Users.insertOne({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      })
        .then((user) => {
          console.log(user)
          res.redirect('/')
        })
        .catch((err) => {
          console.error(err)
          res.redirect('/signup')
        })

    }

  })
  .catch(err=>{console.log(err)})

  }

  else{
      let errorM="enter a valid email"
      res.render('signup',{errorM})
  }

})


app.get('/', (req, res) => res.render('login'))

app.post( '/',
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/',
    // failureFlash : true
  }),
)


 let username
function checkLoggedIn(req, res, next) {

    if (req.user) {
      username=(req.user.username)
      return next()
    }
    res.redirect('/')
}



app.get('/logged',checkLoggedIn,(req,res)=>{
    (async  function(){
        const m=await ( readMsgs())
        res.send(m)
    })()
})

io.on('connection', (socket) => {
  console.log("Connection Established ", socket.id )
  let userName=username

  socket.on("send_M",(data)=>{
    console.log("data received ",data.message)
    addMsg(userName,data.message)

    io.emit("receive_M",{
      username:userName,
      message:data.message,
      date: new Date()
    })
  })

})

app.use('/home',checkLoggedIn, express.static(__dirname + '/Front-end'))


app.get('/home',checkLoggedIn,(req,res)=>{
  res.sendFile(path.join(__dirname, '../Front-end/index.html'));
})

const port = process.env.PORT || 4848

server.listen(port, () => {
    console.log("Server started on http://localhost:"+ port)
})
