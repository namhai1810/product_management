const express = require('express');
const methodOverride = require('method-override')
require("dotenv").config()

const database = require("./config/database");

const systemConfig = require("./config/system");
const routeAdmin = require("./routes/admin/index.route");
const route = require('./routes/client/index.route');

database.connect();

const app = express();
const port = process.env.PORT;
app.use(methodOverride('_method'))
app.use(express.static("public"));
app.set("views","./views");
app.set("view engine","pug");

// app local variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// routes
routeAdmin(app);
route(app);


app.listen(port, () =>{
    console.log(`listening on ${port}`);
});