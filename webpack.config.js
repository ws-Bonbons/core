const webpack = require("webpack");

const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  target: 'node',
  devtool: 'source-map',
  entry: {
    index: path.resolve(__dirname, "index.ts")
  },
  output: {
    filename: 'index.js',
    library: '@bonbons/core',
    libraryTarget: 'umd'
  },
  mode: "production",
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".ts"]
  },
  node: {
    __dirname: false
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'assets', to: 'assets' },
    ])
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  }
};
