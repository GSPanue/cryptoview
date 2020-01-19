import VueLoaderPlugin from 'vue-loader/lib/plugin';
import path from 'path';

const root = path.resolve(__dirname, '..');

const config = {
  entry: path.join(root, 'src'),
  output: {
    path: path.join(root, 'dist/js'),
    publicPath: '/js/',
    filename: 'bundle.min.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      '@': path.join(root, 'src'),
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};

export default config;
