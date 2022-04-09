const router = require("express").Router()
const User = require("../models/User")
const { verifyToken, verifyAuth, verifyTokenAdmin } = require("./verifyToken")

//@update     post
router.put("/:id", verifyToken,async(req, res)=>{
    try {
        const updateduser = await User.findByIdAndUpdate(req.params.id,{
            $set : req.body
        }, {new:true})    //return updated user
        res.status(200).json(updateduser)
    } catch (error) {
        res.status(500).json(error)
    }
})


//@delete user    delete
router.delete("/:id", verifyAuth,async (req, res)=>{
    try {
/*        const userid = req.params.id
        if(userid !== User._id) return res.status(401).json("wrong id")
*/
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted...")
        
    } catch (error) {
        res.status(500).json(error.message)        
    }
})

//@find user only admin    delete
router.get("/find/:id", verifyTokenAdmin,async (req, res)=>{
    try {
/*        const userid = await req.params.id
        if(userid !== User._id) return res.status(401).json("wrong id")
*/
        const user = await User.findById(req.params.id)
        const {password, ...others } = user._doc
        res.status(200).json(others)
        
    } catch (error) {
        res.status(500).json(error.message)        
    }
})

//GET ALL USER
router.get("/", verifyTokenAdmin, async (req, res) => {
    const query = req.query.new;
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(5)
        : await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  })


//GET USER STATS
router.get("/stats", verifyTokenAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },   //greather than last year
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports = router