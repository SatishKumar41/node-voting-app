const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {jwtAuthMiddleware, generateToken} =require('./../jwt');

     router.post('/signup', async(req, res)=>{

            try {
                const data = req.body;
                const newUser = new User(data);
                const response = await newUser.save();
                console.log('User account created',response);

                const payload = {
                    id:response.id,
                 }
                const token = generateToken(payload);
                    //console.log("Token is : ", token);
                    res.status(200).json({response:response, token :token});
                
            } catch (err) {
                    console.log(err);
                    res.status(500).json({error: 'Internal Server Error'});
            }
        });

    //login Route
    router.post('/login', async(req, res)=>{
            try {
                // Extract user details 
                const {aadharcardNumber, password} = req.body; 
                
                //find user in database
                const user = await User.findOne({aadharcardNumber: aadharcardNumber});
                const Cpass =await user.comparePassword(password); //console.log(pass);
                if (!user || !Cpass) return res.status(401).json({error: "Invalid username or password"});
                //generate token
                const payload={
                    id: user.id,
                    }
                const token = generateToken(payload);
                res.json(token);
                
            } catch (err) {
                console.error(err);
                res.status(500).json({error: 'Internal Server Error'});
            }

        });

    //Profile Route
    router.get('/profile', jwtAuthMiddleware, async(req, res)=>{
        try {
            const userdata = req.user;
            console.log(userdata);
            const userId = userdata.id;
            const user = await User.findById(userId);
            res.status(200).json({user});
        } catch (err) {
            console.error(err);
            res.status(500).json({error: 'Internal Server Error'});
        }
        });

      //update person
    router.put('/profile/password', async(req, res)=>{
            try {
                const userId = req.User; // Extact the Id from token
                const {currentPassword, newPassword} = req.body; //Extract Current and new password

                //find user in database
                const user = await User.findById(userId);
                const Cpass =await user.comparePassword(currentPassword); 
                if (!Cpass) return res.status(401).json({error: "Invalid username or password"});

                //update the user paasword
                user.password = newPassword;
                await user.save();
                console.log('password updated',response);
                res.status(200).json(response);
                
            } catch (err) {
                    console.log(err);
                    res.status(500).json({error: 'Internal Server Error'});
            }
        })


    module.exports= router;
