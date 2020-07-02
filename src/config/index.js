/**
 * @desc 项目配置文件
 */
import { HttpMethod, ContentType } from '../constants/enum';

const ENV = process.env.ENV;

export const LocalServer = {
    local: {
        host: '0.0.0.0',
        port: '8888'
    },
    mock: {
        host: '0.0.0.0',
        port: '9999'
    }
};

// 配置后端 API 接口域名
export const Server = {
    // 本项目部署服务器的后端域名
    local: (() => {
        let url = '';
        switch (ENV) {
            case 'DEV':
                url = 'http://dev.xxx.xxx:8080';
                break;
            case 'TEST':
                url = 'http://test.xxx.xxx:8080';
                break;
            case 'PROD':
                url = 'https://xxx.xxx.xxx/';
                break;
            default:
                url = 'http://dev.xxx.xxx:8080';
        }
        return url;
    })(),
    // 跨域请求其它服务器的域名，可配置多个
    other1: (() => {
        let url = '';
        switch (ENV) {
            case 'DEV':
                url = 'http://105.123.21.89:8088';
                break;
            case 'TEST':
                url = 'http://105.123.21.90:8088';
                break;
            default:
                url = 'http://105.123.21.89:8088';
        }
        return url;
    })(),
    other2: 'http://123.123.21.89:8088',
};

export const http = {
    cache: false,
    timeout: 120000,
    showError: true,
    processError: true,
    enableLoading: false,                       // 默认是否显示所有请求的loading动画
    type: HttpMethod.GET,                      // 默认请求方式
    contentType: ContentType.JSON              // API接口请求默认发送的contentType
};
