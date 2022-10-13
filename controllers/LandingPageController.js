const express = require("express");
const router = express.Router();
const pool = require("../db");

/**************************************************************
INDEX route - READ all products with display_tag "Featured" | "Popular" | "New"
(Querying ARRAY[]) && 
INDEX route - READ all categories
**************************************************************/
router.get("/", async (req, res) => {
    try {
        const featuredItems = await pool.query("SELECT * FROM products WHERE 'Featured' = ANY(display_tag)"); 
        const newItems = await pool.query("SELECT * FROM products WHERE 'New' = ANY(display_tag)"); 
        const popularItems = await pool.query("SELECT * FROM products WHERE 'Popular' = ANY(display_tag)"); 
        const categories = await pool.query("SELECT * FROM categories"); 
        
        res.json({ categories: categories.rows, featuredItems: featuredItems.rows, newItems: newItems.rows, popularItems: popularItems.rows }); 
    } catch (error) {
        console.error(error.message); 
        res.json({message: error}); 
    }
})

module.exports = router; 