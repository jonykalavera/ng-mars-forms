  module.exports = function(config) {
    config.set({
      plugins: ['karma-jasmine', 'karma-coverage'],
      reporters: ['progress']
    });
  };

