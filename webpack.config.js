const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const cssnext = require('postcss-cssnext');

module.exports = env => ({

	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
		filename: env === 'production'
			? '[chunkhash].js'
			: '[name].js',

	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			{
				test: /(pdfkit|linebreak|fontkit|unicode|brotli|png-js).*\.js$/,
				use: 'transform-loader?brfs'
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				include: /node_modules/,
				use: {
					loader: 'file-loader',
					options: {
						name: '../../assets/build/[hash].[ext]'
					}
				}
			},
			...(env === 'production'
				? [
					{
						test: /\.css$/,
						use: ExtractTextPlugin.extract({
							fallback: 'style-loader',
							use: [
								{
									loader: 'css-loader',
									options: {
										minimize: true,
										sourceMap: false
									}
								},
								{
									loader: 'postcss-loader',
									options: {
										plugins: [
											cssnext()
										]
									}
								}
							]
						})
					}
				]
				: [
					{
						test: /\.css$/,
						use: [
							'style-loader',
							{
								loader: 'css-loader',
								options: {
									minimize: true,
									sourceMap: false
								}
							},
							{
								loader: 'postcss-loader',
								options: {
									plugins: [
										cssnext()
									]
								}
							}
						]
					}
				]
			)
		]
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			minChunks: 2,
			async: false,
			children: true
		}),
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			template: './src/index.ejs'
		}),
		new BundleAnalyzerPlugin({
			analyzerMode: 'disabled',
			generateStatsFile: true
		}),
		...(env === 'production'
			? [
				new webpack.optimize.ModuleConcatenationPlugin(),
				new ExtractTextPlugin('styles.css')
			]
			: [
				new webpack.NamedModulesPlugin(),
				new webpack.HotModuleReplacementPlugin()
			]
		)
	],
	devtool: 'source-map',
	devServer: {
		contentBase: './dist',
		hot: true
	},
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty'
	}
});
