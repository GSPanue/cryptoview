import nodeExternals from 'webpack-node-externals';
import Dotenv from 'dotenv-webpack';
import path from 'path';

const root = path.resolve(__dirname, '..');

const config = {
  mode: 'production',
  entry: path.join(root, 'src'),
  output: {
    path: path.join(root, 'dist'),
    filename: 'bundle.min.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: [path.join(root, 'node_modules')]
      },
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        exclude: [path.join(root, 'node_modules')]
      }
    ]
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new Dotenv()
  ]
}

export default config;
