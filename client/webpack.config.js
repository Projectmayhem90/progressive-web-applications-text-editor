const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

// Add and configure workbox plugins for a service worker and manifest file.
const workboxPlugins = [
  new InjectManifest({
    swSrc: './src/js/sw.js',
    swDest: 'sw.js',
  }),
];

const manifestPlugin = new WebpackPwaManifest({
  filename: 'manifest.json',
  name: 'My App',
  short_name: 'My App',
  description: 'My App description',
  background_color: '#ffffff',
  theme_color: '#0066cc',
  icons: [
    {
      src: path.resolve('src/img/icon.png'),
      sizes: [96, 128, 192, 256, 384, 512],
      destination: path.join('icons'),
    },
  ],
});

// Add CSS loaders and babel to webpack.
const cssLoader = {
  test: /\.css$/i,
  use: ['style-loader', 'css-loader'],
};

const babelLoader = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env'],
    },
  },
};

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        chunks: ['main'],
        filename: 'index.html',
      }),
      new HtmlWebpackPlugin({
        template: './src/install.html',
        chunks: ['install'],
        filename: 'install.html',
      }),
      manifestPlugin,
      ...workboxPlugins,
    ],

    module: {
      rules: [
        cssLoader,
        babelLoader,
      ],
    },
  };
};