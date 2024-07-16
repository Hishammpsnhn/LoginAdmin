import express from 'express';
import dotenv from 'dotenv';
import route from './router/authRoute.js';
import bodyParser from 'body-parser';
import session from 'express-session';
import nocache from 'nocache';
import data from './utils.js';
import { checkAuth, checkNotAuth } from './middleware/authMiddleware.js'
import notFound from './middleware/notFound.js';

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
app.use('/route', route);



// Home Route
app.get('/', checkAuth, (req, res) => {
    res.render('home', { user: req.session.Username, data: data });
});

// Login Route
app.get('/signup', checkNotAuth, (req, res) => {
    console.log(req.session);

    if (req.session.passwordWrong) {
        res.render('login', { msg: 'Invalid credentials' });
        req.session.passwordWrong = false
    } else {
        res.render('signup');
    }
});
app.get('/login', checkNotAuth, (req, res) => {
    console.log(req.session);

    if (req.session.passwordWrong) {
        res.render('login', { msg: 'Invalid credentials' });
        req.session.passwordWrong = false
    } else {
        res.render('login');
    }
});

//not found
app.use(notFound)

const port = process.env.PORT || 4000;

// listen Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
