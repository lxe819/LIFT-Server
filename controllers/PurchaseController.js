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
    const { name, price, quantity, size, user_id, product_id, image, cart_id } = req.body;  
    //! Remember to take in the CART_ID as well!!
    
    if (size){
        try {
            const purchasedItem = await pool.query("INSERT INTO purchases (product_name, unit_price, quantity, product_size, user_id, product_id, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [name, price, quantity, size, user_id, product_id, image]); 

            // Find current stock QTY 
            const currentStockDB = await pool.query("SELECT stock_qty FROM stocks WHERE product_id = $1 AND stock_size = $2", [product_id, size]); 
            const currentStock = currentStockDB.rows[0]["stock_qty"]; 

            // Deduct purchased QTY from stock QTY
            const updateStock = await pool.query("UPDATE stocks SET stock_qty = $1 WHERE product_id = $2 AND stock_size = $3 RETURNING *", [currentStock - quantity, product_id, size]); 

            // Delete item from carted table
            const deleteCartItem = await pool.query("DELETE FROM carted WHERE cart_id = $1 RETURNING *", [cart_id]); 

            res.json({
                message: "Successfully created purchase item, updated stock, and deleted cart item!", 
                purchasedItem: purchasedItem.rows[0], 
                updatedStock: updateStock.rows[0], 
                deletedCartItem: deleteCartItem.rows[0]
            }); 

        } catch (error) {
            console.error(error.message); 
            res.json({ message: error }); 
        }
    } else {
        try {
            const purchasedItem = await pool.query("INSERT INTO purchases (product_name, unit_price, quantity, user_id, product_id, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [name, price, quantity, user_id, product_id, image]); 

            // Find current stock QTY 
            const currentStockDB = await pool.query("SELECT stock_qty FROM stocks WHERE product_id = $1", [product_id]); 
            const currentStock = currentStockDB.rows[0]["stock_qty"]; 

            // Deduct purchased QTY from stock QTY
            const updateStock = await pool.query("UPDATE stocks SET stock_qty = $1 WHERE product_id = $2 RETURNING *", [currentStock - quantity, product_id]); 

            // Delete item from carted table
            const deleteCartItem = await pool.query("DELETE FROM carted WHERE cart_id = $1 RETURNING *", [cart_id]); 

            res.json({
                message: "Successfully created purchase item, updated stock, and deleted cart item!", 
                purchasedItem: purchasedItem.rows[0], 
                updatedStock: updateStock.rows[0], 
                deletedCartItem: deleteCartItem.rows[0]
            }); 

        } catch (error) {
            console.error(error.message); 
            res.json({ message: error }); 
        }
    }
})



// router.post("/", isStockAvailable, async (req, res) => {
//     const { name, price, quantity, size, user_id, product_id, image, updatedStockQty } = req.body;   
//     //! Include product_id & image on FRONTEND!!
//     //! updatedStockQty will require frontend fetch from server to retrieve & change (means I do the Math in frontend then just send data to backend to store.)
//     //? Simon's advice is to do the manipulation in server side, i.e. deduct QTY from stock_qty here. 
    
//     try {
//         const purchasedItem = await pool.query("INSERT INTO purchases (product_name, unit_price, quantity, product_size, user_id, product_id, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [name, price, quantity, size, user_id, product_id, image]); 

//         // Deduction of purchase qty from stock_qty done in frontend, passed to backend to store new value. 
//         const updatedStock = await pool.query("UPDATE products SET stock_qty = $1 WHERE product_id = $2", [JSON.stringify(updatedStockQty), product_id]); 


//         // //* Find stock number: 
//         // const product_stock = await pool.query("SELECT stock_qty ->> $1 FROM products WHERE product_id = $2", [size, product_id]); 
//         // const stockNum = product_stock.rows[0]["?column?"]; 

//         // //* Deduct from stock
//         // const deductStock = await pool.query("UPDATE products SET stock_qty = JSONB_SET(stock_qty, '{ $1 }', '$2') WHERE product_id = $3", [size, parseInt(stockNum) - quantity, product_id])

//         res.json({
//             message: "Item added!", 
//             item: purchasedItem.rows
//         })
//     } catch (error) {
//         console.error(error.message); 
//         res.json({message: error});
//     }
// })


//* INDEX route (For Purchase History / Order Confirmed Summary page)
router.get("/", async (req, res) => {
    // const { id } = req.body; 
    const bearer = req.get("Authorization"); 
    const token = bearer.split(" ")[1]; 
    const payload = jwt.verify(token, SECRET_KEY); 
    const user_id = payload.user_id; 

    try {
        const purchases = await pool.query("SELECT * FROM purchases WHERE user_id = $1 ORDER BY purchased_on DESC", [user_id]); 
        res.json({purchases: purchases.rows}); 
        
    } catch (error) {
        console.error(error.message); 
        res.json({ message: error }); 
    }

})

module.exports = router; 