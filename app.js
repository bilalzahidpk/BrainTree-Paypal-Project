require('dotenv').config();
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');

const port = process.env.PORT;

const app = express();

app.use(morgan('dev'));
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(
  session({
    secret: 'key',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());

app.use(async function (req, res, next) {
  res.locals.success_alert_message = req.flash('success_alert_message');
  res.locals.error_message = req.flash('error_message');
  res.locals.error = req.flash('error');
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const indexRoutes = require('./routes/index');

app.use('/', indexRoutes);

app.use((err, req, res, next) => {
  if ('response' in err && 'data' in err.response) {
    req.flash('error_message', err.response.data.message);
  } else if (err.length > 0 && 'msg' in err[0]) {
    req.flash('error_message', err[0].msg);
  } else if ('errors' in err) {
    req.flash('error_message', err.errors[0].message);
  } else {
    req.flash('error_message', err.message);
  }
  res.redirect(302, '/');
});

app.listen(port, async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URI);
    console.log(`App is listening at port: ${port}`);
  } catch (err) {
    throw Error(err);
  }
});
