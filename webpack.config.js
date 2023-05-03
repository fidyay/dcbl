/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

module.exports = {
  entry: "./index.ts",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    clean: true,
    filename: "index.js",
    globalObject: "this",
    library: {
      name: "dcbl",
      type: "umd"
    }
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env", { targets: "defaults" }]]
            }
          },
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.build.json"
            }
          }
        ]
      }
    ]
  }
};
