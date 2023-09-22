const mongoose = require('mongoose')

const movieScheme = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  releaseYear:  {
    type: Number,
    required: true,
  },
  genre: [{
    type: String,
    default: [],
  }],
  director: {
    type: String,
    required: true,
  },
  actors: [{
    type: String,
    default: [],
  }],
  language: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    default: "INDIA",
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      text: String,
      rating: Number,
    }
  ],
  plot: {
    type: String,
    required: true,
  },
  awards: {
    type: String,
    required: true,
  },
  posterUrl: {
    type: String,
    required: true,
  },
  trailerUrl: {
    type: String,
    required: true,
  },
  
}, { timestamps: true })

const Movie = mongoose.model('Movie', movieScheme)

module.exports = Movie;