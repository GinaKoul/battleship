const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = {
  entry: "./src/js/main.js",
  plugins: [
    new MiniCssExtractPlugin(),

    new HtmlWebpackPlugin({
      template: "./src/templates/index.html",
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, "src/assets/fonts"),
    //       to: path.resolve(__dirname, "dist/assets/fonts"),
    //     },
    //   ],
    // }),
    // new FaviconsWebpackPlugin("src/assets/favicon/favicon.png"),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      //   {
      //     test: /\.(png|svg|jpg|jpeg|gif)$/i,
      //     use: [
      //       {
      //         loader: "responsive-loader",
      //         options: {
      //           sizes: [1920, 767],
      //           quality: 85,
      //           placeholder: true,
      //           outputPath: "assets/images",
      //           format: "webp",
      //           // If you want to enable sharp support:
      //           adapter: require("responsive-loader/sharp"),
      //           additionalPaths: [
      //             {
      //               width: 0,
      //               format: "webp",
      //               quality: 85,
      //               outputPath: "assets/images",
      //             },
      //           ],
      //         },
      //       },
      //       // {
      //       //   loader: 'file-loader',
      //       //   options: {

      //       //   }
      //       // }
      //     ],
      //   },
      //   {
      //     test: /\.(woff|woff2|eot|ttf|otf)$/i,
      //     type: "asset/resource",
      //     generator: {
      //       filename: "assets/fonts/[name][ext]",
      //     },
      //   },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin()],
  },
};
