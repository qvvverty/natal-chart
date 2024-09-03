const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',  // Входной файл
  output: {
    filename: 'bundle.js',  // Имя выходного файла
    path: path.resolve(__dirname, 'dist'),  // Путь для выходного файла
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Регулярное выражение для поиска всех CSS-файлов
        use: [
          'style-loader', // Встраивает CSS в DOM
          'css-loader'    // Обрабатывает CSS-файлы (например, с модулями, импортами)
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',  // Исходный HTML-файл
      filename: 'index.html',  // Имя файла в папке dist
      inject: false,
    }),
  ],
  mode: 'development',  // Устанавливаем режим разработки
};
