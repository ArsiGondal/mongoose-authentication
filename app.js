const express = require('express');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRouter');
const productRouter = require('./routes/productRouter');

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use('/testApi/users' , userRouter);
app.use('/testApi/products' , productRouter);


module.exports = app;