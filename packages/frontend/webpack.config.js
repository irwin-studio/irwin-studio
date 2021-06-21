const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const {DefinePlugin} = require('webpack');
const path = require('path');

module.exports = (env, argv) => {
    const mode = argv.mode || 'production';
    const IS_PROD = mode === 'production';

    return {
        context: __dirname,
        target: 'webworker',
        mode: mode,
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
            new CopyWebpackPlugin({patterns: [{from: './src/assets', to: 'assets'}]}),
            ...(IS_PROD ? [new UglifyJsPlugin()] : []),
        ],
        devtool: 'source-map',
        resolve: {
            extensions: ['.js', '.ts', '.tsx'],
        },
    };
};
