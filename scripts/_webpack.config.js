const path = require('path');

module.exports = {
  mode: 'production',
  // To be added by consumer
  //entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    // To be added by consumer
    // filename: 'bundle.js',
    // path: path.resolve(process.cwd(), 'dist'),
  },
  node: {
    global: false,
    __filename: false,
    __dirname: true,
  },
  // watch: true,
  // watchOptions: {
  //   ignored: ['**/*.js', '**/node_modules'],
  // }
};