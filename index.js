const express = require('express')
var hbs = require('express-handlebars')
var path = require('path');
const app = express();

var anandRouter = require('./router/anand');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.json());
// app. engine( 'hbs', hbs.engine( { extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/Anand/' } ) );



app.get('/', (req, res) => {
    res.render('home')
})

app.use('/anand', anandRouter);

app.listen(3000, () => {
    console.log("server started...");
})