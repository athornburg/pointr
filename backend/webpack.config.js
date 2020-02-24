module.exports = {
    target: 'node',
    entry: __dirname + '/src/server.ts',
    node: {
        fs: "empty",
        net: "empty"
    },
    output: {
        path: __dirname + '/dist',
        filename: "server.js"
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