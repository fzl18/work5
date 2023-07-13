/**
 * @description vue.config.js全局配置
 */
const path = require('path')
const {
  baseURL,
  // proxyURL,
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
} = require('./src/config')
const { webpackBarName, webpackBanner } = require('./core.config')

const { version, author } = require('./package.json')
const Webpack = require('webpack')
const WebpackBar = require('webpackbar')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const dayjs = require('dayjs')
const date = dayjs().format('YYYY_M_D')
const time = dayjs().format('YYYY-M-D HH:mm:ss')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['html', 'js', 'css', 'svg']
process.env.VUE_APP_TITLE = title || 'vue-admin'
process.env.VUE_APP_AUTHOR = author || 'Richie'
process.env.VUE_APP_UPDATE_TIME = time
process.env.VUE_APP_VERSION = version

const resolve = (dir) => {
  return path.join(__dirname, dir)
}

let baseURL2 = '/'

let proxyURL = process.env.VUE_APP_URL || `https://uatbims.boton-tech.com`
let proxy = {
  [baseURL]: {
    target: proxyURL,
    ws: true,
    changeOrigin: true,
    // pathRewrite: {
    //   ['^' + baseURL]: '',
    // },
  },
}

// http: console.log(proxy, '--proxy-proxy')
module.exports = {
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    hot: true,
    port: devPort,
    open: false,
    noInfo: false,
    overlay: {
      warnings: true,
      errors: true,
    },
    // 前端配置反向代理访问后端接口
    proxy: proxy,
  },
  configureWebpack() {
    return {
      output: {
        //输出暴露的名称,假设名称为vueApp
        library: 'vueApp', //输出暴露的类型
        libraryTarget: 'umd',
        jsonpFunction: `webpackJsonp_${webpackBarName}`,
      },
      resolve: {
        alias: {
          '@': resolve('src'),
          '@node': resolve('./node'),
          '@zbCp': resolve('src/module/btzbglSystem/components'),
          '@pcs': resolve('src/module/btzbglSystem/purchaseSystem/core'),
          '@purchaseSystem': resolve('src/module/btzbglSystem/purchaseSystem'),
          '@baseManageSystem': resolve(
            'src/module/btzbglSystem/baseManageSystem'
          ),
          '@storeManage': resolve('src/module/btzbglSystem/storeManage'),
          '@agencySystem': resolve('src/module/btzbglSystem/agencySystem'),
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

    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 4096, // 小于4kb将会被打包成 base64
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'static/img/[name].[hash:8].[ext]',
            publicPath: `${process.env.VUE_APP_APIBASEURL}/${process.env.VUE_APP_SUBNAME}`,
          },
        },
      })
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
                    destination: `./${outputDir}/${abbreviation}_${outputDir}_${date}.7z`,
                  },
                ],
              },
            },
          ])
          .end()
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
