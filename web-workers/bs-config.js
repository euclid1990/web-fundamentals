module.exports = {
  port: 8000,
  files: ['./**/*.{html,htm,css,js}'],
  ghostMode: false,
  watchOptions: {
    ignored: 'node_modules'
  },
  ui: {
    port: 8001
  }
};
