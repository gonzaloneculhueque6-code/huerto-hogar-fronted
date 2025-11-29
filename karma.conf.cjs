module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'src/utils/**/*.js',
      'src/**/*.spec.js'
    ],
    reporters: ['spec'],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-spec-reporter'
    ],
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity
  });
};