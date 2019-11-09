const path = require('path');

module.exports = {
  entry: './src/recursive-diff.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'recursive-diff.js',
    library: 'recursiveDiff',
    libraryTarget: 'umd',
    globalObject: '(typeof self !== \'undefined\' ? self : this)',
  },
};
