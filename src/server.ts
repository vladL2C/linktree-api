import { json, urlencoded } from 'body-parser';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { publicRouter, authenticatedRouter } from './api/v1/routes';

const app = express();

// enable cors
const allowedOrigins = ['http://localhost:3000'];

app.use(cors({ origin: allowedOrigins, credentials: true }));

// Express configuration
app.set('port', process.env.PORT || 8000);
app.use(cookieParser());
app.use(urlencoded({ extended: false }));
app.use(json());

// @route   GET /
// @desc    Test Base API
// @access  Public
app.get('/', (_req, res) => {
  res.send('API Running hehe test another testtttt');
});

// routes

app.use('/', publicRouter);
app.use('/', authenticatedRouter);

const port = app.get('port');

app.listen(port, () => console.log(`Server started on port ${port}`));
