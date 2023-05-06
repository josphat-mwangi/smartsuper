const router = require("express").Router();
const multer = require('multer');
// const {categoryValidation} =  require('../validation/categoryValidation');
// const {postValidation} =  require('../validation/postValidation');
const Product = require("../models/product");
const Cartegory = require("../models/category")



const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/')
    },

    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
});

const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype==='image/jpg' || file.mimetype==='image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});









router.post("/payment", async(req, res)=>{
    try {
        const data ={
            "email": req.body.email, 
            "amount": req.body.amount,
            "currency": "KES"
        }
        const response = await fetch("https://api.budpay.com/api/v2/transaction/initialize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer sk_live_cswltnqwc2rp7dedhblxpxmuoaz880jgqmi92dz"
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        res.json(result);
    } catch (error) {
       res.json({
            msg: error
       })
    }
})
router.get("/allproducts", async(req, res)=>{
    try{
        const product = await Product.find()
        if(product.length === 0){
            return res.json({
                status: "Successful",
                statusCode: 200,
                message: "No product yet"
            })
        }
        return res.json({
            status: "Successful",
            statusCode: 200,
            message: product
        })
    }catch(err){
        return res.json({
            status: "failed",
            statusCode: 404,
            message: err
        })
    }
});


//getting single product
router.get("/getproduct", async(req, res)=>{
    try{
        const product = await Product.findById(req.params.productId);
        return res.json({
            status: "Successful",
            statusCode: 200,
            message: product
        })
    }catch(err){
        if (err instanceof mongoose.CastError){
            res.status(400).json({
                msg: 'Invalid Product Id'
            })
        }
        res.status(400).json({
            msg: err
        })
    }
});


router.post("/product",   async(req, res)=>{
    // console.log(req.body)
    // //validating user inputs
    // const {error} = postValidation(req.body);

    // // if error exists then send back error
    // if(error){
    //     return  res.json({
    //         status: "Failed",
    //         statusCode: 400,
    //         message: error.details[0].message
    //     })
    // }

    // const owner = req.user.user_id
    const newProduct = new Product({
        ...req.body,
    })

    try{
        const saveProduct = await newProduct.save();
        res.json({
            status: "Successful",
            statusCode: 200,
            message: "Product Added successfully"
        })
    }catch(err){
        res.json({
            status: "Failed",
            statusCode: 400,
            message: err
        })
    }

});

router.get("/allCategory", async(req, res)=>{
    try{
        const category = await Cartegory.find();
        if(category.length === 0){
            return res.json({
                status: "Successful",
                statusCode: 200,
                message: "No category yet"
            })
        }
        return res.json({
            status: "Successful",
            statusCode: 200,
            message: category
        })
    }catch(err){
        return res.json({
            status: "failed",
            statusCode: 404,
            message: err
        })
    }
    
});

//getting a specific category
router.get("/category/:cartegoryId", async(req, res)=>{
    try{
        const category = await Cartegory.findById(req.params.cartegoryId);
        return res.json({
            status: "Successful",
            statusCode: 200,
            message: category
        })
    }catch(err){
        if (err instanceof mongoose.CastError){
            res.status(400).json({
                msg: 'Invalid category Id'
            })
        }
        return res.json({
            status: "failed",
            statusCode: 404,
            message: err
        })
    }
});

//deleting category
router.delete("/category/:cartegoryId", async(req, res)=>{
    try{
        const cartegoryRemove = await Cartegory.deleteOne({
            _id: req.params.cartegoryId
        });
        return res.json({
            status: "Successful",
            statusCode: 200,
            message:cartegoryRemove
        });
    }catch(err){
        return res.json({
            status: "Failed",
            statusCode: 400,
            message: err
        })
    }
});

//updating cartegory
router.patch("/category/:categoryId", async(req, res)=>{
    try{
        const {error} = categoryValidation(req.body)
        if(error){
            return  res.json({
                status: "Failed",
                statusCode: 400,
                message: error.details[0].message
            })
            
        }
        const categoryName = await Cartegory.findOne({name:req.body.name});
        // if cartegory name exist then return 
        if(categoryName){ 
            return  res.json({
                status: "Failed",
                statusCode: 400,
                message:"Category name already exists"
            })
        }
        const updateCartegory = await Cartegory.updateOne({
            _id: req.params.cartegoryId
        }, {$set: {name: req.body.name}});
        return res.json({
            status: "Successful",
            statusCode: 200,
            message:updateCartegory
        })
    }catch(err){
        res.json({
            status: "Failed",
            statusCode: 400,
            message: err
        })
    }
});

//post cartegory
router.post("/addCategory", async(req, res)=>{
    //validating user inputs
    // const {error} = categoryValidation(req.body)
    // // if error exists then send back error
    // if(error){
    //     return  res.json({
    //         status: "Failed",
    //         statusCode: 400,
    //         message: error.details[0].message
    //     })
        
    // }

    const categoryName = await Cartegory.findOne({name:req.body.name});
    // if cartegory name exist then return 
    if(categoryName){ 
        return  res.json({
            status: "Failed",
            statusCode: 400,
            message:"Category name already exists"
        })
    }

    // const owner = req.user.user_id
    const category = new Cartegory({
        name: req.body.name
    })

    const savedCategory = await category.save();
    try{
        res.json({
            status: "successful",
            statusCode: 200,
            message:  "Category added successfully"
        });
    }catch(err){
        res.json({
            status: "Failed",
            statusCode: 400,
            message: err
        })
    }  
});



module.exports = router;