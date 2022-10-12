const express = require("express");
const router = express.Router();
const pool = require("../db");

/**************************************************************
INDEX route - READ stock_qty of ALL products
**************************************************************/
router.get("/", async (req, res) => {
    try {
        const stocks = await pool.query("SELECT * FROM stocks"); 
        res.json({ stocks: stocks.rows }); 
    } catch (error) {
        console.error(error.message); 
        res.json({message: error})
    }
}); 

/**************************************************************
INDEX route - READ stock_qty of ALL products
**************************************************************/
router.get("/productname", async (req, res) => {
    try {
        const stocks = await pool.query("SELECT s.stock_id, s.product_id, p.product_name, s.stock_size, s.stock_qty FROM stocks s JOIN products p USING (product_id) ORDER BY product_id"); 
        res.json({ stocks: stocks.rows}); 
    } catch (error) {
        console.error(error.message); 
        res.json({message: error})
    }
})

/**************************************************************
UPDATE route - update one stock_qty
**************************************************************/


module.exports = router; 