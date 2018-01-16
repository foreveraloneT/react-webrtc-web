import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const htmlWebpack = () => {
  return {
    template: path.resolve(__dirname, 'app', 'src', 'index.html'),
    filename: 'index.html'
  }
}

export default (DEBUG, PATH, PORT = 8001) => ({

  entry: {
    app: (DEBUG ? [
      `webpack-dev-server/client?http://localhost:${PORT}`,
    ] : []).concat([
      'webrtc-adapter',
      'babel-polyfill',
      './app/src/js/index',
      './app/src/style.scss'
    ]),

    common: [
      'lodash',
      'react'
    ]
  },

  output: {
    path: path.resolve(__dirname, PATH),
    filename: DEBUG ? 'main.js' : 'main-[hash].js',
    publicPath: DEBUG ? '/' : '/assets/'
  },

  // Load external jQuery
  externals: {
    jquery: 'jQuery'
  },

  cache: DEBUG,

  // For options, see http://webpack.github.io/docs/configuration.html#devtool
  devtool: DEBUG && '#inline-source-map',

  module: {
    rules: [
      // Load ES6
      {
        test: /\.js?$/,
        include: [
          path.resolve(__dirname, 'app', 'src', 'js'),
        ],
        exclude: [
          path.resolve(__dirname, 'app', 'src', 'js', 'specs'),
        ],
        loaders: ['babel-loader']
      },

      // Load styles
      {
        test: /\.(scss|css)/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: DEBUG
            ? 'css-loader?sourceMap&localIdentName=[local]___[hash:base64:5]!sass-loader?sourceMap'
            : 'css-loader!sass-loader'
        })
      },

      // Load images
      { test: /\.(png|jpg|gif)$/, use: ['url-loader?limit=70000&name=images/[name].[ext]', 'image-webpack-loader'] },
      // Load fonts
      { test: /\.(svg|eot|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: 'file-loader?name=fonts/[name].[ext]' }
    ]
  },

  plugins: DEBUG
    ? [
      new ExtractTextPlugin({ filename: 'style.css', allChunks: true }),
      new webpack.optimize.CommonsChunkPlugin({ name: 'common', filename: 'common.js' }),
      new HtmlWebpackPlugin(htmlWebpack()),
      new webpack.LoaderOptionsPlugin({
        debug: true,
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      })
    ] : [
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
      new ExtractTextPlugin({ filename: 'style.css', allChunks: false }),
      new webpack.optimize.CommonsChunkPlugin({ name: 'common', filename: 'common-[hash].js' }),
      new HtmlWebpackPlugin(htmlWebpack()),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compressor: { screw_ie8: true, keep_fnames: true, warnings: false },
        mangle: { screw_ie8: true, keep_fnames: true }
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.NoErrorsPlugin()
    ],

  resolve: {
    modules: ['node_modules', path.join(__dirname, 'src', 'js'), path.join(__dirname, 'src', 'assets')],

    // Allow to omit extensions when requiring these files
    extensions: ['.js', '.jsx'],
  }
});
