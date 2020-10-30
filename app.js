const tracer = require( 'trace-unhandled/register' );
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./util/database');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const flash = require('connect-flash'); 

const app = express();

const options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
    //expiration: 60000//(60000 * 60 * 24 * 7)
}
 
const sessionStore = new MySQLStore(options);



app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(session({
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    cookie: {maxAge: 60000},
    resave: false,
    store: sessionStore
    
}))

const adminRouter = require('./routes/admin');
const clientRouter = require('./routes/client');
const authRouter = require('./routes/auth');



app.set('view engine', 'ejs');

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
})

app.use('/admin', adminRouter);
app.use(clientRouter);
app.use('/auth', authRouter);


app.listen(3000,() => {
    console.log('listening on port ' + process.env.DB_PORT);
})
