import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

export default {
    input: './src/tooltip.ts',
    output: [{
        file:'./dist/tooltip.esm.js',
        format: 'esm',
        sourcemap: true
    }, {
        file: './dist/tooltip.js',
        format: 'umd',
        name: 'window',
        sourcemap: true,
        extend: true
    }],
    plugins: [
        typescript(),
        terser()
    ]
}
