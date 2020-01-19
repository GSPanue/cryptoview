import webpack from 'webpack';
import path from 'path';

import baseConfig from './webpack.base.config.babel';

const root = path.resolve(__dirname, '..');
const plugins = baseConfig.plugins;

baseConfig.plugins = [
  ...plugins,
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
];

const config = {
  mode: 'development',
  devServer: {
    contentBase: path.join(root, 'dist'),
    compress: true,
    historyApiFallback: true
  },
  ...baseConfig
};

export default config;
