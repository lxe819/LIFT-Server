const express = require("express");
const router = express.Router();
const pool = require("../db");

/**************************************************************
INDEX route - READ all products for selected category
**************************************************************/
router.get("/category/:category_id", async (req, res) => {
    try {
        const { category_id } = req.params; 
        const products = await pool.query("SELECT * FROM products WHERE category_id = $1", [category_id]); 
        res.json({ products: products.rows }); 
        
    } catch (error) {
        console.error(error.message); 
        res.json({message: error})
    }
}); 

/**************************************************************
SHOW route - READ one product
**************************************************************/

// Testing out INNER JOIN table (products x stocks USING (product_id))
router.get("/product/:product_id", async (req, res) => {
    try {
        const { product_id } = req.params; 
        const product = await pool.query("SELECT s.product_id, s.stock_size, s.stock_qty, p.product_name, p.images, p.short_desc, p.unit_price, p.sizing FROM stocks s JOIN products p USING (product_id) WHERE product_id = $1", [product_id]); 
        res.json({ item: product.rows }); 
        // res.send(product.rows[0]); 
    } catch (error) {
        console.error(error.message); 
        res.json({message: error})
    }
}); 

/**************************************************************
INDEX route - READ all products' stock_qty
**************************************************************/
router.get("/", async (req, res) => {
    try {
        const allProductsStock = await pool.query("SELECT product_id, product_name, stock_qty FROM products ORDER BY product_id"); 
        res.json({ products: allProductsStock.rows})
    } catch (error) {
        console.error(error.message); 
        res.json({message: error})
    }
}); 


module.exports = router; 

/**************************************************************
SHOW route - READ one product (V1)
**************************************************************/
// router.get("/product/:product_id", async (req, res) => {
//     try {
//         const { product_id } = req.params; 
//         const product = await pool.query("SELECT * FROM products WHERE product_id = $1", [product_id]); 
//         res.json({ product: product.rows[0] }); 
//     } catch (error) {
//         console.error(error.message); 
//         res.json({message: error})
//     }
// }); 