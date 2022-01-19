const path = require('path');
const webpack = require('webpack');
module.exports = {
  // lintOnSave: 'warning',
  lintOnSave: process.env.NODE_ENV === 'development',
  publicPath: '',

  configureWebpack: {
    // 配置路径的时候
    resolve: {
      // extension配置默认后缀名不用写
      // 别名的配置
      alias: {
        'components': '@/components',
        'content': 'components/content',
        'common': 'components/common',
        'assets': '@/assets',
        'network': '@/network',
        'views': '@/views',
        'styles': '@/styles',
        'utils': '@/utils',
        'icons': '@/icons',
        'filters': '@/filters',
      }
    },
    // 开发模式代理，打包去掉，同一环境同端口下是不存在跨域问题的了
    devServer: {
      //代理多个路径特定到同一个 target 下
      // proxy: 'http://192.168.91.88:18082'
      // proxy: 'http://192.168.90.57:6060/java_backend/',
      proxy: 'http://192.168.91.96:6060/java_backend/',
      // 请求到 /api/xxx 现在会被代理到请求 http://localhost:3000/api/xxx, 
      // proxy: {
      //   '/api': 'http://localhost:3000'
      // }
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "windows.jQuery": "jquery"
      })
    ]
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .test(/\.svg$/)
      .include.add(path.resolve(__dirname, './src/icons')).end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    const fileRule = config.module.rule('file')
    fileRule.uses.clear()
    fileRule
      .test(/\.svg$/)
      .exclude.add(path.resolve(__dirname, './src/icons'))
      .end()
      .use('file-loader')
      .loader('file-loader')

    // const oneOfsMap = config.module.rule('scss').oneOfs.store
    // oneOfsMap.forEach(item => {
    //   item.use('sass-resources-loader')
    //     .loader('sass-resources-loader')
    //     .options({
    //       // 全局变量文件路径，只有一个时可将数组省去
    //       resources: ['./styles/mixin.scss','./styles/util.scss']
    //     })
    //     .end()
    // })
  }
}