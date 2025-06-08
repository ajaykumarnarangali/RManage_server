const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.js' });
const { connection } = require('./models/connection');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const morgan =require('morgan');

const PORT = process.env.PORT || 3000;

const authRouter = require('./routes/authRouter');
const categoryRouter = require('./routes/categoryRouter');
const subCategoryRouter = require('./routes/subCatRouter');
const productRouter = require('./routes/productRouter');
const userRouter = require('./routes/userRouter');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(morgan('dev'));

app.use('/api/auth', authRouter);
app.use('/api/category', categoryRouter);
app.use('/api/subCategory', subCategoryRouter);
app.use('/api/product', productRouter);
app.use('/api/user', userRouter);

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        success: false,
        message: error.message || "internal server error"
    })
})

connection();

app.listen(PORT, () => {
    console.log("server running successfully");
})
