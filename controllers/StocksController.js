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
UPDATE route - update one stock_qty
**************************************************************/


module.exports = router; 