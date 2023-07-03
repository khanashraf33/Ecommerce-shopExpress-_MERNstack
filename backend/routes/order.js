
const Order = require("../models/Order");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require("./verifyToken");


const router = require("express").Router();



//create

router.post("/",verifyToken,async (req,res)=> {
    console.log(req.body);
    const newOrder = new Order(req.body)
    console.log("hii");
    console.log(newOrder);
    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    }catch(err){
        res.status(500).json("what to do")
    }
})


//update
router.put("/:id", verifyTokenAndAdmin, async (req,res) =>{
    console.log(req.params.id);
    try{
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id,{
            $set: req.body
        },{new:true})
        //if we dont write {new:true}) it do give the updated user
        res.status(200).json(updatedOrder);
    }catch(err){
        res.status(500).json(err);
     }
})


//Delete user

router.delete("/:id", verifyTokenAndAdmin, async (req,res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order has been deleted....")
    }catch(err){
        res.status(500).json(err);
    }
})

//get user Orders

router.get("/find/:userId",verifyTokenAndAuthorization, async (req,res)=>{
    try{
        const orders = await Order.find({ userId: req.params.userId});
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err);
    }
})


// //get ALL PRODUCT

router.get("/", verifyTokenAndAdmin, async (req,res)=>{
    try {
        const Orders = await Order.find();
        res.status(200).json(Orders)
    }catch(err){
        res.status(500).json(err)
    }
})

//Get MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req,res)=>{
    const date = new Date();
    console.log(date);
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    console.log(lastMonth);
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
    console.log(previousMonth);

    //aggregate fuction is same as stream pipeline
    try{
        const income = await Order.aggregate([
            //1st pipeline(find all the order of this month)
            { $match: { createdAt: { $gte: previousMonth } } },
            //2nd pipeline(make array of abject of month and ammount)
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount"
                },
            },
            //3rd pipeline(for the same month total the amount 
            //same as group by function of mysql)
            {
                $group: {
                    _id: "$month",
                    total: {$sum: "$sales"}
                }
            }
        ]);
        console.log(income);
        res.status(200).json(income)
    }catch(err){
        res.status(500).json(err);
    }
})


module.exports = router