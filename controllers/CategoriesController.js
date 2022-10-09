const express = require("express");
const router = express.Router();
const pool = require("../db");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const SECRET_KEY = process.env.SECRET_KEY;
// const isStockAvailable = require("../helpers/checkStock"); 

/**************************************************************
CREATE a purchase 
**************************************************************/


/**************************************************************
INDEX route - READ all categories
**************************************************************/
router.get("/", async (req, res) => {
    try {
        const categories = await pool.query("SELECT * FROM categories"); 
        res.json({ categories: categories.rows})
    } catch (error) {
        console.error(error.message); 
        res.json({message: error})
    }
}); 


module.exports = router; 