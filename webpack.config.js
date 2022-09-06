const devMode =
  process.argv[process.argv.indexOf("--mode") + 1] !== "production";

module.exports = {
  entry: "./index.ts",
  mode: devMode ? "development" : "production",
  watch: devMode,
  output: {
    clean: true,
    library: {
      name: "decibel",
      type: "umd"
    },
    filename: "index.js"
  },
  module: {
    rules: [
      {
        test: /\.(t|j)s$/,
        use: ["babel-loader", "ts-loader"]
      }
    ]
  }
};
