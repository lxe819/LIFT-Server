const pool = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config(); 
const SECRET_KEY = process.env.SECRET_KEY; 

const isUser = async (req, res, next) => {
    const bearer = req.get("Authorization"); 
    const token = bearer.split(" ")[1]; 

    try {
        const payload = jwt.verify(token, SECRET_KEY); 
        if (!payload.admin){
            next(); 
        } else {
            res.json({ message: "Admin please sign in as a user." }); 
        }
        
    } catch (error) {
        console.error(error.message); 
        res.json({ message: error })
    }
}; 

module.exports = isUser; 