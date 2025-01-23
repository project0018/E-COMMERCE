import { Alert, Button, Modal, Textarea } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import Review from './Review.jsx';

export default function ReviewSection({ productId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [review, setReview] = useState('');
  const [reviewError, setReviewError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (review.length > 200) {
      return;
    }
    try {
      const res = await fetch('/api/review/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: review, productId, userId: currentUser._id }),
      });
      const data = await res.json();
      if (res.ok) {
        setReview('');
        setReviewError(null);
        setReviews([data, ...reviews]);
      }
    } catch (error) {
      setReviewError(error.message);
    }
  };

  useEffect(() => {
    const getReviews = async () => {
      try {
        const res = await fetch(`/api/review/getProductReviews/${productId}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getReviews();
  }, [productId]);

  const handleLike = async(reviewId) => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/review/likeReview/${reviewId}`, {
        method: 'PUT',
      });
      if (res.ok) {
        const data = await res.json();
        setReviews( reviews.map((review) => 
            review._id === reviewId
              ? {
                  ...review,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                } : review
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (review, editedContent) => {
    setReviews(
      reviews.map((c) =>
        c._id === review._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (reviewId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/review/deleteReview/${reviewId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(reviews.filter((review) => review._id !== reviewId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-4">
      {currentUser ? (
        <div className="flex items-center gap-3 my-5 text-gray-500 text-lg">
          <p>Signed in as:</p>
          <img
            className="h-10 w-10 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to={'/dashboard?tab=profile'}
            className="text-sm text-cyan-600 hover:underline sm:text-lg"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to review the product.
          <Link className="text-blue-500 hover:underline" to={'/sign-in'}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
  <form
    onSubmit={handleSubmit}
    className="border border-teal-500 rounded-lg p-4 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl w-full"
  >
    <Textarea
      className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors duration-200"
      placeholder="Add a Review..."
      rows="4"
      maxLength="200"
      onChange={(e) => setReview(e.target.value)}
      value={review}
    />
    <div className="flex justify-between items-center mt-4">
      <p className="text-gray-500 text-sm">
        {200 - review.length} characters remaining
      </p>
      <Button
        className="px-6 py-2 text-lg font-semibold transition-transform transform hover:scale-105 w-4 h-15 sm:h-fit sm:w-fit bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 text-black"
        type="submit">
        Submit
      </Button>
    </div>
    {reviewError && (
            <Alert color='failure' className='mt-5'>
              {reviewError}
            </Alert>
          )}
  </form>
)}
{reviews.length === 0 ? (
        <p className='text-sm my-5'>No Reviews yet!</p>
      ) : (
        <>
          <div className='text-sm my-5 flex items-center gap-1'>
            <p>Reviews</p>
            <div className='border border-gray-400 py-1 px-2 rounded-sm'>
              <p>{reviews.length}</p>
            </div>
          </div>
          {reviews.map((review) => (
            <Review
            key={review._id}
            review={review}
            onLike={handleLike}
            onEdit={handleEdit}
            onDelete={(reviewId) => {
              setShowModal(true);
              setReviewToDelete(reviewId);
            }}
            />
          ))}
        </>
      )}
            <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button
                className='text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm text-center me-2 mb-2'
                onClick={() => handleDelete(reviewToDelete)}
              >
                Yes, I'm sure
              </Button>
              <Button color='gray' className='text-center' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
</div>
  );
}
