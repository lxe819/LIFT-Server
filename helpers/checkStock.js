const express = require("express");
const pool = require("../db");
require("dotenv").config();

const isStockAvailable = async (req, res, next) => {
    const { name, quantity } = req.body; 

    try {
        const product_stock = await pool.query("SELECT stock FROM products WHERE product_name = $1", [name]); 
        const stockNum = product_stock.rows[0].stock; 
        if (stockNum - quantity >= 0){
            next(); 
        } else {
            // res.json({message: stockNum}); 
            res.json({ message: `Sorry, the stock is currently at ${stockNum}, but you're purchasing ${quantity} of it.`}); 
        }
    } catch (error) {
        console.error(error.message); 
        res.json({ message: error })
    }
}; 

module.exports = isStockAvailable; 