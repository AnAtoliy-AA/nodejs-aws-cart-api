const webpack = require('webpack');
const path = require('path');

module.exports = (options) => {
  const lazyImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
  ];

  const { plugins, ...config } = options;

  return {
    ...config,
    entry: ['./src/lambda.ts'],
    externals: [],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      libraryTarget: 'commonjs2',
    },
    plugins: [
      ...plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource, {
                paths: [process.cwd()],
              });
            } catch (err) {
              return true;
            }
          }
          return false;
        },
      }),
    ],
  };
};
