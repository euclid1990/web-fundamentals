const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv'); dotenv.config();
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
const workboxPlugin = require('workbox-webpack-plugin');
const dashboardMode = JSON.parse(env('DASHBOARD', false)) ? true : false;
const devMode = env('NODE_ENV') !== 'production';
const srcPath = env('SOURCE_PATH', 'src');
const buildPath = env('BUILD_PATH', 'build');
const autoprefixer = require('autoprefixer');
const apiUrl = env('API_URL');

// Get environment variable function
function env(e, d = '') {
  if (typeof process.env[e] === 'undefined' || process.env[e] === '') return d;
  return process.env[e];
}

// Generate src/scripts/configs.[development|production].js secrets file
function generateSecretConfig() {
  const NODE_ENV = env('NODE_ENV', 'development');
  const ENV_FILE = path.join(__dirname, '.env');
  let configsPath = path.join(__dirname, `${srcPath}/scripts/configs.${NODE_ENV}.js`);
  if (!fs.existsSync(ENV_FILE)) {
    console.info('Please initialize .env (copy .env.example) before perform build.')
    process.exit()
  }
  if (!fs.existsSync(configsPath)) {
    let configs = dotenv.parse(fs.readFileSync(ENV_FILE, { encoding: 'utf-8' }));
    let content = {}
    _.forEach(configs, function(v, k) {
      content[_.camelCase(k)] = v;
    });
    content = JSON.stringify(content, undefined, 2);
    content = `export default ${content};`;
    fs.writeFileSync(configsPath, content);
  }
  return configsPath;
}

let configsPath = generateSecretConfig();
if (dashboardMode) {
  var dashboard = new Dashboard();
}

module.exports = () => {
  return {
    mode: env('NODE_ENV', 'development'),
    target: 'web',
    entry: path.join(__dirname, `${srcPath}/scripts/app.js`),
    output: {
      filename: devMode ? 'js/[name].js' : 'js/[name].[hash].js',
      path: path.resolve(__dirname, buildPath)
    },
    resolve: {
      alias: {
        vue: 'vue/dist/vue.js',
        configs: configsPath
      }
    },
    devtool: devMode ? 'cheap-eval-source-map' : false,
    devServer: {
      contentBase: `${buildPath}`,
      historyApiFallback: true,
      port: 8080,
      quiet: dashboardMode,   // Lets WebpackDashboard output all build information
      open: true              // Open web browser
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          loader: 'eslint-loader'
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {}
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../'
              }
            },
            {
              loader: 'css-loader',
              options: { importLoaders: 1 }
            },
            { loader: 'postcss-loader' },
            {
              loader: 'sass-loader',
              options: {
                includePaths: [path.resolve(__dirname, 'node_modules')]
              }
            }
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              useRelativePath: true,
              outputPath: 'img',
              context: 'src/images/img'
            }
          }]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts',
            }
          }]
        },
        {
          test: /\.html$/,
          use: {
            loader: 'html-loader',
            options: {
              interpolate: true,
              attrs: ['img:src']
            }
          }
        }
      ]
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          commons: {
            name: 'vendors',
            minChunks: 1,
            minSize: 1000,
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
          }
        }
      }
    },
    plugins: [
      new CleanWebpackPlugin([path.resolve(__dirname, `${buildPath}`)]),
      new MiniCssExtractPlugin({ filename: devMode ? 'css/[name].css' : 'css/[name].[hash].css' }),
      new VueLoaderPlugin(),
      new CopyWebpackPlugin([
        { from: `images`, to: `img` },
        { from: `manifest.json`, to: `manifest.json` }
      ], { context: srcPath }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `${srcPath}/index.html`),
        filename: 'index.html',
        chunks: ['vendors', 'main']
      }),
      new workboxPlugin.GenerateSW({
        swDest: 'service-worker.js',
        importWorkboxFrom: 'local',
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
            handler: 'cacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
              }
            }
          },
          {
            urlPattern: new RegExp(`${apiUrl}/*`),
            handler: 'cacheFirst',
            options: {
              cacheName: 'currencies',
              expiration: {
                maxAgeSeconds: 60 * 60
              }
            }
          },
          {
            urlPattern: new RegExp('https://query.yahooapis.com/*'),
            handler: 'networkFirst',
            options: {
              cacheName: 'weathers',
              expiration: {
                maxAgeSeconds: 60 * 60 * 24
              }
            }
          }
        ]
      }),
      dashboardMode ? new DashboardPlugin(dashboard.setData) : () => {}
    ]
  };
};
