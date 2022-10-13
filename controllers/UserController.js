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
    const { username, email, password, gender, gymExperience } = req.body; 
    const usernameData = await pool.query("SELECT * FROM users WHERE username = $1", [username]); 
    const emailData = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (usernameData.rows.length !== 0){
        res.json({ message: "Username already exists."}); 
    } else if (emailData.rows.length !== 0) {
        res.json({ message: "Username already exists."});
    } else {
        const encryptedPw = bcrypt.hashSync(password, 10); 
        const newUser = pool.query("INSERT INTO users (username, email, password, gender, gym_exp_level) VALUES ($1, $2, $3, $4, $5) RETURNING *", [username, email, encryptedPw, gender, gymExperience]); 

        //! Fetch the user_id (Just added this)
        // const userID_data = pool.query("SELECT user_id FROM users WHERE username = $1", [username]); 
        // const user_id = userID_data.rows[0].user_id; 

        // const payload = { user_id, username, email, admin: false}
        // const token = jwt.sign(payload, SECRET_KEY); 

        res.json({
            message: "User added!", 
            // newUserID: userID_data.rows,
            // token: token, 
            user: newUser.rows
        })
    }
}); 

/**************************************************************
SHOW one user
**************************************************************/
router.get("/:id", async (req, res) => {
    const { id } = req.params; 
    try {
        const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]); 
        if (user.rows.length === 0){
            res.send("No user found.")
        }
        res.json(user.rows); 
    } catch (error) {
        console.error(error.message); 
        res.send(error["detail"]); 
    }
})

/**************************************************************
UPDATE one user
**************************************************************/
router.put("/:id", async (req, res) => {
    const { id } = req.params; 
    const { username, email, gender, gymExperience } = req.body; 

    try {
        const updateUser = pool.query("UPDATE users SET username = $1, email = $2, gender = $3, gym_exp_level = $4 WHERE user_id = $5 RETURNING *", [username, email, gender, gymExperience, id]); 
        res.json({ message: "User details updated!"}); 
    } catch (error) {
        console.error(error.message);
    }
})

module.exports = router; 