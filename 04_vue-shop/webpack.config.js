module.exports = {
    module: {
        rules: [
            {
                test: /\.less$/,
                // loader: "style-loader!css-loader!less-loader"
                use: ['less-loader', 'css-loader', 'style-loader']
            }
        ]
    }
}