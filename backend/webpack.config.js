module.exports = {
    target: 'node',
    entry: __dirname + '/src/boot.ts',
    externals: {
        uws: 'uws'
    },
    node: {
        fs: "empty",
        net: "empty"
    },
    output: {
        path: __dirname + '/dist',
        filename: "boot.js"
    },
    resolve: {
        extensions: ['.js','.json', '.ts']
    },
    module: {
        rules: [
            {test: /\.tsx?$/, loader: "awesome-typescript-loader"}
        ]
    }
};