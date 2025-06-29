module.exports = {
  chainWebpack: config => {
    // CSV 文件处理规则
    config.module
      .rule('csv')
      .test(/\.csv$/)
      .use('csv-loader')
      .loader('csv-loader')
      .options({
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true
      })
      .end()
  },
  // 保留原有的 publicPath 配置（如果之前有）
  publicPath: process.env.NODE_ENV === 'production'
    ? '/Awesome-Trustworthy-Embodied-AI/'
    : '/'
}