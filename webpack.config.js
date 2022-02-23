/* eslint-disable */
const path = require("path");
const slsw = require("serverless-webpack");

const isLocal = slsw.lib.options.platform === "dev";

module.exports = {
  mode: isLocal ? "development" : "production",
  entry: slsw.lib.entries,
  devtool: isLocal ? "eval-cheap-module-source-map" : "source-map",
  resolve: {
    extensions: [".js", ".json", ".ts"],
    alias: {
      src: path.resolve(__dirname, "src/"),
    },
  },
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
  },
  target: "node",
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.(tsx?)$/,
        loader: "ts-loader",
        exclude: [
          [
            path.resolve(__dirname, "node_modules"),
            path.resolve(__dirname, ".serverless"),
            path.resolve(__dirname, ".webpack"),
          ],
        ],
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      },
    ],
  },
};
