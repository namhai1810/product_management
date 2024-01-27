const express = require('express');
require("dotenv").config()

const database = require("./config/database");

const route = require('./routes/client/index.route');

database.connect();

const app = express();
const port = process.env.PORT;

app.use(express.static("public"));
app.set("views","./views");
app.set("view engine","pug");

// routes
route(app);


app.listen(port, () =>{
    console.log(`listening on ${port}`);
});