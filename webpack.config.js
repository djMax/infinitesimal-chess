const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  config.module.rules.push(
    {
      test: /\.ttf$/,
      loader: 'url-loader', // or directly file-loader
      include: path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
    },
    {
      test: /\.mjs$/,
      exclude: [/node_modules\/@legendapp\/state\/persist-plugins\/mmkv/],
    },
    {
      test: /\.mjs$/,
      include: /node_modules\/@legendapp/,
      type: 'javascript/auto',
    },
  );

  config.resolve.alias = config.resolve.alias || {};
  config.resolve.alias['react-native-svg'] = 'react-native-svg-web';

  return config;
};
