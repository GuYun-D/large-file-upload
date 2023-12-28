const babel = require('@rollup/plugin-babel')
const vue = require('rollup-plugin-vue')
const { terser } = require('rollup-plugin-terser')
const postCss = require('rollup-plugin-postcss')

module.exports = {
  input: './index.js',
  output: [
    {
      format: 'umd',
      name: 'bee-large-file-upload',
      file: 'dist/bee-large-file-upload.umd.js',
      extend: true
    },

    {
      format: 'es',
      name: 'bee-large-file-uploadIife',
      file: 'dist/bee-large-file-upload.es.js',
      extend: true
    }, 

    {
      format: 'iife',
      name: 'bee-large-file-uploadIife',
      file: 'dist/bee-large-file-upload.browser.js',
      extend: true
    }
  ],
  plugins: [
    vue({
      css: true,
      compileTemplate: true
    }),
    babel({
      exclude: '**/node_modules/**',
      babelHelpers: 'bundled'
    }),
    postCss(),
    terser()
  ]
}
