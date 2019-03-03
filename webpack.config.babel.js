import config from './package.json'

import webpack  from 'webpack';
import path from 'path'
import HtmlWebPackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'


import shadow from './src/utils/shadow.js'

const PUBLIC_URL = config.url.public;
const CDN_URL = config.url.cdn;

module.exports = (env, args) => ({
  devtool: args.mode == 'production' ? 'none' : 'source-map',

  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, ''),
    ],
    alias: {
      fonts: (args.mode == 'production' ? CDN_URL : '') + '/fonts',
    },
  },

  entry: {
    app: 'index.js',
  },

  output: {
    chunkFilename: '[name].[chunkhash:4].js',
    filename: chunkData => {
      return /inject|widget-/.test(chunkData.chunk.name)
        ? '[name].js'
        : '[name].[chunkhash:4].js';
    },
    publicPath: args.mode == 'production' ? CDN_URL : '',
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /mobx|react/,
          chunks: 'initial',
          priority: 2,
        },
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules(?!\/ansi-regex)/,
        use: {
          loader: 'babel-loader',
        },
      },

      {
        test: /module\.css$/,
        include: path.resolve(__dirname, '../'),

        use: [
          {
            loader: 'style-loader',
            options: {
              insertInto: shadow,
            },
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
              modules: true,
              hashPrefix: Math.random().toString(32),
              localIdentName: '[local]--[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },

      {
        exclude: /\.(js|css|html|json|svg|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: { name: '[name].[hash:4].[ext]' },
      },
    ],
  },

  plugins: [
    new CompressionPlugin({
      test: /\.js(\?.*)?$/i,
    }),

    new webpack.DefinePlugin({
      DEBUG: args.mode == 'development',
      PUBLIC_URL: JSON.stringify(args.mode == 'production' ? PUBLIC_URL : ''),
      CDN_URL: JSON.stringify(args.mode == 'production' ? CDN_URL : ''),
    }),

    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
      chunks: ['app', 'vendor'],
    }),


    new CopyWebpackPlugin([
      {
        context: __dirname,
        from: 'static',
        to: '',
      },
    ]),
  ],
});
