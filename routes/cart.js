const router = require("express").Router()
const products = require("../models/products")
const {verifyToken, verifyAuth, verifyTokenAdmin} = require("./verifyToken")

//@add product to cart     post
router.post("/", verifyToken , async(req, res)=>{
    const newcart = new Cart(req.body)

    try {
        const savedCart = await newcart.save()
        res.status(200).json(savedCart)   
    } catch (error) {
        res.status(500).json(error.message)
    }
})


//UPDATE product in cart
router.put("/:id", verifyAuth, async (req, res) => {
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        { $set: req.body, },
        { new: true }
      );
      res.status(200).json(updatedCart);
    } catch (err) {
      res.status(500).json(err);
    }
});
  

//DELETE product from cart
router.delete("/:id", verifyAuth, async (req, res) => {
    try {
      await Cart.findByIdAndDelete(req.params.id);
      res.status(200).json("Cart has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
});
  

//GET USER CART
router.get("/find/:userId", verifyAuth, async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId });
      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json(err);
    }
});
  

// //GET ALL  
router.get("/", verifyTokenAdmin, async (req, res) => {
    try {
      const carts = await Cart.find();
      res.status(200).json(carts);
    } catch (err) {
      res.status(500).json(err);
    }
});


module.exports = router 