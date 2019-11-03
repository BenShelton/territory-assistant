module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    devServer: {
      proxy: {
        '/.netlify/functions': {
          target: 'http://localhost:9000'
        }
      }
    }
  }
}
