const passport  = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const person = require('./models/user');


passport.use(new LocalStrategy(async (USERNAME, password, done) =>{
    try {
          //console.log('Recieved credentials:', USERNAME, password );
          const user = await person.findOne({username:USERNAME});
          if(!user){
             return done(null, false,{message: 'Incorrect useranme.'});
          }
 
          const isPasswordMatch = await user.comparePassword(password);
          if(isPasswordMatch){
              return done(null, user);
          }else{
             return done(null, false, {message: 'Incorect password'})
          }
 
    } catch (err) {
     return done(err);     
    }
 }
 ));

 module.exports = passport;