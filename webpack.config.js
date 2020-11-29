const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const WASMPackPlugin = require("@wasm-tool/wasm-pack-plugin");

const dist = path.resolve(__dirname, "dist");

module.exports = {
  mode: "development",
  entry: {
    index: "./js/index.ts"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader"
      }
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".wasm"],
  },
  output: {
    path: dist,
    filename: "[name].js"
  },
  devServer: {
    contentBase: dist,
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.join(__dirname, 'static', 'index.html')
    }),
    new WASMPackPlugin({
      crateDirectory: __dirname
    })
  ],
  experiments: {
    syncWebAssembly: true
  }
};
