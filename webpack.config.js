const slsw = require('serverless-webpack');

module.exports = {
  target: 'node',
  mode: 'production',
  entry: slsw.lib.entries,
  externals: {
    'aws-sdk': 'aws-sdk',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  }
};
