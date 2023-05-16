const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");


function intialize(passport, getUserByEmail, getUserByid){

    const authenticateUser = async (email, password, done) => {

        const user = getUserByEmail(email)
        if(user == null){
            return done(null, false, {message:"No user found with the email"})
        }
        try {
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            }else{
                return done (null, false ,{message:"password incorrect"})
            }
            
        } catch (error) {
            console.log(error);
            return done(error)

            
        }
    }

    passport.use(new LocalStrategy({usernameField:'email'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserByid(id))
    })
}

module.exports = intialize