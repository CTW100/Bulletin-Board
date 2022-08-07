const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();

// DB setting
mongoose.connect('mongodb://127.0.0.1:27017');
const db = mongoose.connection;
db.once('open', () => {
	console.log('Db connected');
});
db.on('error', (err) => {
	console.log('DB ERROR : ', err);
});

// Other settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Routes
app.use('/', require('./routes/home'));
app.use('/posts', require('./routes/posts')); // 1
app.use('/users', require('./routes/users'));

// Port setting
const port = 3000;
app.listen(port, () => {
	console.log('server on! http://localhost: ' + port);
});
