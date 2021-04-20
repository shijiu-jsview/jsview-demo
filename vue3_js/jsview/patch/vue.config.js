module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        jsview: require('path').resolve(__dirname, 'jsview')
      }
    },
  }
}
