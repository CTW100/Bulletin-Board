const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./config/passport');
const util = require('./util');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017');
const db = mongoose.connection;

db.once('open', () => {
	console.log('DB connected!');
});

db.on('error', (err) => {
	console.log('DB ERROR : ', err);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({ secret: 'MySecret', resave: true, saveUninitialized: true }));

// Passport

app.use(passport.initialize()); // passport 를 초기화 시켜주는 함수
app.use(passport.session()); // passport 를 session 과 연결해주는 함수

// Custom Middlewares
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.isAuthenticated();
	res.locals.currentUser = req.user;
	next();
});

app.use('/', require('./routes/home'));
app.use('/posts', util.getPostQueryString, require('./routes/posts'));
app.use('/users', require('./routes/users'));

const port = 3000;
app.listen(3000, (req, res) => {
	console.log('Let us start');
});
