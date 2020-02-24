/* tslint:disable */
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var TerserPlugin = require('terser-webpack-plugin');
var webpack = require('webpack');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var PurifyCSSPlugin = require("purifycss-webpack");
var glob = require('glob');

var PATHS = {
    app: path.join(__dirname, "src")
};

module.exports = {
    entry: __dirname + '/index.tsx',
    output: {
        path: __dirname + '/dist/web',
        filename: "[name].[chunkhash].js"
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        minimizer: [new TerserPlugin()]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
    },
    module: {
        rules: [
            {test: /\.tsx?$/, loader: "awesome-typescript-loader"},
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "fonts/[name].[ext]"
                    }
                }
            },
            {
                test: /\.(jpg|png|svg)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 25000
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    "css-loader"
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({template: path.resolve('index.html')}),
        new webpack.HashedModuleIdsPlugin(),
        new MiniCssExtractPlugin(
            {
                filename: '[name].[hash].css',
                chunkFilename: '[id].[hash].css'
            }
        ),
        new PurifyCSSPlugin({
            paths: glob.sync(PATHS.app + '/**/*.css', {nodir: true})
        }),
    ]
};