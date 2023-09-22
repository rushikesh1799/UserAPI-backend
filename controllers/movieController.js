const Movie = require('../models/movie.js');

const moviesData = [
  {
    title: "Dilwale Dulhania Le Jayenge",
    releaseYear: 1995,
    genre: [
      "Romance",
      "Drama"
    ],
    director: "Aditya Chopra",
    actors: [
      "Shah Rukh Khan",
      "Kajol"
    ],
    language: "Hindi",
    country: "India",
    rating: 9.1,
    plot: "A young man and woman fall in love on a Europe trip.",
    awards: "Multiple Filmfare Awards",
    posterUrl: "https://example.com/poster1.jpg",
    trailerUrl: "https://example.com/trailer1.mp4"
  },
  {
    title: "Bahubali: The Beginning",
    releaseYear: 2015,
    genre: [
      "Action",
      "Fantasy"
    ],
    director: "S. S. Rajamouli",
    actors: [
      "Prabhas",
      "Anushka Shetty"
    ],
    language: "Telugu",
    country: "India",
    rating: 8.1,
    plot: "A man embarks on a journey to rescue his mother from a tyrant.",
    awards: "National Film Award",
    posterUrl: "https://example.com/poster2.jpg",
    trailerUrl: "https://example.com/trailer2.mp4"
  },
  {
    title: "Lagaan",
    releaseYear: 2001,
    genre: [
      "Drama",
      "Sports"
    ],
    director: "Ashutosh Gowariker",
    actors: [
      "Aamir Khan",
      "Gracy Singh"
    ],
    language: "Hindi",
    country: "India",
    rating: 8.2,
    plot: "A group of villagers challenge British officers to a cricket match.",
    awards: "Oscar Nomination",
    posterUrl: "https://example.com/poster3.jpg",
    trailerUrl: "https://example.com/trailer3.mp4"
  },
  {
    title: "Kabhi Khushi Kabhie Gham",
    releaseYear: 2001,
    genre: [
      "Drama",
      "Romance"
    ],
    director: "Karan Johar",
    actors: [
      "Shah Rukh Khan",
      "Kajol"
    ],
    language: "Hindi",
    country: "India",
    rating: 7.6,
    plot: "A family drama spanning generations and continents.",
    awards: "Multiple Filmfare Awards",
    posterUrl: "https://example.com/poster4.jpg",
    trailerUrl: "https://example.com/trailer4.mp4"
  },
  {
    title: "PK",
    releaseYear: 2014,
    genre: [
      "Comedy",
      "Drama"
    ],
    director: "Rajkumar Hirani",
    actors: [
      "Aamir Khan",
      "Anushka Sharma"
    ],
    language: "Hindi",
    country: "India",
    rating: 8.1,
    plot: "An alien visits Earth and questions religious beliefs.",
    awards: "National Film Award",
    posterUrl: "https://example.com/poster5.jpg",
    trailerUrl: "https://example.com/trailer5.mp4"
  },
  {
    title: "Bajrangi Bhaijaan",
    releaseYear: 2015,
    genre: [
      "Drama",
      "Comedy"
    ],
    director: "Kabir Khan",
    actors: [
      "Salman Khan",
      "Kareena Kapoor"
    ],
    language: "Hindi",
    country: "India",
    rating: 8,
    plot: "A man helps a lost girl reunite with her family.",
    awards: "National Film Award",
    posterUrl: "https://example.com/poster6.jpg",
    trailerUrl: "https://example.com/trailer6.mp4"
  },
  {
    title: "3 Idiots",
    releaseYear: 2009,
    genre: [
      "Comedy",
      "Drama"
    ],
    director: "Rajkumar Hirani",
    actors: [
      "Aamir Khan",
      "Kareena Kapoor"
    ],
    language: "Hindi",
    country: "India",
    rating: 8.4,
    plot: "Two friends search for their long-lost college buddy.",
    awards: "Multiple Filmfare Awards",
    posterUrl: "https://example.com/poster7.jpg",
    trailerUrl: "https://example.com/trailer7.mp4"
  },
  {
    title: "Gully Boy",
    releaseYear: 2019,
    genre: [
      "Drama",
      "Musical"
    ],
    director: "Zoya Akhtar",
    actors: [
      "Ranveer Singh",
      "Alia Bhatt"
    ],
    language: "Hindi",
    country: "India",
    rating: 7.9,
    plot: "A young man from the slums aspires to be a rapper.",
    awards: "Oscar Nomination",
    posterUrl: "https://example.com/poster8.jpg",
    trailerUrl: "https://example.com/trailer8.mp4"
  }
]

