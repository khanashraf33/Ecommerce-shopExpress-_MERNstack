const User = require("../models/User");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");


const router = require("express").Router();

//update
router.put("/:id", verifyTokenAndAuthorization, async (req,res) =>{
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }
    console.log(req.params.id);
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set: req.body
        },{new:true})
        //if we dont write {new:true}) it do give the updated user
        res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json(err);
     }
})


//Delete user

router.delete("/:id", verifyTokenAndAuthorization, async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted....")
    }catch(err){
        res.status(500).json(err);
    }
})

//get user

router.get("/find/:id", verifyTokenAndAdmin, async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        const { password, ...others } =user._doc;
        res.status(200).json(others);
    }catch(err){
        res.status(500).json(err);
    }
})


//get ALL user

router.get("/", verifyTokenAndAdmin, async (req,res)=>{
    const query = req.query.new;
    console.log(query);
    try{
        const users = query ? 
        await User.find().sort({_id: -1 }).limit(5)
        //if the url contain /api/users?name=true
        //then it will only give latest 5 users info
        : await User.find()
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err);
    }
})


//get user stats
router.get("/stats",verifyTokenAndAdmin, async(req,res) =>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1));
    try{
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear}}},
            {
            $project: {
                month: { $month: "$createdAt"},
            },
        },
        {
            $group: {
                _id: "$month", 
                total: { $sum: 1},
            },
        },
        ]);
        res.status(200).json(data);
    }catch(err){
        res.status(500).json(err);
    }
})




module.exports = router