import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(morgan('dev'));
app.use(cors());

import http from 'http';
const server = http.Server(app);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/codeworkr-rest-api', () => {
	console.log('Connected to mongodb.');
});

const users = require('./routes/users');
const boards = require('./routes/boards');
const games = require('./routes/games');

try {
	const port = process.env.PORT || 8000;
	server.listen(port);
	console.log(`Listening on port: ${port}`);
} catch (err) {
	console.log('INIT_ERROR:', err);
}

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

// Routes
app.use('/boards', boards);
app.use('/users', users);
app.use('/games', games);

// Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// Error handler function
app.use((err, req, res, next) => {
	const error = app.get('env') === 'development' ? err : {};
	const status = err.status || 500;

	// Respond to client
	res.status(status).json({
		error: {
			message: error.message
		}
	});

	// Respond to ourselves
	console.error(err);
});
