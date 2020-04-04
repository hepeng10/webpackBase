// webstorm 要想支持路径别名跳转，则需要在 setting 里的 webpack 选项中指定 webpack 配置文件，webstorm 通过读取 webpack 配置文件识别路径跳转。但是项目中的 webpack 配置文件使用的 import, export 语法，webstorm 不支持，所以单独写个仿 webpack 配置文件来供 webstorm 使用
// https://www.jianshu.com/p/5d42c667ee08

const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.scss'],
        alias: {
            '@': resolve('src'),
            '@images': resolve('src/images'),
            '@styles': resolve('src/styles'),
            '@utils': resolve('src/utils'),
            '@services': resolve('src/services'),
            '@components': resolve('src/components'),
            '@decorators': resolve('src/decorators'),
        }
    },
};
