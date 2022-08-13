const Encore = require('@symfony/webpack-encore')
const path = require('path')

if (!Encore.isRuntimeEnvironmentConfigured()) {
  Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev')
}

Encore
  .setOutputPath('public/build/')
  .setPublicPath('/build')
  .enableReactPreset()
  .addAliases({
    '@': path.resolve('assets'),
  })
  .addEntry('app', './assets/app.tsx')
  .splitEntryChunks()
  .cleanupOutputBeforeBuild()
  .enableSourceMaps(!Encore.isProduction())
  .enableVersioning(Encore.isProduction())
  .disableSingleRuntimeChunk()
  .configureBabel(() => {}, {
    useBuiltIns: 'usage',
    corejs: 3
  })
  .enableSassLoader()
  .enablePostCssLoader()
  .enableTypeScriptLoader()

module.exports = Encore.getWebpackConfig()
