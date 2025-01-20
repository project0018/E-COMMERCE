import Review from "../models/review.model.js";
import { errorHandler } from "../utils/error.js";

export const createReview = async (req, res, next) => {
    try {
        const { content, productId, userId } = req.body;
    
        if (userId !== req.user.id) {
          return next(
            errorHandler(403, 'You are not allowed to create this review')
          );
        } 
        const newReview = new Review({
          content,
          productId,
          userId,
        });
        await newReview.save();
    
        res.status(200).json(newReview);
      } catch (error) {
        next(error);
      }
    };


    export const getProductReviews = async (req, res, next) => {
      try {
        const reviews = await Review.find({ productId: req.params.productId }).sort({
          createdAt: -1,
        });
        res.status(200).json(reviews);
      } catch (error) {
        next(error);
      }
    };


    export const likeReview = async (req, res, next) => {
      try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) {
          return next(errorHandler(404, 'Review not found'));
        }
        const userIndex = review.likes.indexOf(req.user.id);
        if (userIndex === -1) {
          review.numberOfLikes += 1;
          review.likes.push(req.user.id);
        } else {
          review.numberOfLikes -= 1;
          review.likes.splice(userIndex, 1);
        }
        await review.save();
        res.status(200).json(review);
      } catch (error) {
        next(error);
      }
    };

    export const editReview = async (req, res, next) => {
      try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) {
          return next(errorHandler(404, 'Reviews not found'));
        }
        if (review.userId !== req.user.id && !req.user.role=="seller") {
          return next(
            errorHandler(403, 'You are not allowed to edit this review')
          );
        }
    
        const editedReview = await Review.findByIdAndUpdate(
          req.params.reviewId,
          {
            content: req.body.content,
          }, 
          { new: true }
        );
        res.status(200).json(editedReview);
      } catch (error) {
        next(error);
      }
    };
  
    export const deleteReview = async (req, res, next) => {
      try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) {
          return next(errorHandler(404, 'Reviews not found'));
        }
        if (review.userId !== req.user.id && !req.user.role=="seller") {
          return next(
            errorHandler(403, 'You are not allowed to delete this Review')
          );
        }
        await Review.findByIdAndDelete(req.params.reviewId);
        res.status(200).json('Review has been deleted');
      } catch (error) { 
        next(error);
      }
    };
   
    export const getReviews = async (req, res, next) => {
      if (!req.user.role=="seller")
        return next(errorHandler(403, 'You are not allowed to get all Reviews'));
      try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'desc' ? -1 : 1;
        const reviews = await Review.find()
          .sort({ createdAt: sortDirection })
          .skip(startIndex)
          .limit(limit);
        const totalReviews = await Review.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        const lastMonthReviews = await Review.countDocuments({
          createdAt: { $gte: oneMonthAgo },
        });
        res.status(200).json({ reviews, totalReviews, lastMonthReviews });
      } catch (error) {
        next(error);
      }
    };