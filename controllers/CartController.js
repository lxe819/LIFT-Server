const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
const isStockAvailable = require("../helpers/checkStock"); 
const isUser = require("../helpers/isUser"); 

/**************************************************************
CREATE a cart item 
**************************************************************/
router.post("/", isUser, isStockAvailable, async (req, res) => {
    const { name, price, quantity, size, user_id, product_id, image } = req.body; 

    try {

        // Check whether the same product has been carted
        const productExist = await pool.query("SELECT * FROM carted WHERE product_id = $1 AND user_id = $2 AND product_size = $3", [product_id, user_id, size]); 
        if (productExist.rows.length === 0){
            const product = await pool.query("INSERT INTO carted (product_name, unit_price, quantity, product_size, user_id, product_id, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [name, price, quantity, size, user_id, product_id, image]); 
            res.json({
                message: "Item carted!", 
                itemCarted: product.rows
            }); 
        } else {
            const existingQty = productExist.rows[0].quantity; 
            const updateProduct = await pool.query("UPDATE carted SET quantity = $1, last_edit = $2 WHERE product_id = $3 AND user_id = $4 AND product_size = $5 RETURNING *", [existingQty + quantity, new Date(), product_id, user_id, size]); 
            res.json({
                message: "Updated existing item in cart.", 
                itemCarted: updateProduct.rows
            })
        }

        
    } catch (error) {
        console.error(error.message); 
        res.json({message: error})
    }
}); 

/**************************************************************
UPDATE a cart item  //* On indiv product page, must ensure got params using id
**************************************************************/
router.put("/:id", isStockAvailable, async (req, res) => {
    const { id } = req.params; 
    const { quantity } = req.body; 

    try {
        // const product = await pool.query("UPDATE carted SET quantity = $1, product_size = $2 WHERE user_id = $3 AND product_name = $4", [quantity, size, user_id, name]); 

        //? new Date() timing looks different from DB's TIMESTAMP format in DB, but when printed in Insomnia, they're the same format...
        const product = await pool.query("UPDATE carted SET quantity = $1, last_edit = $2 WHERE cart_id = $3 RETURNING *", [quantity, new Date(), id]); 
        res.json({ 
            message: "Carted item updated!", 
            cartedItem: product.rows
        })
    } catch (error) {
        console.error(error.message); 
        res.json({ message: error.message }); 
    }
}); 

/**************************************************************
DELETE a cart item  
**************************************************************/
router.delete("/:id", async (req, res) => {
    const { id } = req.params; 

    try {
        const product = await pool.query("DELETE FROM carted WHERE cart_id = $1 RETURNING *", [id]); 
        res.json({ 
            message: "Cart item deleted.", 
            "Cart Item Deleted": product.rows 
        })

    } catch (error) {
        console.error(error.message); 
        res.json({ message: error }); 
    }
}); 

/**************************************************************
INDEX route - READ all cart items
**************************************************************/
router.get("/", isUser, async (req, res) => {
    const bearer = req.get("Authorization"); 
    const token = bearer.split(" ")[1]; 
    const payload = jwt.verify(token, SECRET_KEY); 
    const user_id = payload.user_id; 
    try {
        const allItems = await pool.query("SELECT * FROM carted WHERE user_id = $1 ORDER BY carted_on", [user_id]); 
        res.json({ items: allItems.rows }); 
    } catch (error) {
        console.error(error.message); 
        res.json({ message: error }); 
    }
})

module.exports = router; 



//* Not sure if this was the problem leading to null value for items without sizing (CREATION of cart item)
// router.post("/", isUser, isStockAvailable, async (req, res) => {
//     const { name, price, quantity, user_id, product_id, image } = req.body; 

//     try {

//         // Check whether the same product has been carted
//         const productExist = await pool.query("SELECT * FROM carted WHERE product_id = $1 AND user_id = $2 AND product_size = $3", [product_id, user_id, size]); 
//         if (!req.body.size){
//             if (productExist.rows.length === 0){
//                 const product = await pool.query("INSERT INTO carted (product_name, unit_price, quantity, user_id, product_id, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [name, price, quantity, user_id, product_id, image]); 
//                 res.json({
//                     message: "Item carted!", 
//                     itemCarted: product.rows
//                 }); 
//             } else {
//                 const existingQty = productExist.rows[0].quantity; 
//                 const updateProduct = await pool.query("UPDATE carted SET quantity = $1, last_edit = $2 WHERE product_id = $3 AND user_id = $4 RETURNING *", [existingQty + quantity, new Date(), product_id, user_id]); 
//                 res.json({
//                     message: "Updated existing item in cart.", 
//                     itemCarted: updateProduct.rows
//                 })
//             }
//         } else if (productExist.rows.length === 0){
//             const { size } = req.body; 
//             const product = await pool.query("INSERT INTO carted (product_name, unit_price, quantity, product_size, user_id, product_id, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [name, price, quantity, size, user_id, product_id, image]); 
//             res.json({
//                 message: "Item carted!", 
//                 itemCarted: product.rows
//             }); 
//         } else {
//             const { size } = req.body; 
//             const existingQty = productExist.rows[0].quantity; 
//             const updateProduct = await pool.query("UPDATE carted SET quantity = $1, last_edit = $2 WHERE product_id = $3 AND user_id = $4 AND product_size = $5 RETURNING *", [existingQty + quantity, new Date(), product_id, user_id, size]); 
//             res.json({
//                 message: "Updated existing item in cart.", 
//                 itemCarted: updateProduct.rows
//             })
//         }

        
//     } catch (error) {
//         console.error(error.message); 
//         res.json({message: error})
//     }
// }); 