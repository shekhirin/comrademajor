const {merge} = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = common.map(function (config) {
  return merge(config, {mode: "production"})
})