const express = require('express')
const productModel = require('../model/product')
const checkAuth = require('../middleware/check-auth')
const router = express.Router()

// get products
router.get("/", (req, res) => {

    productModel
        .find()
        .then(products => {
            res.json({
                msg : "get products",
                count : products.length,
                productInfo : products.map(product => {
                    return{
                        id : product._id,
                        name : product.name,
                        price : product.price,
                        data : product.createdAt
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

// detail product
router.get("/:productId", checkAuth, (req, res) => {

    const id = req.params.productId

    productModel
        .findById(id)
        .then(product => {
            if(!product){
                return res.status(404).json({
                    msg : "no product id"
                })
            }
            res.json({
                msg : "get product",
                productInfo : {
                    id : product._id,
                    name : product.name,
                    price : product.price,
                    data : product.createdAt
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

// register product
router.post("/", checkAuth, (req, res) => {

    const newProduct = new productModel(
        {
            name : req.body.productName,
            price :req.body.productPrice
        }
    )

    newProduct
        .save()
        .then(product => {
            res.json({
                msg : "register product",
                productInfo : product
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

// update product
router.patch("/:productId", checkAuth, (req, res) => {

    const id = req.params.productId

    const updateOps = {}

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }

    productModel
        .findByIdAndUpdate(id, {$set : updateOps})
        .then((product) => {
            if(!product){
                return res.status(404).json({
                    msg : "no product id"
                })
            }
            res.json({
                msg : "update product by " + id
            })
        })
        .catch(err => {
            res.status(500).json({
                mssg : err.message
            })
        })
})

// delete products
router.delete("/", checkAuth, (req, res) => {

    productModel
        .remove()
        .then(() => {
            res.json({
                msg : "delete products",
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

// detail delete product
router.delete("/:productId", checkAuth, (req, res) => {

    const id = req.params.productId

    productModel
        .findByIdAndRemove(id)
        .then((product) => {
            if(!product){
                return res.status(404).json({
                    msg : "no product id"
                })
            }
            res.json({
                msg : "delete product by " + id
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

module.exports = router