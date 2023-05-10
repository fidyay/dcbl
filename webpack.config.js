/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const isESM = process.env.MODULE === "esm";

const config = {
  entry: "./index.ts",
  mode: "production",
  experiments: {
    outputModule: isESM
  },
  output: {
    path: path.resolve(__dirname, isESM ? "dist/esm" : "dist/umd"),
    clean: true,
    filename: "index.js",
    globalObject: "this",
    library: {
      name: isESM ? undefined : "dcbl",
      type: isESM ? "module" : "umd"
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

module.exports = config;
