import * as esbuild from 'esbuild';
import { swcPlugin } from 'esbuild-plugin-swc';

await esbuild.build({
  entryPoints: ['strict.js'],
  bundle: true,
  format: 'esm',
  minify: true,
  keepNames: true,
  legalComments: 'inline',
  target: ['chrome64', 'edge89', 'firefox88', 'safari13', 'opera76'],
  outfile: 'strict.min.js',
  plugins: [
    swcPlugin({
      env: {
        targets: {
          chrome: '64',
          edge: '89',
          firefox: '88',
          safari: '13',
          opera: '76',
        },
      },
      module: {
        type: 'es6',
      },
    }),
  ],
});
await esbuild.build({
  entryPoints: ['strict.js'],
  bundle: true,
  format: 'cjs',
  minify: true,
  keepNames: true,
  legalComments: 'inline',
  target: ['chrome64', 'edge89', 'firefox88', 'safari13', 'opera76'],
  outfile: 'strict.min.cjs',
  plugins: [
    swcPlugin({
      env: {
        targets: {
          chrome: '64',
          edge: '89',
          firefox: '88',
          safari: '13',
          opera: '76',
        },
      },
      module: {
        type: 'commonjs',
      },
    }),
  ],
});
await esbuild.build({
  entryPoints: ['stringList.js'],
  bundle: true,
  format: 'cjs',
  minify: true,
  keepNames: true,
  legalComments: 'inline',
  target: ['node18'],
  outfile: 'stringList.cjs',
  plugins: [
    swcPlugin({
      env: {
        targets: {
          node: '18',
        },
      },
      module: {
        type: 'commonjs',
      },
    }),
  ],
});
await esbuild.build({
  entryPoints: ['stringList.js'],
  bundle: true,
  format: 'cjs',
  minify: true,
  keepNames: true,
  legalComments: 'inline',
  target: ['chrome64', 'edge89', 'firefox88', 'safari13', 'opera76'],
  outfile: 'stringList.min.cjs',
  plugins: [
    swcPlugin({
      env: {
        targets: {
          chrome: '64',
          edge: '89',
          firefox: '88',
          safari: '13',
          opera: '76',
        },
      },
      module: {
        type: 'commonjs',
      },
    }),
  ],
});
await esbuild.build({
  entryPoints: ['stringList.js'],
  bundle: true,
  format: 'esm',
  minify: true,
  keepNames: true,
  legalComments: 'inline',
  target: ['chrome64', 'edge89', 'firefox88', 'safari13', 'opera76'],
  outfile: 'stringList.min.js',
  plugins: [
    swcPlugin({
      module: {
        type: 'es6',
      },
      env: {
        targets: {
          chrome: '64',
          edge: '89',
          firefox: '88',
          safari: '13',
          opera: '76',
        },
      },
    }),
  ],
});
