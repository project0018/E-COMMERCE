import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';  
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import reviewRoutes from './routes/review.route.js';
import projectRoutes from './routes/project.route.js';
import orderRoutes from './routes/order.route.js';
import transactionRoutes from './routes/transaction.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
 
dotenv.config();

mongoose.connect(process.env.MONGO)
.then( () => {
      console.log('mongoDB is connected...');
    }).catch( err => {
      console.log(err);
    });

    const __dirname = path.resolve();

const app=express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
   console.log('server is running on port 3000!')
});


app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/transaction', transactionRoutes);

app.use(express.static(path.join(__dirname, '/FrontSide/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'FrontSide', 'dist', 'index.html'));
});


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
      success: false,
      statusCode,
      message,
  });
});