async function seedDatabase() {
  try {
    for (const movieData of moviesData) {
      const newMovie = new Movie({
        title: movieData.title,
        releaseYear: movieData.releaseYear,
        genre: movieData.genre,
        director: movieData.director,
        actors: movieData.actors,
        language: movieData.language,
        country: movieData.country,
        rating: movieData.rating,
        plot: movieData.plot,
        awards: movieData.awards,
        posterUrl: movieData.posterUrl,
        trailerUrl: movieData.trailerUrl,
      })

      await newMovie.save();
      console.log(`Movie ${movieData.title} seeded in the database.`)

    }
    Console.log(`Database seeding complete.`);
  } catch (error) {
    console.log(`Error seeding database`, error);
  }
}

async function addReview(movieId, userId, review, rating) {
  try {
    const movieToBeUpdated = await Movie.findOne({ _id: movieId });
    if (movieToBeUpdated) {
      const userReview = {
        user: userId,
        text: review,
        rating: rating
      }
      movieToBeUpdated.reviews.push(userReview);
      const updatedMovie = await movieToBeUpdated.save();
      if (updatedMovie) {
        console.log(`user review has been added successfully to the ${movieToBeUpdated.title}`, movieToBeUpdated);
        return updatedMovie;
      } else {
        console.log(`could not add the user review, please try again!`);
      }
    } else {
      console.log('The movie is not found, please try again!');
    }
  } catch {
    console.log('Error adding the review, please try again!');
  }
}

async function getTop5RatingsAndReviewsOfMovie(movieId) {
  try {
    const movie = await Movie.findOne({ _id: movieId });
    const top5Reviews = movie.reviews.sort((a, b) => b.rating - a.rating).slice(0, 5);
    if (top5Reviews) {
      console.log(`The top 5 ratings with reviews for the movie ${movie.title} are:`, top5Reviews)
    } else {
      console.log(`There are no ratings and reviews for this movie yet!`)
    }
  } catch {
    console.log('Error getting the reviews, please try again!')
  }
}

async function getBottom5RatingsAndReviewsOfMovie(movieId) {
  try {
    const movie = await Movie.findOne({ _id: movieId });
    const top5Reviews = movie.reviews.sort((a, b) => b.rating - a.rating).reverse().slice(0, 5);
    if (top5Reviews) {
      console.log(`The bottom 5 ratings with reviews for the movie ${movie.title} are:`, top5Reviews)
    } else {
      console.log(`There are no ratings and reviews for this movie yet!`)
    }
  } catch {
    console.log('Error getting the reviews, please try again!')
  }
}

async function getMovieReviewsWithUserDetails(movieId) {
  try {
    const movie = await Movie.findOne({ _id: movieId }).populate('reviews.user', 'email username');
    if (movie) {
      const reviewsWithUserDetails = movie.reviews.slice(0, 3);
      console.log(reviewsWithUserDetails);
      return reviewsWithUserDetails;
    } else {
      console.log('Could not find the movie, please try again!');
    }
  } catch {
    console.log("Error getting the reviews, please try again!");
  }
}

module.exports = {
  seedDatabase,
  addReview,
  getTop5RatingsAndReviewsOfMovie,
  getBottom5RatingsAndReviewsOfMovie,
  getMovieReviewsWithUserDetails
}


// seedDatabase();
// addReview("650bcc9411b86c0f765295cb", "650bba3a6a76caae17ca79af", "Nice movie", 9);
// addReview("650bcc9411b86c0f765295cb", "650bba3a6a76caae17ca79af", "Nice movie", 4);
// addReview("650bcc9411b86c0f765295cb", "650bba3a6a76caae17ca79af", "Nice movie", 8.5);
// addReview("650bcc9411b86c0f765295cb", "650bba3a6a76caae17ca79af", "Nice movie", 4.5);
// addReview("650bcc9411b86c0f765295cb", "650bba3a6a76caae17ca79af", "Nice movie", 8);
// addReview("650bcc9411b86c0f765295cb", "650bba3a6a76caae17ca79af", "Nice movie", 5);
// addReview("650bcc9411b86c0f765295cb", "650bba3a6a76caae17ca79af", "Nice movie", 7.5);
// addReview("650bcc9411b86c0f765295cb", "650bba3a6a76caae17ca79af", "Nice movie", 5.5);
// addReview("650bcc9411b86c0f765295cb", "650bba3a6a76caae17ca79af", "Nice movie", 7);
// addReview("650bcc9411b86c0f765295cb", "650bba3a6a76caae17ca79af", "Nice movie", 6);

// getTop5RatingsAndReviewsOfMovie("650bcc9411b86c0f765295cb");
// getBottom5RatingsAndReviewsOfMovie("650bcc9411b86c0f765295cb");
// getMovieReviewsWithUserDetails("650bcc9411b86c0f765295cb");
