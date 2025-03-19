const express = require('express');
const router = express.Router();
const {jwtAuthMiddleware} =require('./../jwt');
const Candidate = require('../models/candidate');
const User = require('../models/user');


const checkAdminRole = async(userID)=>{
    try {
        const user = await User.findById(userID);
         if(user.role === "admin"){
            return true;
        }
    } catch (err) {
        return false;
    }
}
    //post route to add a candidate
     router.post('/',jwtAuthMiddleware, async(req, res)=>{

            try {
                const checRole = await checkAdminRole(req.user.id);
                if(!checRole)  return res.status(403).json({message: "User has not Admin role."})
                
                const data = req.body;
                const newCandidate = new Candidate(data);
                const response = await newCandidate.save();
                console.log('Data saved',response);
                res.status(200).json({response:response});
                
            } catch (err) {
                    console.log(err);
                    res.status(500).json({error: 'Internal Server Error'});
            }
        });

      //update Candidate
    router.put('/:candidateID', jwtAuthMiddleware, async(req, res)=>{
            try {
                const checRole = await checkAdminRole(req.user.id);
                //console.log(req.user.id);
                if(!checRole)  return res.status(403).json({message: "User has not Admin role."})

                const candidateID = req.params.candidateID;
                const updatedCandidateIDData =req.body;
                const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidateIDData, {
                new: true,
                runvalidators: true

                });
                if(!response){res.status(403).json({error: 'Candidate not found'});}

                console.log('candidate Data updated',response);
                res.status(200).json(response);
                
            } catch (err) {
                    console.log(err);
                    res.status(500).json({error: 'Internal Server Error'});
            }
        })


      //Delete Candidate
    router.delete('/:candidateID', jwtAuthMiddleware, async(req, res)=>{
        try {
               const checRole = await checkAdminRole(req.user.id);
                if(!checRole)  return res.status(403).json({message: "User has not Admin role."})

            const candidateID = req.params.candidateID;
            const response = await Candidate.findByIdAndDelete(candidateID);

            if(!response){
                res.status(404).json({error: 'Record not found'});
                
            }
        
           // console.log('Candidate data deleted');
            res.status(200).json({message: "Candidate deleted sucessfully"});
            
        } catch (err) {
                console.log(err);
                res.status(500).json({error: 'Internal Server Error'});
        }
       })

    // voting start here
    router.post('/vote/:candidateID', jwtAuthMiddleware, async(req, res)=>{
        //admin cant vote and user vote only once.
        const candidateID = req.params.candidateID;
        const userID = req.user.id;
        try {
            //find candiadate with candidate ID
            const candidate = await Candidate.findById(candidateID);
            if(!candidate) { return res.status(404).json({message: 'Candidate not found.'});}

            const user = await User.findById(userID);
            if(!user) { return res.status(404).json({message: 'User not found.'});}

            if(user.isVoted) { return res.status(404).json({message: 'You have already voted.'});}

            if(user.role == "admin") { return res.status(404).json({message: 'Admin not allowwed to vote.'});}

            //record a vote and update candidate docs

            candidate.votes.push({user: userID})
            candidate.voteCount++;        
            await candidate.save();

            // update user docs
            user.isVoted =true;
            await user.save();
            res.status(200).json({message: 'Vote submitted successfully'});s
            
        } catch (err) {
            console.log(err);
            res.status(500).json({error: 'Internal Server Error'});
        }
      })

   // Vote count
   router.get('/vote/count', jwtAuthMiddleware, async (req, res)=>{
        try {
            // find all candidate and sort them by vote count
            const candidate = await Candidate.find().sort({voteCount:'desc'});
            //mapping record
            const voteRecord = candidate.map((data) =>{
                    return {
                        party: data.party,
                        count: data.voteCount
                    }
                });
                res.status(200).json({voteRecord});
            
        } catch (err) {
            console.log(err);
            res.status(500).json({error: 'Internal Server Error'});
        }
     })

     //all candidate

     router.get('/candidatelist', async (req, res)=>{
        try {
            const candidate = await Candidate.find().sort({voteCount:'desc'});
            const candidateList = candidate.map((data) =>{
                return {
                    name :data.name,
                    age :data.age,
                    party: data.party,
                    count: data.voteCount
                }
            });
            res.status(200).json({candidateList});
        } catch (err) {
            console.log(err);
            res.status(500).json({error: 'Internal Server Error'});
        }
     })
  

   module.exports= router;
