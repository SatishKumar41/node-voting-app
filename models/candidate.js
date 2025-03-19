const mongoose = require('mongoose');
const bcrypt =require('bcrypt');

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    party:{
        type: String,
        required: true
    },
    age:{
        type: Number    
      },
   
    votes:[
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'user',
                require:true
              },
            votedAt:{
                type:Date,
                default:Date.now()
              }
        }
        
    ],
voteCount:{
    type:Number,
    default:0
}  

})

const Candidate = mongoose.model('candidate',candidateSchema);
module.exports = Candidate;