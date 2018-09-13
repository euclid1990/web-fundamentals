const path = require('path');
const resolve = require('resolve')
const moduleDirectories = ['web_modules', 'node_modules']

function resolveModule(id, opts) {
  return new Promise((res, rej) => {
    resolve(id, opts, (err, path) => (err ? rej(err) : res(path)))
  })
}

function resolveImport(id, base, options) {
  // Resolve node_modules, @import '~normalize.css/normalize.css', similar to how css-loader's handling of node_modules
  if (/^~/.test(id)) {
    id = path.resolve('./node_modules', id.slice(1));
  }
  const paths = options.path
  const resolveOpts = {
    basedir: base,
    moduleDirectory: moduleDirectories.concat(options.addModulesDirectories),
    paths: paths,
    extensions: ['.css'],
    packageFilter: function processPackage(pkg) {
      if (pkg.style) {
        pkg.main = pkg.style;
      } else if (!pkg.main || !/\.css$/.test(pkg.main)) {
        pkg.main = 'index.css';
      }
      return pkg
    },
    preserveSymlinks: false,
  }

  return resolveModule(`./${id}`, resolveOpts)
    .catch(() => resolveModule(id, resolveOpts))
    .catch(() => {
      if (paths.indexOf(base) === -1) paths.unshift(base)

      throw new Error(
        `Failed to find '${id}'
  in [
    ${paths.join(",\n        ")}
  ]`
      )
    })
}


module.exports = ({ file, options, env }) => {
  options = Object.assign({
    cssnext: { warnForDuplicates: false },
    cssnano: {},
    autoprefixer: {},
    cssnext: { features: { customProperties: { warnings: false } } },
  }, options);
  return {
    parser: file.extname === '.sss' ? 'sugarss' : false,
    plugins: {
      'postcss-import': {
        filter: (id) => {
          // Ignore all node_modules import file start with [~] and put it into vendors.css
          return !(/^~/.test(id));
        },
        root: file.dirname,
        resolve: (id, basedir, importOptions) => {
          return resolveImport(id, basedir, importOptions);
        }
      },
      'postcss-cssnext': options.cssnext ? options.cssnext : false,
      'autoprefixer': env === 'production' ? options.autoprefixer : false,
      'cssnano': env === 'production' ? options.cssnano : false
    }
  };
};
