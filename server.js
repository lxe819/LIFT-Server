const express = require("express"); 
const app = express(); 
const cors = require("cors"); 
const PORT = 5566; 

app.use(cors()); 
app.use(express.json()); 

app.get("/", async (req, res) => {
    res.send("Hello")
}); 


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})