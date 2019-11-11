/* eslint-disable @typescript-eslint/no-var-requires */
const { join } = require('path')

function resolve (dir) {
  return join(__dirname, dir)
}

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
    },
    resolve: {
      alias: {
        '@': resolve('src'),
        'UnitTest': resolve('tests/unit')
      }
    }
  }
}
