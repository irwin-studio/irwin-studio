const path = require('path');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
    entry: './src/index.ts',
    target: 'webworker',
    output: {
        filename: 'worker.js',
        path: path.join(__dirname, 'dist'),
    },
    devtool: 'source-map',
    mode: 'production',
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            // hack to get apollo to compile
            fs: path.resolve(__dirname, './src/utils/empty.ts'),
            busboy: path.resolve(__dirname, './src/utils/empty.ts'),
            tls: path.resolve(__dirname, './src/utils/empty.ts'),
            net: path.resolve(__dirname, './src/utils/empty.ts'),

            // This resolver is a fix for an issue causing two graphql constructors to be available
            // problem: https://github.com/apollographql/apollo-server/issues/4983#issuecomment-790922099
            // solution: https://github.com/apollographql/apollo-server/issues/4637#issuecomment-706813287
            graphql$: path.resolve(__dirname, './node_modules/graphql/index.js'),
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    transpileOnly: true,
                },
            },
            // { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
        ],
    },
    optimization: {
        usedExports: true,
    },
    plugins: [
        // new BundleAnalyzerPlugin()
    ],
};
