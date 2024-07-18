import express from 'express';
import dotenv from 'dotenv';
import authRoute from './router/authRoute.js';
import bodyParser from 'body-parser';
import session from 'express-session';
import nocache from 'nocache';
import data from './utils.js';
import { checkAdmin, checkAuth, checkNotAuth } from './middleware/authMiddleware.js'
import notFound from './middleware/notFound.js';
import adminRoute from './router/adminRoute.js'
import connectDB from './middleware/db.js';

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// DB connection
connectDB();

// Session 
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret-key',
    resave: false,
    saveUninitialized: false,
}));



// Template Engine
app.set('view engine', 'ejs');

// Static Files
// app.use(express.static(path.join(__dirname, 'public')));
 //app.use(express.static("public"));

// No-cache Middleware
app.use(nocache());

// Routes
app.use('/route', authRoute);
app.use('/admin',adminRoute)


// Home Route
app.get('/', checkAuth, (req, res) => {
    if(req.session.isAdmin){
        res.redirect('/admin')
    }else{
        res.render('home', { user: req.session.Username, data: data });
    }
});

// Login Route
app.get('/signup', checkNotAuth, (req, res) => {
    if (req.session.passwordWrong) {
        res.render('signup', {msg:req.session.errMessage ? req.session.errMessage :'Invalid credentials' });
        req.session.passwordWrong = false
        req.session.destroy();
    } else {
        res.render('signup');
    }
});
app.get('/login',checkNotAuth,  (req, res) => {
    if (req.session.passwordWrong) {
        res.render('login', {msg:req.session.errMessage ? req.session.errMessage :'Invalid credentials' });
        req.session.passwordWrong = false
        req.session.destroy();
    } else {
        res.render('login');
    }
});
app.get('/admin',checkAdmin,(req,res)=>{
})

//not found
app.use(notFound)

const port = process.env.PORT || 4000;

// listen Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
