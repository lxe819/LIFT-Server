const express = require("express"); 
const app = express(); 
const cors = require("cors"); 
require("dotenv").config(); 
const pool = require("./db"); 

const UserController = require("./controllers/UserController"); 

const PORT = process.env.PORT; 
const SECRET_KEY = process.env.SECRET_KEY; 


app.use(cors()); 
app.use(express.json()); 
app.use("/users", UserController); 

app.get("/", async (req, res) => {
    res.send("Hello")
}); 


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})