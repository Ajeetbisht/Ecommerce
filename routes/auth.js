const router = require("express").Router()
const User = require("../models/User")
const jwt = require("jsonwebtoken")

//@register     post
router.post("/register", async(req, res)=>{
    const {username, email, password} = req.body

    const userExists = await User.findOne({ email })
    if(userExists) return res.json({message: "User already exists"})
    else {
        const newUser = new User({ username, email, password})
        newUser.save()
        return res.status(200).json(newUser)
    }
})

//@login    post
router.post("/login", async (req, res)=>{
    try {
        const user = await User.findOne({username: req.body.username})
        if(!user) res.status(401).json("wrong credentials")
            
        if(user.password !== req.body.password){
            return res.status(401).json("wrong crendentials!")
        }else{
            const accessToken = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin
            },process.env.JWT_SECRET, {expiresIn:"3d"} )

            //password hide (mongodb store data in _doc folder)
            const {password, ...others} = user._doc
            res.status(200).json({...others, accessToken})
        }
    } catch (error) {
        res.status(500).json(error.message)        
    }
})

//



module.exports = router