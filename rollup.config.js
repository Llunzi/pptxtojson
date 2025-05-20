import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'
import eslint from '@rollup/plugin-eslint'
import terser from '@rollup/plugin-terser'
import globals from 'rollup-plugin-node-globals'
import builtins from 'rollup-plugin-node-builtins'

const isProd = process.env.NODE_ENV === 'production'

const onwarn = warning => {
  if (warning.code === 'CIRCULAR_DEPENDENCY') return

  console.warn(`(!) ${warning.message}`) // eslint-disable-line
}

export default {
  input: 'src/pptxtojson.js',
  onwarn,
  output: [
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'pptxtojson',
      sourcemap: !isProd,
      plugins: [
        isProd && terser({
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        })
      ].filter(Boolean)
    },
    {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: !isProd,
      plugins: [
        isProd && terser({
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        })
      ].filter(Boolean)
    },
  ],
  plugins: [
    nodeResolve({
      preferBuiltins: false,
    }),
    commonjs(),
    eslint(),
    babel({
      babelHelpers: 'runtime',
      exclude: ['node_modules/**'],
    }),
    isProd && terser(),
    globals(),
    builtins(),
  ].filter(Boolean)
}