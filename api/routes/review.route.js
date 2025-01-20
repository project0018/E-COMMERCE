import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createReview, deleteReview, editReview, getProductReviews, getReviews, likeReview } from "../controllers/review.controller.js";

const router=express.Router();

router.post('/create', verifyToken, createReview); 
router.get('/getProductReviews/:productId', getProductReviews);
router.put('/likeReview/:reviewId', verifyToken, likeReview);
router.put('/editReview/:reviewId', verifyToken, editReview);
router.delete('/deleteReview/:reviewId', verifyToken, deleteReview);
router.get('/getReviews', verifyToken, getReviews);


export default router;