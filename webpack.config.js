/* eslint-disable import/no-commonjs */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const WriteFilePlugin = require('write-file-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const yaml = require('js-yaml');
const fs = require('fs');

const dest = path.resolve(__dirname, './dist');

const conferences = yaml.load(fs.readFileSync(path.resolve(__dirname, 'conferences.yaml'), {encoding: 'utf-8'}))
const year = { year: new Date().getFullYear() } 
const locals = Object.assign({}, conferences, year)

module.exports = {
  output: {
    path: dest,
    publicPath: '/',
    filename: `[name].[hash].js`
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.pug'}),
    new CopyWebpackPlugin([
      { from: "src/static" }
    ]),
    new WriteFilePlugin()
  ],  
  module: {
    rules: [
      {
        loader: 'source-loader'
      },
      {
        test: /\.pug$/,
        loader: 'pug-static-loader',
        options: {
          pretty: false,
          locals: locals,
        }
      },    
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        }
      }
    ],
  },
  devServer: {
    historyApiFallback: false
  },
  performance: {
    hints: false,
  }
};