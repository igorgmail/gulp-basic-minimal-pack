const config = {
	// Если одна точка входа то этот ключ не нужен
	entry: {
		index: './src/js/index.js',
		some: './src/js/some.js'
	},
	output: {
		// filename: 'entry.js', // Если одна точка входа
		filename: '[name].js',
	},
	//mode: init.isProd ? 'production' : 'development'
	mode: 'development',
	devtool: 'eval-source-map',
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			}
		]
	},
}

export default config;