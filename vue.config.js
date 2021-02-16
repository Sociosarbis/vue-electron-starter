const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  chainWebpack: config => {
    config.module
      .rule('glsl')
      .test(/\.(glsl|vs|fs|vert|frag)$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
      .use('glslify-loader')
      .loader('glslify-loader')
  },
  publicPath: isProd ? './' : '/',
  outputDir: isProd ? './dist/renderer' : 'dist'
}