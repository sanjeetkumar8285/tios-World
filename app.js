var createError = require('http-errors');
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var auth = require('./middlewares/auth');
var cors = require('cors');
require('dotenv').config();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(
  `${process.env.MONGODB_URL}`,
  { useNewUrlParser: "true", useUnifiedTopology: "true" }, (err) =>
{
  console.log(err ? err : "connected to database")
})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin.js');
var sellerRouter = require('./routes/seller.js');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
app.use(cors());

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use("/admin", adminRouter);
app.use('/seller', sellerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next)
{
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next)
{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


const port=process.env.PORT || 3000

app.listen(port,(err)=>{
  if(err){
console.log(`error in server creation ${err}`)
  }
  else{
console.log(`server is up and running ${port}`)
  }
})

module.exports = app;
