module.exports = function(config) {

  config.set({
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    frameworks: ['jasmine'],

    files: [
      'app/tempss/**/*.spec.js',


    ],
    client: {
      builtPaths: ['app/'], // add more spec base paths as needed

    },

  });
};