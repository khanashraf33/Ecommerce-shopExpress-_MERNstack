
const Product = require("../models/Product");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");


const router = require("express").Router();



//create

router.post("/",verifyTokenAndAdmin,async (req,res)=> {
    console.log(req.body);
    const newProduct = new Product(req.body)
    console.log("hii");
    console.log(newProduct);
    try{
        const savedProduct = await newProduct.save();
        console.log(savedProduct);
        res.status(200).json(savedProduct);
    }catch(err){
        res.status(500).json(err)
    }
})


//update
router.put("/:id", verifyTokenAndAdmin, async (req,res) =>{
    console.log(req.params.id);
    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{
            $set: req.body
        },{new:true})
        //if we dont write {new:true}) it do give the updated user
        res.status(200).json(updatedProduct);
    }catch(err){
        res.status(500).json(err);
     }
})


//Delete user

router.delete("/:id", verifyTokenAndAdmin, async (req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted....")
    }catch(err){
        res.status(500).json(err);
    }
})

//get product

router.get("/find/:id", async (req,res)=>{
    try{
        console.log("hellllow");
        const product = await Product.findById(req.params.id)
        res.status(200).json(product);
    }catch(err){
        res.status(500).json(err);
    }
})


//get ALL PRODUCT

router.get("/",  async (req,res)=>{
    const qNew = req.query.new;
    const qCategory = req.query.category;
    console.log(qNew);
    console.log(qCategory);
    try{
        let products;

        if(qNew) {
            products = await Product.find().sort({ createdAt: -1}).limit(5);
        }else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                }
            });
            console.log(products);
        }else{
            products = await Product.find();
            console.log(products);
        }




        res.status(200).json(products);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router