module.exports = {
  apps: [{
    name : 'pwa-in-production',
    script: 'app.js',
    source_map_support: true,
    exec_mode: 'fork',
    log_file: 'combined.log',
    out_file: 'out.log',
    error_file: 'err.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    env: {
      'NODE_ENV': 'production',
      'HOST': '0.0.0.0',
      'PORT': 3000
    }
  }]
}
