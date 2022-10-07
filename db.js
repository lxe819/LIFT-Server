const Pool = require("pg").Pool; 
require("dotenv").config(); 

const pool = new Pool({
    user: "ogzkhige", 
    password: process.env.CONNECTION_PASSWORD, 
    host: "rosie.db.elephantsql.com", 
    port: 5432, 
    database: "ogzkhige"
}); 

module.exports = {
    query: (text, params) => pool.query(text, params)
}; 