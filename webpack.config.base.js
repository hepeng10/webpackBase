import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const STATIC_PATH = 'static';

const IS_DEV = process.env.ENV !== 'PROD';

function resolve(dir) {
    return path.join(__dirname, dir);
}

export default {
    entry: {
        main: ['react-hot-loader/patch', './src/index.jsx'],
    },
    output: {
        publicPath: '/',
        path: path.join(__dirname, 'build'),
        filename: `${STATIC_PATH}/js/[hash].[name].js`,
        chunkFilename: `${STATIC_PATH}/js/[name].[hash:5].chunk.js`,
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.less'],
        alias: {
            'react-dom': '@hot-loader/react-dom',
            '@': resolve('src'),
            '@config': resolve('src/config'),
            '@containers': resolve('src/containers'),
            '@images': resolve('src/images'),
            '@styles': resolve('src/styles'),
            '@utils': resolve('src/utils'),
            '@services': resolve('src/services'),
            '@components': resolve('src/components'),
            '@decorators': resolve('src/decorators'),
            '@routes': resolve('src/routes'),
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: path.join(__dirname, 'src'),
                use: ['babel-loader']
            },
            {
                /**
                 * 第三方组件的css抽离为独立文件vendor.css
                 */
                test: /\.css$/,
                include: path.join(__dirname, 'node_modules'),
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                /**
                 * 主项目的css合并到style.css
                 */
                test: /\.(css|less)$/,
                include: path.join(__dirname, 'src'),
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: IS_DEV,  // 开发的时候开启hmr
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[name]_[local]--[hash:base64:5]',
                            },
                            importLoaders: 2,
                        }
                    },
                    'postcss-loader',
                    'less-loader',
                ]
            },
            {
                /**
                 * 字体加载器
                 */
                test: /\.(woff|eot|ttf|svg)$/,
                include: path.join(__dirname, 'src/fonts'),
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10,
                        name: `${STATIC_PATH}/fonts/[hash].[ext]`
                    }
                }]
            },
            {
                /**
                 * 图片加载器
                 */
                test: /\.(png|jpg|jpeg|gif|svg|xlsx)$/,
                exclude: path.join(__dirname, 'src/fonts'),
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: `${STATIC_PATH}/images/[hash].[ext]`
                    }
                }]
            },
            {
                test: /\.ico$/,
                include: path.join(__dirname, 'src/images'),
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: `${STATIC_PATH}/images/[name].[ext]`
                    }
                }]
            },
            {
                test: /\.json$/,
                include: path.join(__dirname, 'src'),
                use: [{
                    loader: 'json-loader'
                }]
            }
        ]
    },
    plugins: [
        // 清除编译目录
        new CleanWebpackPlugin(),
        // 主页面入口index.html
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
        }),
        // 抽离CSS。开发的时候不能加 hash 值，加了的话就不能 HMR 了
        new MiniCssExtractPlugin({
            filename: IS_DEV ? `${STATIC_PATH}/css/[name].css` : `${STATIC_PATH}/css/[name].[hash].css`,
            chunkFilename: IS_DEV ? `${STATIC_PATH}/css/[name].css` : `${STATIC_PATH}/css/[name].[hash].css`
        }),
        // // 文件大小写检测
        new CaseSensitivePathsPlugin(),
    ]
};
