const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.js',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css'],
    symlinks: false,
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            "presets": ["@babel/preset-react"],
          }
        }
      },
      { test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ]
      },
      {
        test: /\.(webp)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      publicPath: '/',
      template: 'index.ejs',
    }),
  ],
  devServer: {
    open: true,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: false,
    port: 8080,
    historyApiFallback: true,
    client: {
      overlay: false,
    },
    proxy: {},
  },
  devtool: "eval",
  mode: "development",
};
