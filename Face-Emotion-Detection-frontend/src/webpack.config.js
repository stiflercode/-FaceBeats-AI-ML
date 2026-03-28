module.exports = {
    resolve: {
      modules: [
        
      ],
      fallback: {
        fs: require.resolve('browserfs/dist/shims/fs.js'),
        path: false,
        crypto: false
      }
    }
  }
  