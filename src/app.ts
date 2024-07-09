import * as dotenv from 'dotenv';
dotenv.config({
  //warning: this will overwrite any existing env vars
});
import createError, { HttpError } from 'http-errors';
import express from 'express';
import path from 'path';
import logger from 'morgan';

import { router as apiRouter } from './routes/api.js';
import { router as healthRouter } from './routes/health.js';
import { authenticateUser } from './middlewares/index.js';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/health', authenticateUser, healthRouter);
app.use('/', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err: HttpError, req: express.Request, res: express.Response) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
