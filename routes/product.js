const router = require("express").Router()
const products = require("../models/products")
const { verifyToken, verifyTokenAdmin, verifyAuth } = require("./verifyToken")


//@create product     POST
router.post("/create", verifyTokenAdmin, async(req, res)=>{
    const newProduct = new products(req.body)
    try {
        const savedProduct = await newProduct.save()
        return res.status(200).json(savedProduct)   
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
})

//@update product    PUT
router.put("/:id", verifyTokenAdmin, async (req, res)=>{
    try {
        const updatedProduct = await products.findByIdAndUpdate(
            req.params.id,
            { $set: req.body, },
            { new: true}
        )
        return res.status(200).json(updatedProduct)   
    } catch (error) {
        res.status(200).json(error.message)
    }
})

//DELETE
router.delete("/:id", verifyTokenAdmin, async (req, res) => {
    try {
      await products.findByIdAndDelete(req.params.id);
      res.status(200).json("Product has been deleted...");
    } catch (error) {
      res.status(500).json(error.message);
    }
  });


//@get product by id       GET
router.get("/find/:id", async(req, res)=>{
    try {
        const product = await products.findById(req.params.id)
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

//urls:   localhost:5000/product?category=man      localhost:5000/product?new=true
//GET ALL PRODUCTS      GET
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
      let Product;
  
      if (qNew) {
        Product = await products.find().sort({ createdAt: -1 }).limit(1);
      } else if (qCategory) {
        Product = await products.find({
          categories: {
            $in: [qCategory],
          },
        });
      } else {
        Product = await products.find();
      }
  
      res.status(200).json(Product);
    } catch (error) {
      res.status(500).json(error.message);
    }
  });



module.exports = router