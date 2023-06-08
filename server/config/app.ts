/*============================================*/
/* Installed 3rd Party Packages               */
/*============================================*/
import createError, { HttpError } from "http-errors";
import express from 'express';
import path from 'path';
import cookieParser from "cookie-parser";
import logger from 'morgan';

import mongoose from 'mongoose';

import passport from 'passport';
import MongoStore from 'connect-mongo';
import session from 'express-session'
import flash from 'connect-flash';

import { isLoggedIn } from "../middlewares/auth";

/*============================================*/
/* Import Routers                             */
/*============================================*/
import indexRouter from '../routes/index';
import surveyRouter from '../routes/survey';
import userRouter from '../routes/user';

/*============================================*/
/* Database Configuration                     */
/*============================================*/
import * as DBConfig from './db';  
mongoose.connect((DBConfig.RemoteUri) ? DBConfig.RemoteUri : DBConfig.LocalUri);

const StoreOptions = {
  store: MongoStore.create({
    mongoUrl: (DBConfig.RemoteUri) ? DBConfig.RemoteUri : DBConfig.LocalUri
  }),
  secret: DBConfig.Secret,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 600000
  }
}
const DB = mongoose.connection;

DB.on('error', console.error.bind(console, 'Connection Error:'));
DB.once('open', ()=> {
  console.log('Connected to MongoDB: @' + DBConfig.HostName);
});


/*============================================*/
/* Express Configuration                      */
/*============================================*/
const app = express(); 

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');  // express -e

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../client')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

// Setup connect-flash
app.use(flash());

// express-session initialize
app.use(session(StoreOptions));

// Passport initialize
app.use(passport.initialize());
app.use(passport.session());

// Router Middleware 
app.use('/', indexRouter);
app.use('/survey', isLoggedIn, surveyRouter);
app.use('/auth', userRouter);

// catch 404 and forward to error handler
app.use(function(_req: any, _res: any, next: (arg0: any) => void) {
  next(createError(404));
});

// error handler
app.use(function(err: { message: any; status: any; }, req: { app: { get: (arg0: string) => string; }; }, res: { locals: { message: any; error: any; }; status: (arg0: any) => void; render: (arg0: string, arg1: { title: string; }) => void; }, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {title: "Oops, You have an error!"});
});

export default app;