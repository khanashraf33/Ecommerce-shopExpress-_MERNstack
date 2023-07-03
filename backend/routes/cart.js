
const Cart = require("../models/Cart");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require("./verifyToken");


const router = require("express").Router();



//create

router.post("/",verifyToken,async (req,res)=> {
    console.log(req.body);
    const newCart = new Cart(req.body)
    console.log("hii");
    console.log(newCart);
    try{
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    }catch(err){
        res.status(500).json(err)
    }
})


//update
router.put("/:id", verifyTokenAndAuthorization, async (req,res) =>{
    console.log(req.params.id);
    try{
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id,{
            $set: req.body
        },{new:true})
        //if we dont write {new:true}) it do give the updated user
        res.status(200).json(updatedCart);
    }catch(err){
        res.status(500).json(err);
     }
})


//Delete user

router.delete("/:id", verifyTokenAndAuthorization, async (req,res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart has been deleted....")
    }catch(err){
        res.status(500).json(err);
    }
})

//get user cart

router.get("/find/:userId", async (req,res)=>{
    try{
        const cart = await Cart.findOne(req.params.id)
        res.status(200).json(cart);
    }catch(err){
        res.status(500).json(err);
    }
})


// //get ALL PRODUCT

router.get("/", verifyTokenAndAdmin, async (req,res)=>{
    try {
        const carts = await Cart.find();
        res.status(200).json(carts)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router