import axios from 'axios';
import qs from 'querystring';
import { message } from 'antd';
import * as Config from '../config';
import { HttpMethod, ContentType } from '../constants/enum';
import { SERVER_ERROR, BROWSER_ERROR } from '../constants/statusCode';
import { isString, isFormData, isIE, isEmpty, isNotEmpty, isNotBlank, getToken, clearLocalUserInfo } from './util';
import loading from '../stores/loading';

let sourceUrl = '';

let count = 0;  // loading 计数器
/**
 * @author Stephen Liu
 * @desc 使用axios第三方库访问后台服务器, 返回封装过后的Promise对象.
 * @param {string} prefix 请求的接口地址前缀, 格式: "/xxx...".
 * @param {string} url 请求的接口地址, 格式: "/xxx...".
 * @param {string} domain 跨域请求的域名地址, 如: http://www.baidu.com
 * @param {object} data 请求的数据, object对象格式.
 * @param {function} onUpload 上传文件过程中的回调函数, 接收progressEvent参数.
 * @param {function} onDownload 下载文件过程中的回调函数, 接收progressEvent参数.
 * @param {function} cancel 取消请求的回调函数, 接收cancel参数, 当执行cancel()参数时请求被取消.
 * @param {boolean} enableLoading 是否开启loading动画
 * @param {boolean} showError 是否显示错误消息, 默认true.
 * @param {boolean} processError 是否处理错误, 默认true.
 * @param {string} type HTTP请求方式, 默认GET.
 * @param {ticket} ticket 用于服务器判断是否登录.
 * @param {boolean} cache 是否开启缓存, 开启后同样的请求(url相同, 参数相同), 第二次请求时会直接返回缓存数据, 不会请求后台数据, 默认false.
 * @param {number} timeout 配置请求超时时间, 为毫秒数, 默认从配置文件读取.
 * @param {string} contentType HTTP请求头的Content-Type, 如: 'application/x-www-form-urlencoded'
 * @param {function} transformRequest 在发送请求前对请求数据进行预处理, 函数接收1个参数, 为请求的数据, 需要return处理后的数据.
 * @param {function} transformResponse 接受到响应后在resolve之前对响应数据进行预处理, 函数接受2个参数, 包括响应的数据和请求时的config对象, 需要return过滤后的数据.
 * @param {function} responseInterceptor 在resolve之前拦截resolve, 可根据返回的数据自定义Promise是resolve还是reject, 如success为false的情况.
 * @return {object} - 返回一个promise的实例对象.
 */
