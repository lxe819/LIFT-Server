const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

/**************************************************************
CREATE a wish item
**************************************************************/
router.get("/gymx", async (req, res) => {
    const bearer = req.get("Authorization"); 
    const token = bearer.split(" ")[1]; 
    const payload = jwt.verify(token, SECRET_KEY); 
    const user_id = payload.user_id; 

    try {
        const pdtsOfInterest = await pool.query("SELECT u.user_id, u.gym_exp_level, p.product_name, p.product_id, p.images, p.short_desc, p.unit_price, p.sizing FROM users u JOIN productGymExpTag pgxt USING (gym_exp_level) JOIN products p USING (product_id) WHERE u.user_id = $1", [user_id]); 
        res.json({ productsOfInterest: pdtsOfInterest.rows }); 
    } catch (error) {
        console.error(error.message); 
        res.json({message: error}); 
    }
}); 

module.exports = router; 