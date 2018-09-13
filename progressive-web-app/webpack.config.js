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
const devMode = env('NODE_ENV') !== 'production';
const srcPath = env('SOURCE_PATH', 'src');
const buildPath = env('BUILD_PATH', 'build');
const autoprefixer = require('autoprefixer');

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
    devtool: devMode ? 'inline-source-map' : false,
    devServer: {
      contentBase: `${buildPath}`,
      historyApiFallback: true
    },
    module: {
      rules: [
      {
        test: /\.(js)$/,
        loader: 'eslint-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
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
      })
    ]
  };
};
