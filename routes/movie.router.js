const express = require('express');

const {
  seedDatabase,
  addReview,
  getTop5RatingsAndReviewsOfMovie,
  getBottom5RatingsAndReviewsOfMovie,
  getMovieReviewsWithUserDetails
} = require('../controllers/movieController.js')

const movieRouter = express.Router();

movieRouter.post('/:movieId/rating', async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const { userId, review, rating } = req.body;
    const updatedMovie = await addReview(movieId, userId, review, rating);
    if (updatedMovie) {
      return res.status(201).json({ message: "The review has been added successfully!", movie: updatedMovie })
    } else {
      return res.status(404).json({ message: "Could not able to add the review, please try again!" })
    }
  } catch (error) {
    return res.status(500).json({ message: "Error adding the review, please try again later!" })
  }
});

movieRouter.get('/:movieId/reviews', async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const movieReviews = await getMovieReviewsWithUserDetails(movieId);
    if (movieReviews) {
      return res.status(201).json({ message: "The reviews for the following movie are as follows:", reviews: movieReviews })
    } else {
      return res.status(404).json({ message: "Could not able to find the reviews, please try again!" })
    }
  } catch (error) {
    return res.status(500).json({ message: "Error getting the review, please try again later!" })
  }
});

module.exports = movieRouter;
