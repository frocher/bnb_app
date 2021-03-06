'use strict';

const {resolve, join} = require('path');
const webpack = require('webpack');
const {InjectManifest} = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const pkg = require('./package.json');

const ENV = process.argv.find(arg => arg.includes('NODE_ENV=production')) ? 'production' : 'development';
const IS_DEV_SERVER = process.argv.find(arg => arg.includes('webpack-dev-server'));
const OUTPUT_PATH = IS_DEV_SERVER ? resolve('src') : resolve('dist');

const processEnv = {
  NODE_ENV: JSON.stringify(ENV),
  appVersion: JSON.stringify(pkg.version)
};

/**
 * === Copy static files configuration
 */
const copyStatics = {
  copyWebcomponents: [{
    from: resolve('./node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js'),
    to: join(OUTPUT_PATH, 'vendor'),
    flatten: true
  }, {
    from: resolve('./node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js'),
    to: join(OUTPUT_PATH, 'vendor'),
    flatten: true
  }, {
    from: resolve('./node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-ce.js'),
    to: join(OUTPUT_PATH, 'vendor', 'bundles'),
    flatten: true
  }, {
    from: resolve('./node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce.js'),
    to: join(OUTPUT_PATH, 'vendor', 'bundles'),
    flatten: true
  }, {
    from: resolve('./node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce-pf.js'),
    to: join(OUTPUT_PATH, 'vendor', 'bundles'),
    flatten: true
  }, {
    from: resolve('./node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-sd.js'),
    to: join(OUTPUT_PATH, 'vendor', 'bundles'),
    flatten: true
  }, {
    from: resolve('./node_modules/web-animations-js/web-animations-next.min.js'),
    to: join(OUTPUT_PATH, 'vendor'),
    flatten: true
  }, {
    from: resolve('./node_modules/chart.js/dist/Chart.bundle.min.js'),
    to: join(OUTPUT_PATH, 'vendor'),
    flatten: true
  }, {
    from: resolve('./node_modules/chartjs-plugin-annotation/chartjs-plugin-annotation.min.js'),
    to: join(OUTPUT_PATH, 'vendor'),
    flatten: true
  }],
  copyOthers: [{
    from: 'images/**',
    context: resolve('.'),
    to: OUTPUT_PATH
  }, {
    from: './src/robots.txt',
    context: resolve('.'),
    to: OUTPUT_PATH
  }, {
    from: resolve('./src/index.html'),
    to: OUTPUT_PATH,
    flatten: true
  }, {
    from: resolve('./src/manifest.json'),
    to: OUTPUT_PATH,
    flatten: true
  }]
};

/**
 * Plugin configuration
 */
const renderHtmlPlugins = () =>
  [
    new HtmlWebpackPlugin({
      filename: resolve(OUTPUT_PATH, 'index.html'),
      template: `!!ejs-loader!${resolve('./src/index.html')}`,
      minify: ENV === 'production' && {
        collapseWhitespace: true,
        removeScriptTypeAttributes: true,
        removeRedundantAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeComments: true
      },
      inject: true,
      compile: true,
      excludeAssets: [/(bundle|polyfills)(\..*)?\.js$/],
      paths: {
        webcomponents: './vendor/webcomponents-loader.js',
        webanimations: './vendor/web-animations-next.min.js',
        chartjs: './vendor/Chart.bundle.min.js',
        chartjsannotation: './vendor/chartjs-plugin-annotation.min.js',
      }
    }),
    new HtmlWebpackExcludeAssetsPlugin(),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    })
  ];

const sharedPlugins = [
  new webpack.DefinePlugin({'process.env': processEnv}),
  ...renderHtmlPlugins()
];
const devPlugins = [new CopyWebpackPlugin(copyStatics.copyWebcomponents)];
const buildPlugins = [
  new CopyWebpackPlugin(
    [].concat(copyStatics.copyWebcomponents, copyStatics.copyOthers)
  ),
  new InjectManifest({
    swSrc: './src/sw.js',
    swDest: join(OUTPUT_PATH, 'service-worker.js')
  }),
  new CleanWebpackPlugin([OUTPUT_PATH], {verbose: true})
];

const plugins = sharedPlugins.concat(IS_DEV_SERVER ? devPlugins : buildPlugins);

module.exports = {
  mode: ENV,
  entry: './src/components/bnb-app.js',
  output: {
    path: OUTPUT_PATH,
    filename: '[name].[hash].bundle.js'
  },
  devtool: 'cheap-source-map',
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['text-loader']
      },
      {
        test: /\.pcss$/,
        use: ['text-loader', 'postcss-loader']
      },
      {
        test: /\.js$/,
        // We need to transpile Polymer itself and other ES6 code
        // exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [[
              "@babel/preset-env",
              {
                targets: {
                  "esmodules": true
                },
                debug: true
              }
            ]],
            plugins: ['@babel/plugin-syntax-dynamic-import', '@babel/plugin-syntax-object-rest-spread']
          }
        }
      }
    ]
  },
  plugins,
  devServer: {
    contentBase: OUTPUT_PATH,
    historyApiFallback: true,
    compress: true,
    overlay: {
      errors: true
    },
    port: 8081,
    host: '0.0.0.0',
    disableHostCheck: true,
    proxy: [{
      path: ['/api', '/omniauth'],
      target: 'http://localhost:3000/',
      pathRewrite: {'^/api' : ''}
    }]
  }
};
