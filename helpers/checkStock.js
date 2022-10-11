const express = require("express");
const pool = require("../db");
require("dotenv").config();


const isStockAvailable = async (req, res, next) => {
    const { product_id, quantity, size } = req.body; 

    if (!size){
        try {
            const product_stock = await pool.query("SELECT s.stock_qty FROM stocks s JOIN products p USING (product_id) WHERE product_id = $1", [product_id]); 
            const stockNum = product_stock.rows[0]["stock_qty"]; 
    
            if (stockNum - quantity >= 0){
                next(); 
            } else {
                res.json({ message: `Current stock: ${stockNum}, your selection: ${quantity}` })
            }

        } catch (error) {
            console.error(error.message); 
            res.json({ message: error }); 
        }
    } else {
        try {
            const product_stock = await pool.query("SELECT s.stock_qty FROM stocks s JOIN products p USING (product_id) WHERE product_id = $1 AND stock_size = $2", [product_id, size]); 
            const stockNum = product_stock.rows[0]["stock_qty"]; 
            if (stockNum - quantity >= 0){
                next(); 
            } else {
                // res.json({message: stockNum}); 
                res.json({ message: `Sorry, the stock is currently at ${stockNum}, but you're purchasing ${quantity} of it.`}); 
            }
        } catch (error) {
            console.error(error.message); 
            res.json({ message: error }); 
        }
    }



    // if (!size){
    //     try {
    //         const product_stock = await pool.query("SELECT stock_qty ->> $1 FROM products WHERE product_id = $2", ["freeSize", product_id]); 
    //         const stockNum = Object.values(product_stock.rows[0])[0]; 
    
    //         if (parseInt(stockNum) - quantity >= 0){
    //             next(); 
    //         } else {
    //             res.json({ message: `Current stock: ${stockNum}, your selection: ${quantity}` })
    //         }

    //     } catch (error) {
    //         console.error(error.message); 
    //         res.json({ message: error }); 
    //     }
    // } else {
    //     try {
    //         const product_stock = await pool.query("SELECT stock_qty ->> $1 FROM products WHERE product_id = $2", [size, product_id]); 
    //         const stockNum = Object.values(product_stock.rows[0])[0]; 
    //         if (parseInt(stockNum) - quantity >= 0){
    //             next(); 
    //         } else {
    //             // res.json({message: stockNum}); 
    //             res.json({ message: `Sorry, the stock is currently at ${stockNum}, but you're purchasing ${quantity} of it.`}); 
    //         }
    //     } catch (error) {
    //         console.error(error.message); 
    //         res.json({ message: error }); 
    //     }
    // }
}


module.exports = isStockAvailable; 

