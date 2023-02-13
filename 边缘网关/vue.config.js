/**
 * @description vue.config.js全局配置
 */
const yargs = require('yargs')
const path = require('path')
const {
  baseURL,
  proxyURL,
  indexPath,
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  title,
  abbreviation,
  devPort,
  providePlugin,
  build7z,
  track,
} = require('./src/config')
const { webpackBarName, webpackBanner } = require('./core.config')
const WebpackHookPlugin = require('webpack-hook-plugin')

const { version, author } = require('./package.json')
const Webpack = require('webpack')
const WebpackBar = require('webpackbar')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const dayjs = require('dayjs')
const date = dayjs().format('YYYY_M_D')
const time = dayjs().format('YYYY-M-D HH:mm:ss')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['html', 'js', 'css', 'svg']
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
process.env.VUE_APP_TITLE = title || 'vue-admin'
process.env.VUE_APP_AUTHOR = author || 'Richie'
process.env.VUE_APP_UPDATE_TIME = time
process.env.VUE_APP_VERSION = version
process.env.VUE_APP_TRACK = track

const argv = yargs.argv

const resolve = (dir) => {
  return path.join(__dirname, dir)
}

console.info('process.env.NODE_ENV=' + process.env.NODE_ENV)
console.info('analyzer=' + argv.analyzer)
module.exports = {
  indexPath,
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  devServer: {
    hot: true,
    port: devPort,
    open: true,
    noInfo: false,
    disableHostCheck: true,
    overlay: {
      warnings: true,
      errors: true,
    },
    // 前端配置反向代理访问后端接口
    proxy: {
      [process.env.VUE_APP_BASEAPI]: {
        target: proxyURL,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASEAPI]: '',
        },
      },
    },
  },
  configureWebpack() {
    return {
      resolve: {
        alias: {
          '@': resolve('src'),
          '*': resolve(''),
        },
      },
      plugins: [
        new Webpack.ProvidePlugin(providePlugin),
        new WebpackBar({
          name: webpackBarName,
        }),
      ],
    }
  },
  chainWebpack(config) {
    config.resolve.symlinks(true)
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icon/remixIcon'))
      // .add(resolve('src/icon/colorfulIcon'))
      .end()

    config.module
      .rule('remixIcon')
      .test(/\.svg$/)
      .include.add(resolve('src/icon/remixIcon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'remix-icon-[name]' })
      .end()

    // config.module
    //   .rule('colorfulIcon')
    //   .test(/\.svg$/)
    //   .include.add(resolve('src/icon/colorfulIcon'))
    //   .end()
    //   .use('svg-sprite-loader')
    //   .loader('svg-sprite-loader')
    //   .options({ symbolId: 'colorful-icon-[name]' })
    //   .end()

    config.when(process.env.NODE_ENV === 'development', (config) => {
      config.devtool('source-map')
    })

    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config.performance.set('hints', false)
      config.devtool('none')
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial',
          },
          elementUI: {
            name: 'element-ui',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
          },
          flowLibs: {
            name: 'flow-libs',
            priority: 30,
            test: /[\\/]node_modules[\\/][_@]?(jquery.*|antv.*)/,
          },
        },
      })
      config
        .plugin('banner')
        .use(Webpack.BannerPlugin, [`${webpackBanner}${time}`])
        .end()
      config
        .plugin('compression')
        .use(CompressionWebpackPlugin, [
          {
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
              '\\.(' + productionGzipExtensions.join('|') + ')$'
            ),
            threshold: 8192,
            minRatio: 0.8,
          },
        ])
        .end()
    })

    if (argv.analyzer) {
      config.plugin('analyzer').use(new BundleAnalyzerPlugin()).end()
    }

    if (build7z) {
      config.when(process.env.NODE_ENV === 'production', (config) => {
        config
          .plugin('fileManager')
          .use(FileManagerPlugin, [
            {
              onEnd: {
                delete: [`./${outputDir}/video`, `./${outputDir}/data`],
                archive: [
                  {
                    source: `./${outputDir}`,
                    destination: `./${outputDir}/${abbreviation}_${outputDir}_${date}.zip`,
                  },
                ],
              },
            },
          ])
          .end()
      })
    }
    if (process.env.VUE_APP_MODE === 'server') {
      config
        .plugin('hook')
        .use(WebpackHookPlugin)
        .tap((args) => {
          console.log(args)
          args[0] = {
            // onBuildStart: ['echo "Webpack Start"'],
            onBuildEnd: ['node dist/server/movefile.js'],
          }
          return args
        })
    }
  },
  runtimeCompiler: true,
  productionSourceMap: false,
  css: {
    requireModuleExtension: true,
    sourceMap: true,
    loaderOptions: {
      scss: {
        additionalData(content, loaderContext) {
          const { resourcePath, rootContext } = loaderContext
          const relativePath = path.relative(rootContext, resourcePath)
          if (
            relativePath.replace(/\\/g, '/') !== 'src/config/variables.scss'
          ) {
            return '@import "~@/config/variables.scss";' + content
          }
          return content
        },
      },
    },
  },
}
