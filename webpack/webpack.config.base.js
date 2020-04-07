import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const STATIC_PATH = 'static';

const IS_DEV = process.env.ENV !== 'PROD';

// 从项目根目录开始
export function rootDir(dir) {
    return path.join(__dirname, '../', dir);
}

export default {
    entry: {
        main: ['react-hot-loader/patch', rootDir('src/index.jsx')],
    },
    output: {
        publicPath: '/',
        path: rootDir('build'),
        filename: `${STATIC_PATH}/js/[hash].[name].js`,
        chunkFilename: `${STATIC_PATH}/js/[name].[hash:5].chunk.js`,
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.less'],
        alias: {
            'react-dom': '@hot-loader/react-dom',
            '@': rootDir('src'),
            '@config': rootDir('src/config'),
            '@containers': rootDir('src/containers'),
            '@images': rootDir('src/images'),
            '@styles': rootDir('src/styles'),
            '@utils': rootDir('src/utils'),
            '@services': rootDir('src/services'),
            '@components': rootDir('src/components'),
            '@decorators': rootDir('src/decorators'),
            '@routes': rootDir('src/routes'),
            '@stores': rootDir('src/stores'),
            '@hooks': rootDir('src/hooks'),
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: rootDir('src'),
                use: ['babel-loader']
            },
            {
                /**
                 * 第三方组件的css抽离为独立文件vendor.css
                 */
                test: /\.css$/,
                include: rootDir('node_modules'),
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
                include: rootDir('src'),
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
                include: rootDir('src/fonts'),
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
                exclude: rootDir('src/fonts'),
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
                include: rootDir('src/images'),
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
                include: rootDir('src'),
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
            template: 'src/index.html',
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
