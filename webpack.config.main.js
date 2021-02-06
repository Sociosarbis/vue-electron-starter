module.exports = function (config) {
  config.entry.main = config.entry.main.filter((file) => !/vue-main-dev-entry/.test(file))
  return config
}