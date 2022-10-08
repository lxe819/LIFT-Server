const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
const isStockAvailable = require("../helpers/checkStock"); 

/**************************************************************
CREATE a purchase 
**************************************************************/


router.post("/", isStockAvailable, async (req, res) => {
    const { name, price, quantity, size, user_id } = req.body; 
    try {
        const purchasedItem = await pool.query("INSERT INTO purchases (product_name, unit_price, quantity, product_size, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *", [name, price, quantity, size, user_id]); 

        // Find stock number: 
        const product_stock = await pool.query("SELECT stock FROM products WHERE product_name = $1", [name]); 
        const stockNum = product_stock.rows[0].stock; 

        // Deduct from stock
        const deductStock = await pool.query("UPDATE products SET stock = $1 WHERE product_name = $2", [stockNum - quantity, name])

        res.json({
            message: "Item added!", 
            item: purchasedItem.rows
        })
    } catch (error) {
        console.error(error.message); 
        res.json({message: error})
    }
})


//* INDEX route (For Purchase History / Order Confirmed Summary page)
router.get("/", async (req, res) => {
    const { id } = req.body; 
    const purchases = await pool.query("SELECT * FROM purchases WHERE user_id = $1", [id]); 
    res.json(purchases.rows); 
})

module.exports = router; 