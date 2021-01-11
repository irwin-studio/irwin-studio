const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {DefinePlugin} = require('webpack');
const path = require('path');

module.exports = {
    context: __dirname,
    target: 'webworker',
    mode: 'development',
    entry: './src/index.tsx',
    devServer: {
        historyApiFallback: true,
        host: '0.0.0.0',
    },
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                },
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'source-map-loader',
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                        },
                    },
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
              },
        ],
    },
    plugins: [
        new DefinePlugin({
            IS_TESTING: undefined,
        }),
        new HtmlWebpackPlugin({
            favicon: './src/assets/favicon.svg',
            template: './src/index.html',
            title: 'Irwin Studio',
        }),
        new CopyWebpackPlugin({ patterns: [ { from: './src/assets', to: 'assets' } ] })
    ],
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
    },
};
