import path from 'path';
import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import Config from '../src/config';
import baseConfig, { rootDir } from './webpack.config.base';

const env = process.env;
const LocalServer = {
    local: Config.LocalServer.local,
    mock: Config.LocalServer.mock
};

// 配置 webpack-dev-server 的 proxy
const devProxy = () => {
    const MockServer = `${Config.LocalServer.mock.host}:${Config.LocalServer.mock.port}`;

    let proxy = {
        '/mock': {
            target: MockServer,
            pathRewrite: { '^/mock': '' }
        },
    };

    // 遍历配置中所有后端接口域名，对这些接口域名进行代理
    const APIServers = Config.Server;
    for (let k in APIServers) {
        const APIServer = APIServers[k];
        proxy[`/${APIServer}`] = {
            secure: false,
            changeOrigin: true,
            target: APIServer,
            pathRewrite: { [`^/${APIServer}`]: '' },
            cookieDomainRewrite: '',
            cookiePathRewrite: '/',
        };
    }

    return proxy;
};

export default webpackMerge(baseConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    module: {
        rules: [
            {
                /**
                 * eslint代码规范校验
                 */
                test: /\.(js|jsx)$/,
                enforce: 'pre',
                include: rootDir('src'),
                use: [{
                    loader: 'eslint-loader',
                    options: {
                        configFile: '.eslintrc.json',
                    },
                }],
            },
        ]
    },
    plugins: [
        // 出错不终止插件
        new webpack.NoEmitOnErrorsPlugin(),
        // 配置全局变量
        new webpack.DefinePlugin({
            __DEV__: true,
            __MOCK__: env.NODE_ENV === 'mock'
        }),
    ],
    devServer: {
        host: LocalServer.local.host,
        port: LocalServer.local.port,
        hot: true,
        open: true,
        disableHostCheck: true,
        compress: true,     // 开起 gzip 压缩
        contentBase: rootDir('build'),
        proxy: devProxy(),  // 代理要和 axios 发起请求的地址进行对应
    }
});