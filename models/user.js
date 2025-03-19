const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age:{
        type: Number    
      },
    email:{
        type: String,
       },   
    mobile:{
        type: String,
       
    },
    address:{
        type: String,
        required: true
    },
    aadharCardNumber:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true  
    },
    role:{
        type: String,
        enum:['voter','admin'],
        default: 'voter'
    },
    isVoted:{
        type:Boolean,
        default:false

    }


})

userSchema.pre('save', async function(next){
    const user =this;
    //hash the password only if it has modified (or its new)
    if(!user.isModified('password')) return next();
    try {
        //salt generation
        const salt = await bcrypt.genSalt(5);
        //has password
        const hashPassword = await bcrypt.hash(user.password,salt);
        //override the plain password
        user.password = hashPassword;
        next();

    } catch (err) {
        return next(err);
    }
  })


  userSchema.methods.comparePassword = async function(candidatePassword){
       try {
        //use bcrypt to comapre given password to hash password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (err) {
        return err;
    }
  }

const User = mongoose.model('User',userSchema);
module.exports = User;