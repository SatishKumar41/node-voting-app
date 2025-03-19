const jwt = require('jsonwebtoken');

const jwtAuthMiddleware =(req, res, next)=>{
    //first check request header has authorization  or not
    const authorization = req.headers.authorization;
    if(!authorization) return res.status(401).json({error: "Token not Found"});
  

    //Extract the JWT token from the request Header
    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error: "Unauthorized"});
        try {
            //verify the JWT toekn
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //Attach user info to request object
            req.user = decoded;
            next();
        } catch (err) {
            console.error(err);
            res.status(401).json({error: "Unauthorized"});
        }
}

//functionto generate token

    const generateToken = (userData)=>{
        return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn:300000});
    }

module.exports = {jwtAuthMiddleware, generateToken};