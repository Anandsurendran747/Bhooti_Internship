const express = require('express')
var hbs = require('express-handlebars')
var path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

var anandRouter = require('./router/anand');



app.use(express.urlencoded());
app.set('views', __dirname + '/views');
// app.engine('hbs', hbs.engine());
app.set('view engine', 'hbs');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app. engine( 'hbs', hbs.engine( { extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/' ,handlebars: require('handlebars'), // Use the 'handlebars' package directly
runtimeOptions: {
    allowProtoPropertiesByDefault: true, // Disable the prototype access check
},} ) );

dotenv.config();


const Handlebars = require('handlebars');
Handlebars.registerHelper('gt', function (a, b, options) {
    if (a > b) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

mongoose.connect(process.env.MONGO_URL).then(data => {
    console.log("database connectd");
})



app.get('/', (req, res) => {
    res.render('home')
})

app.use('/anand', anandRouter);

app.listen(3000, () => {
    console.log("server started...");
})