export default function http(args) {

    let options = {
        enableLoading: Config.http.enableLoading,
        showError: Config.http.showError,
        processError: Config.http.processError,
        type: Config.http.type,
        cache: Config.http.cache,
        timeout: Config.http.timeout,
        contentType: Config.http.contentType,
        transformRequest: Config.http.transformRequest,
        transformResponse: Config.http.transformResponse,
        responseInterceptor: Config.http.responseInterceptor,
        ...args
    };

    let {
        prefix = '',
        url,
        domain,
        data,
        onUpload,
        onDownload,
        cancel,
        enableLoading,
        showError,
        type,
        ticket,
        cache,
        timeout,
        contentType,
        transformRequest,
        transformResponse
    } = options;

    let getData;
    let postData;
    let cancelToken;
    let crossDomain = false;

    const statusCode = {
        success: 200,
        paramsError: 400,
        authError: 401,
        noAuth: 403,
        loginLose: 440,
        netError: 500,
        unRealize: 501,
        systemUpdate: 502,
    };

    if (isEmpty(url)) {
        return Promise.resolve();
    }

    // 拼接 prefix 和 url => 'prefix/url' || 'url'
    // 删除 prefix 前面的 /
    if (prefix && /^\//.test(prefix)) {
        prefix = prefix.substr(1);
    }
    // 添加 prefix 末尾的 /
    if (prefix && !(/\/$/.test(prefix))) {
        prefix = `${prefix}/`
    }
    // 删除 url 前面的 /
    if (/^\//.test(url)) {
        url = url.substr(1);
    }
    // 拼接
    url = `${prefix}${url}`;

    // 预处理数据
    if (transformRequest) {
        data = transformRequest.call(options, data);
    }

    // type 为 POST 的请求会将参数转化为 formData 传递
    if (type === HttpMethod.POST || type === HttpMethod.PUT || type === HttpMethod.DELETE) {
        postData = data;
        // 根据配置的 contentType 对数据进一步处理
        if (contentType === ContentType.FORM_URLENCODED) {
            if (isNotEmpty(postData) && !isFormData(postData)) {
                postData = qs.stringify(postData, { allowDots: true });
            }
        }
    } else {
        getData = data;
    }

    if (isNotEmpty(cancel)) {
        cancelToken = new axios.CancelToken(cancel);
    }

    if (isEmpty(getData)) {
        getData = {};
    }

    if (!cache) {
        getData.t = new Date().getTime();
    }

    if (ticket) {
        getData.ticket = ticket;
    }

    if (isNotEmpty(domain)) {
        crossDomain = true;
    }

    if (__DEV__) {
        log({ url, domain, type, data }, 'Request');

        crossDomain = true;

        if (__MOCK__) {
            // 只 mock 同域下的接口请求
            if (isEmpty(domain)) {
                url = `/mock/${url}`;
            }
        } else {
            // 开发环境 domain 有3种情况：
            // 1、项目部署服务器的 domain
            // 2、其它服务器需要 webpack-dev-server 代理的 domain
            // 3、其它服务器不需要 webpack-dev-server 代理的 domain
            /*
            开发环境中，要通过 webpack-dev-server 的 proxy 来请求其它域名，而不是直接请求，那样会出现跨域问题
            则需要将 domain 和 url 拼接为 url
            并且清除 domain 加上 /，因为有 domain 或者不是以 / 开头，axios 就会直接发起对 domain 的请求而不会通过 proxy 代理
            这里把 domain 放到 url 里，然后在 proxy 里配置，将这个 domain 通过 proxy 进行代理
            */
            if (domain) {
                // 是否需要通过 webpack-dev-server 代理
                let isProxy = false;
                for (let k in Config.Server) {
                    if (Config.Server[k].includes(domain)) {
                        isProxy = true;
                    }
                }

                if (isProxy) {
                    url = `/${domain}/${url}`;  // 前面加了 / 才是请求 webpack-dev-server 启动的服务器
                    domain = null;
                } else {
                    url = `/${url}`;
                }
            } else {
                const domain = Config.Server.local;
                url = `/${domain}/${url}`;
            }
        }
    }

    showLoading(enableLoading);

    let promise = new Promise(function(resolve, reject) {

        if (contentType === ContentType.FILE) {
            try {
                let params = qs.stringify(getData, { allowDots: true });
                url = url + '?' + params;
                resolve(url);
            } catch (e) {
                reject(e);
            }
        } else {
            axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

            const token = getToken();
            if (token) {
                axios.defaults.headers.common['token'] = token;
                axios.defaults.headers.common['x-auth-token'] = token;
            } else {
                delete axios.defaults.headers.common['token'];
                delete axios.defaults.headers.common['x-auth-token'];
            }

            if (type === HttpMethod.POST) {
                axios.defaults.headers.post['Content-Type'] = contentType;
            } else if (type === HttpMethod.PUT) {
                axios.defaults.headers.put['Content-Type'] = contentType;
            } else if (type === HttpMethod.DELETE) {
                axios.defaults.headers.delete['Content-Type'] = contentType;
            }

            log(domain);
            axios({
                method: type,
                baseURL: domain,
                url: url,
                timeout: timeout,
                params: getData,
                data: postData,
                /*
                跨域请求带认证信息，譬如 Cookie, SSL Certificates，HTTP Authentication，设置为 false 则请求的时候不会带上 cookie 等信息。
                (一) 当前端配置withCredentials=true时, 后端配置Access-Control-Allow-Origin不能为*, 必须是相应地址
                (二) 当配置withCredentials=true时, 后端需配置Access-Control-Allow-Credentials
                (三) 当前端配置请求头时, 后端需要配置Access-Control-Allow-Headers为对应的请求头集合
                */
                withCredentials: crossDomain,
                onUploadProgress: onUpload,
                onDownloadProgress: onDownload,
                cancelToken: cancelToken,
                transformResponse: [function(data) {
                    if (isString(data)) {
                        try {
                            data = JSON.parse(data);
                        } catch (e) {
                            try {
                                /* eslint-disable no-eval */
                                data = eval('(' + data + ')');
                                /* eslint-enable no-eval */
                            } catch (e) {
                                console.error('接口数据转换异常', e, data);
                                reject(e);
                                return;
                            }
                        }
                    }

                    if (__DEV__) {
                        log(data, 'Response');
                    }

                    if (transformResponse && isNotEmpty(data)) {
                        data = transformResponse.call(options, data);
                        if (__DEV__) {
                            log(data, 'Transform');
                        }
                    }
                    return data;
                }]
            }).then(function(response) {  // codeStatus 为 200 - 300 才走 then
                console.log('then', response);
                hideLoading(enableLoading);

                const res = response.data;
                if (res) {
                    if (res.status === statusCode.success) { // 请求成功
                        resolve(res.data);
                    } else {
                        message.error(res.message);
                        reject(res);
                    }
                } else {
                    message.warn('没有数据返回');
                    reject(res);
                }
            }).catch(function(error) {
                const response = error.response;
                console.log('catch', response);
                // hideLoading(response && response.config, enableLoading);
                hideLoading(enableLoading);

                if (!response) {
                    if (error.message.includes('timeout')) {
                        message.warn('请求超时，请刷新重试');
                    }
                    return;
                }

                if (response.status === statusCode.systemUpdate) {
                    // location.hash = '/systemUpdate';
                    return;
                }

                const res = response.data;
                if (res.status === statusCode.authError || res.status === statusCode.noAuth || res.status === statusCode.loginLose) {
                    clearLocalUserInfo();
                    if (res.message === 'Forbidden') {
                        message.warn('尚未分配权限，请联系管理员');
                    } else {
                        message.warn('请登录后再使用');
                    }

                    // 同一个页面多个接口调用，只执行一次
                    if (!sourceUrl) {
                        sourceUrl = encodeURIComponent(location.href);
                        location.hash = `/login?sourceUrl=${sourceUrl}`;
                    }

                    reject(res);
                    return;
                }

                // 服务端返回的异常
                if (error.response) {
                    if (showError) {
                        //
                    }

                    if (isIE()) {
                        console.error(JSON.stringify(error.response));
                    } else {
                        console.error(error.response);
                    }

                    reject(error.response);
                // 浏览器抛出的异常, 不同浏览器可能有不同的行为
                } else {
                    console.error(error);
                    reject(error);
                }
            });
        }
    });

    return promise;
}

Promise.prototype.done = function(onFulfilled, onRejected) {
    this.then(onFulfilled, onRejected)
        .catch(function(reason) {
            // 抛出一个全局错误
            setTimeout(() => {
                throw reason;
            }, 0);
        });
};

Promise.prototype.finally = function(callback) {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback(value)).then(() => value),
        reason => P.resolve(callback(reason)).then(() => {
            throw reason;
        })
    );
};

function showLoading(isShow) {
    if (isShow) {
        if (count === 0) {
            loading.showLoading();
        }
        count++;
    }
}

function hideLoading(isShow) {
    if (isShow) {
        count--;
        if (count === 0) {
            loading.hideLoading();
        }
    }
}

function log(data, title) {
    /* eslint-disable no-console */
    if (title) {
        console.log(title + ' start');
    }

    if (isIE()) {
        console.log(JSON.stringify(data));
    } else {
        console.log(data);
    }

    if (title) {
        console.log(title + ' end');
    }
    /* eslint-enable no-console */
}

