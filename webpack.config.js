const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const WASMPackPlugin = require("@wasm-tool/wasm-pack-plugin");

const dist = path.resolve(__dirname, "dist");

const appConfig = {
  mode: "development",
  entry: "./js/index.ts",
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
      template: path.join(__dirname, "static", "index.html")
    }),
    new WASMPackPlugin({
      crateDirectory: path.join(__dirname, "cargo"),
      outDir: path.join(__dirname, "pkg")
    })
  ],
  experiments: {
    syncWebAssembly: true
  }
};

const workerConfig = {
  mode: "development",
  entry: "./js/worker.ts",
  target: "webworker",
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
    filename: "worker.js"
  },
  experiments: {
    syncWebAssembly: true
  }
}

module.exports = [appConfig, workerConfig]