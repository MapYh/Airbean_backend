const getRandomNumber = (min, max) => {
    // Generate a random number between min and max
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  module.exports = {getRandomNumber}