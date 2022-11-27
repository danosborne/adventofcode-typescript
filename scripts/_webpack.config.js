const path = require('path');

module.exports = {
  mode: 'development',
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
    clean: true,
    iife: false
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