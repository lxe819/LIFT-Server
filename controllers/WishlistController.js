const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

/**************************************************************
CREATE a wish item
**************************************************************/
router.post("/user", async (req, res) => {
    // const bearer = req.get("Authorization"); 
    // const token = bearer.split(" ")[1]; 
    // const payload = jwt.verify(token, SECRET_KEY); 
    // const user_id = payload.user_id; 
    const { product_id, user_id } = req.body; 

    const checkWishItemExist = await pool.query("SELECT * FROM wishlist WHERE user_id = $1 AND product_id = $2", [user_id, product_id]); 

    if (checkWishItemExist.rows.length === 0){
        try {
            const wishItem = await pool.query("INSERT INTO wishlist (product_id, user_id) VALUES ($1, $2) RETURNING *", [product_id, user_id]); 
            res.json({ message: "Added to wishlist!", wishItem: wishItem.rows })
    
        } catch (error) {
            console.error(error.message); 
            res.json({message: error})
        }
    } else {
        res.json({ message: "Wish item already exists."})
    }

}); 

/**************************************************************
DELETE a wish item
**************************************************************/
router.delete("/user/:product_id", async (req, res) => {
    const { product_id } = req.params; 
    const bearer = req.get("Authorization"); 
    const token = bearer.split(" ")[1]; 
    const payload = jwt.verify(token, SECRET_KEY); 
    const user_id = payload.user_id; 

    try {
        const deleteWish = await pool.query("DELETE FROM wishlist WHERE product_id = $1 AND user_id = $2 RETURNING *", [product_id, user_id]); 
        res.json({ message: "Deleted wish item", deleteWish: deleteWish.rows})
    } catch (error) {
        console.error(error.message); 
        res.json({message: error})
    }


})

/**************************************************************
CHECK for a wish item
**************************************************************/
router.get("/user/:product_id", async (req, res) => {
    const { product_id } = req.params; 
    // const { user_id } = req.body; 
    const bearer = req.get("Authorization"); 
    const token = bearer.split(" ")[1]; 
    const payload = jwt.verify(token, SECRET_KEY); 
    const user_id = payload.user_id; 

    try {
        const wishItem = await pool.query("SELECT * FROM wishlist WHERE user_id = $1 AND product_id = $2", [user_id, product_id]); 
        
        if (wishItem.rows.length === 0){
            res.json({ message: "No item" }); 
        } else {
            res.json({ message: "Wish item exists" }); 
        }

    } catch (error) {
        console.error(error.message); 
        res.json({message: error})
    }
})

/**************************************************************
INDEX route for wishlist for THAT user
**************************************************************/
router.get("/user", async (req, res) => {
    const bearer = req.get("Authorization"); 
    const token = bearer.split(" ")[1]; 
    const payload = jwt.verify(token, SECRET_KEY); 
    const user_id = payload.user_id; 

    try {
        const allWishes = await pool.query("SELECT w.wish_id, w.product_id, p.product_name, p.images, p.unit_price, p.sizing FROM wishlist w JOIN products p USING (product_id) WHERE user_id = $1", [user_id]); 
        res.json({ wishlist: allWishes.rows });
        
    } catch (error) {
        console.error(error.message); 
        res.json({message: error})
    }
}); 

module.exports = router; 