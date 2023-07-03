const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")



//register
router.post("/register", async (req,res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    try{
         const savedUser = await newUser.save();
         res.status(201).json(savedUser);
    }catch(err){
        res.status(500).json(err);
    }
});



//login


// router.post("/login",async (req,res)=>{
//     try{
//         const user = await User.findOne({ username: req.body.username });
//         !user && res.status(401).json("wrong credential!!");

//         const hashPassword = CryptoJS.AES.decrypt(
//             user.password,
//             process.env.PASS_SEC
//         );
//         const password = hashPassword.toString(CryptoJS.env.Utf8);
//         password !== req.body.password && res.status(401).json("wrong credential!!");

//         res.status(200).json(user);
//     }catch(err){
//         res.status(500).json(err);
//     }
// })

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).json("user not found in DB");
        }

        const decryptedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        ).toString(CryptoJS.enc.Utf8);
        
        if (decryptedPassword !== req.body.password) {
            return res.status(401).json("Your Password is incorrect");
        }

        //json web token
        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            {expiresIn:"3d"}
        )

        const { password, ...others } = user._doc;
        console.log("Password:", password);
        console.log("Others:", others);

        res.status(200).json({...others, accessToken});
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});





module.exports = router 