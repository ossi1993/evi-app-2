const path = require("path");

const BundleTracker = require("webpack-bundle-tracker");
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  publicPath: "http://127.0.0.1:8000/",
  outputDir: './dist/',

  chainWebpack: config => {

      config.optimization
          .splitChunks(false)

      config
          .plugin('BundleTracker')
          .use(BundleTracker, [{filename: '../frontend/webpack-stats.json'}])

      config.resolve.alias
          .set('__STATIC__', 'static')

      config.module
          .rule("vue")
          .use("vue-loader")
          .loader("vue-loader")
          .tap(options => {
            options.compilerOptions.preserveWhitespace = true;
            return options;
      });
    
      config.devServer
          .public('http://0.0.0.0:8080')
          .host('0.0.0.0')
          .port(8080)
          .hotOnly(true)
          .watchOptions({poll: 1000})
          .https(false)
          .headers({"Access-Control-Allow-Origin": ["\*"]})
          }
      };

