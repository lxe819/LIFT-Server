const express = require("express");
const router = express.Router();
const pool = require("../db");

/**************************************************************
INDEX route - READ all products for selected category
**************************************************************/
router.get("/category/:category_id", async (req, res) => {
    try {
        const { category_id } = req.params; 
        const products = await pool.query("SELECT p.product_id, p.product_name, p.images, p.short_desc, p.unit_price,  p.sizing, c.category_id, c.category_name FROM products p JOIN categories c USING (category_id) WHERE category_id = $1", [category_id]); 
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


/**************************************************************
INDEX route - READ all products with category name 
(Inner Join products x categories)
**************************************************************/
router.get("/categoryname", async (req, res) => {
    try {
        const allProducts = await pool.query("SELECT p.product_id, p.product_name, p.images, p.short_desc, p.unit_price, p.sizing, c.category_name FROM products p JOIN categories c USING (category_id) ORDER BY product_id"); 
        res.json({allProducts: allProducts.rows}); 
    } catch (error) {
        console.error(error.message); 
        res.json({message: error})
    }
})


/**************************************************************
INDEX route - READ all products with display_tag "Featured" | "Popular" | "New"
(Querying ARRAY[])
**************************************************************/
router.get("/displaytag", async (req, res) => {
    try {
        const featuredItems = await pool.query("SELECT * FROM products WHERE 'Featured' = ANY(display_tag)"); 
        const newItems = await pool.query("SELECT * FROM products WHERE 'New' = ANY(display_tag)"); 
        const popularItems = await pool.query("SELECT * FROM products WHERE 'Popular' = ANY(display_tag)"); 
        res.json({ featuredItems: featuredItems.rows, newItems: newItems.rows, popularItems: popularItems.rows }); 
    } catch (error) {
        console.error(error.message); 
        res.json({message: error}); 
    }
})

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