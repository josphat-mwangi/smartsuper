const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const routes = require('./routes/index')
const db = require("./config/database");



const main = async () => {
    const app = express();
    app.use(bodyParser.json());
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());

    app.get('/', (req, res)=>{
        res.send("Hello Its up and running")
    });
    
    app.use("/api", routes)


    
    app.listen(process.env.PORT || 4000, async () => {
        console.log(`Server Running ${process.env.PORT}`), await db.connect();
    });
};

main();