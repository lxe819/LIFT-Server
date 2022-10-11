const express = require("express"); 
const app = express(); 
const cors = require("cors"); 
require("dotenv").config(); 
const pool = require("./db"); 
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");

const UserController = require("./controllers/UserController"); 
const PurchaseController = require("./controllers/PurchaseController"); 
const CartController = require("./controllers/CartController"); 
const CategoriesController = require("./controllers/CategoriesController"); 
const ProductsController = require("./controllers/ProductsController"); 
const StocksController = require("./controllers/StocksController"); 

const PORT = process.env.PORT; 
const SECRET_KEY = process.env.SECRET_KEY; 


app.use(cors()); 
app.use(express.json()); 
app.use("/users", UserController); 
app.use("/purchases", PurchaseController); 
app.use("/cart", CartController); 
app.use("/categories", CategoriesController); 
app.use("/products", ProductsController); 
app.use("/stocks", StocksController); 


app.get("/", async (req, res) => {
    res.send("Hello")
}); 

/**************************************************************
LOGIN route
**************************************************************/
app.post("/login", async (req, res) => {
    const { username, password } = req.body; 

    try {
        const data = await pool.query("SELECT * FROM users WHERE username = $1", [username]); 
        if (data.rows.length === 0){
            res.json({ message: "User does not exist." }); 
        } else {
            const result = bcrypt.compareSync(password, data.rows[0].password); 
            if (result){
                const { user_id, username, email, admin } = data.rows[0]; 
                const payload = { user_id, username, email, admin }; 
                const token = jwt.sign(payload, SECRET_KEY); 
                res.json({
                    message: "Signed in!", 
                    token: token
                })
            } else {
                res.json({ message: "Incorrect password." }); 
            }
        }
        
    } catch (error) {
        console.error(error.message); 
        res.json({message: error})
    }
})


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})