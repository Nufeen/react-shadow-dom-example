const pkg = require('./package.json');

const env = process.env.NODE_ENV;
const cdn = env == 'production' ? pkg.url.cdn : '';

module.exports = {
  plugins: [
    require('postcss-import'),

    require('postcss-url')({
      url: asset => (env == 'production' ? `${cdn}/${asset.url}` : asset.url),
    }),

    require('autoprefixer'),

    require('postcss-preset-env')({
      stage: 1,
      preserve: 'all',
    }),

    require('postcss-reporter'),
  ],
};
