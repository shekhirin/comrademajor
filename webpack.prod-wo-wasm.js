const {mergeWithCustomize, customizeArray} = require('webpack-merge');
const prod = require('./webpack.prod.js');

const WASMPackPlugin = require("@wasm-tool/wasm-pack-plugin");

module.exports = prod.map(function (config) {
  const plugins = config.plugins.filter(function (plugin) {
    return !(plugin instanceof WASMPackPlugin)
  })

  return mergeWithCustomize({
    customizeArray: customizeArray({
      plugins: "replace"
    })
  })(config, {plugins: plugins})
})