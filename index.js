const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const methodOverride = require('method-override');
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

app.use('/', require('./routes/home'));
app.use('/posts', require('./routes/posts'));

const port = 3000;
app.listen(3000, (req, res) => {
	console.log('Let us start');
});
