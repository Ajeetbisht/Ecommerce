const jwt = require("jsonwebtoken")

const verifyToken = (req,res, next)=>{
    const authHeader = req.headers.token
    if(authHeader){
        jwt.verify(authHeader, process.env.JWT_SECRET, (err, user)=>{
            if(err) res.status(403).json("token is not valid")  
            req.user = user
            next()
        })
    }else{
        return res.status(401).json("you are not authoriared")
    }
}

const verifyAuth =(req, res, next)=>{
    verifyToken(req, res, ()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(403).json("you are not allowed to that!")
        }
    })
}

const verifyTokenAdmin =(req, res, next)=>{
    verifyToken(req, res, ()=>{
        if(req.user.isAdmin){
            next()
        }else{
            res.status(403).json("you are not allowed to that")
        }
    })
}

module.exports = {verifyToken, verifyAuth, verifyTokenAdmin}