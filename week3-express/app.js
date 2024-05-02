var express = require("express");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var app = express();
require('./handle/connections')

var postsRouter = require('./routes/posts');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 取得指定路徑
app.use(express.static(path.join(__dirname, 'public')));

app.use('/posts', postsRouter);

module.exports = app;






