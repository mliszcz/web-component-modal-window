
export default {
  entry: 'src/x-modal-window.js',
  dest: 'dist/x-modal-window.js',
  format: 'iife',
  moduleName: 'xComponents',
  plugins: [],
  sourceMap: true,
  external: [
    'window',
    'jQuery'
  ],
  globals: {
    'window': 'window',
    'jQuery': 'window.$'
  }
}
