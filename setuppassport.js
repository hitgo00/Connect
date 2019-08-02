const passport =require('passport')
const LocalStrategy = require('passport-local').Strategy
const { connectdb } = require('./db')
let Users

passport.use(
    new LocalStrategy((async function (username,password,done){
        db=await connectdb('chatApp')
        const users = db.collection('users')
        Users=users

        try {
            const user=await users.findOne({
                username:username
            })

            if(!user){
                return done(null,false,{message: "No such user"})
            }
            if(user.password!=password){
                return done(null,false,{message:"password in wrong"})
            }
            done(null,user)

        } catch (e){return done(e)}
    }))
)

passport.serializeUser((user,done)=>{
    done(null, user.username)
})

passport.deserializeUser((username, done) => {
    Users.findOne({
        // _id: userId,
        username:username
    })
      .then((user) => done(null, user))
      .catch(done)
  })

module.exports = passport