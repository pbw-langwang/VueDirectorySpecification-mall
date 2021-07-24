module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets':'@/assets',
        'commonJS':'@/commonJS',
        'components':'@/components',
        'network':'@/network',
        // 'router':'@/router', //用$router就可以获取
        // 'store': '@/store',  //用$store就可以获取
        'views': '@/views',
      }
    }
  }
}