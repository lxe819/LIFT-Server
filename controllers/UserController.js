const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

/**************************************************************
CREATE a user (SIGN-UP)
**************************************************************/
router.post("/", async (req, res) => {
    const { username, email, password } = req.body; 
    const usernameData = await pool.query("SELECT * FROM users WHERE username = $1", [username]); 
    const emailData = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (usernameData.rows.length !== 0){
        res.json({ message: "Username already exists."}); 
    } else if (emailData.rows.length !== 0) {
        res.json({ message: "Email already exists."});
    } else {
        const encryptedPw = bcrypt.hashSync(password, 10); 
        const newUser = pool.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *", [username, email, encryptedPw]); 
        const payload = { username, email, isAdmin: false}
        const token = jwt.sign(payload, SECRET_KEY); 

        res.json({
            message: "User added!", 
            token: token, 
            user: newUser
        })
    }
}); 


module.exports = router; 