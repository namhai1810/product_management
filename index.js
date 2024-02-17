const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const cookieParser = require("cookie-parser");
const session = require("express-session");

require("dotenv").config()

const database = require("./config/database");
var bodyParser = require('body-parser')
const systemConfig = require("./config/system");
const routeAdmin = require("./routes/admin/index.route");
const route = require('./routes/client/index.route');
var flash = require('express-flash');

database.connect();

const app = express();
const port = process.env.PORT;
app.use(methodOverride('_method'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.set("views", `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));
app.set("view engine","pug");

//flash
app.use(cookieParser('qwertyuiop'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
//end flash

//tinymce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
//end tinymce

// app local variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// routes
routeAdmin(app);
route(app);


app.listen(port, () =>{
    console.log(`listening on ${port}`);
});