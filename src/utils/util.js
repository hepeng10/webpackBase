/**
 * @desc 封装了一些项目常用方法.
 */
export function setLocalUserInfo(obj) {
    obj.token && localStorage.setItem('token', obj.token);
    obj.user && localStorage.setItem('user', JSON.stringify(obj.user));
}

export function getLocalUserInfo() {
    return JSON.parse(localStorage.getItem('user'));
}

export function setLocalMenus(menus) {
    menus && localStorage.setItem('menus', JSON.stringify(menus));
}

export function getLocalMenus() {
    return JSON.parse(localStorage.getItem('menus'));
}

export function clearLocalUserInfo() {
    localStorage.clear();
}

export function getToken() {
    return localStorage.getItem('token');
}

export function throwError(e) {
    throw new Error(e.message);
}

export function openEmail(email) {
    const host = email.split('@')[1];
    window.open(`//mail.${host}`, '_blank');
}
// 内部函数, 用于判断对象类型
function _getClass(object) {
    return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
}

export function isArray(obj) {
    return _getClass(obj).toLowerCase() === 'array';
}

export function isString(obj) {
    return _getClass(obj).toLowerCase() === 'string';
}

export function isDate(obj) {
    return _getClass(obj).toLowerCase() === 'date';
}

export function isObject(obj) {
    return _getClass(obj).toLowerCase() === 'object';
}

export function isNumber(obj) {
    return _getClass(obj).toLowerCase() === 'number';
}

export function isFormData(obj) {
    try {
        if (obj instanceof FormData) {
            return true;
        }
    } catch (e) {
        return false;
    }
    return false;
}

export function isIE() {
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf('compatible') > -1
        && userAgent.indexOf('MSIE') > -1) {
        return true;
    }
    return false;
}

/**
 * @desc 判断参数是否为空, 包括null, undefined, [], '', {}
 * @param {object} obj 需判断的对象
 */
export function isEmpty(obj) {
    var empty = false;

    if (obj === null || obj === undefined) {    // null and undefined
        empty = true;
    } else if ((isArray(obj) || isString(obj)) && obj.length === 0) {
        empty = true;
    } else if (isObject(obj)) {
        var hasProp = false;
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                hasProp = true;
                break;
            }
        }
        if (!hasProp) {
            empty = true;
        }
    } else if (isNumber(obj) && isNaN(obj)) {
        empty = true;
    }
    return empty;
}

/**
 * @desc 判断参数是否不为空
 */
export function isNotEmpty(obj) {
    return !isEmpty(obj);
}

/**
 * @desc 判断参数是否为空字符串, 比isEmpty()多判断字符串中全是空格的情况, 如: '   '.
 * @param {string} str 需判断的字符串
 */
export function isBlank(str) {
    if (isEmpty(str)) {
        return true;
    } else if (isString(str) && str.trim().length === 0) {
        return true;
    }
    return false;
}

/**
 * @desc 判断参数是否不为空字符串
 */
export function isNotBlank(obj) {
    return !isBlank(obj);
}

/**
 * @desc 根据传递的对象, 以及嵌套对象的属性名, 来获取属性值
 * @param {object} obj 需要遍历的对象,
 * @param {string} props 需要遍历的对象属性名, 可传递一个到多个.
 * @param {string/number} defaultValue 默认属性值为空时返回的值.
 */
export function getValueByProps(obj) {
    if (arguments.length < 2) {
        return;
    }

    var currentObj = obj;
    var props = Array.prototype.slice.call(arguments, 1);
    var defaultVal = props.pop();
    for (let i = 0; i < props.length; i++) {
        let prop = props[i];
        currentObj = currentObj[prop];
        if (isEmpty(currentObj)) {
            return defaultVal;
        }

        if (i === props.length - 1) {
            if (isObject(currentObj) && isNotEmpty(currentObj[defaultVal])) {
                return currentObj[defaultVal];
            }
            return currentObj;
        }
    }
}

/**
 * @desc 字符串超出固定字数，多余部分显示为'...'
 */
export function ellipsisWord(str, len) {
    if (str && str.length > len) {
        return str.substring(0, len) + '...';
    }

    return str;
}

// 提取 highlight
export const filterHighlight = (data) => {
    return data.map((company) => {
        const highlight = company.highlight[0];
        delete company.highlight;
        let newCompany = {};
        const obj = { ...company, ...highlight };
        for (let key in obj) {
            if (highlight.hasOwnProperty(key) || company.hasOwnProperty(key)) {
                if (!highlight[key]) {
                    if (isArray(company[key])) {
                        newCompany[key] = company[key].join('，');
                    } else {
                        newCompany[key] = company[key];
                    }
                } else if (isArray(highlight[key])) {
                    newCompany[key] = highlight[key].join('，');
                } else {
                    newCompany[key] = highlight[key];
                }
            }
        }
        return newCompany;
    });
};

/**
 * @desc 如果字段为空，自定义设置替换字段
 */
export function replaceWord(str, replace) {
    if (isEmpty(str)) {
        return replace;
    }
    return str;
}
/**
 * @qianyun
 * @desc 通过属性值获取到属性名
 * @param {obj}
 * @param {string}
 */
export function getPropertyName(obj, val) {
    var objKeys = Object.keys(obj);
    for (let key in objKeys) {
        if (obj[objKeys[key]] === val) {
            return objKeys[key];
        }
    }
}

/**
 * @desc 通过URL搜索对象获取url参数, 如www.xxx.com?a=1&b=2, getUrlQuery('a') return 1
 */
export function getUrlQuery(name, isDecode = true) {
    if (isBlank(name)) {
        return;
    }
    var urlQuery = getUrlQueries(isDecode);
    return urlQuery[name];
}
/*
* 获取 url 参数，因为 this.props.location.query 不能得到带有 # 的参数，所以添加此方法
*
*/
export function getUrlQueries(isDecode = true) {
    let obj = {}, name, value;
    let str = location.href;
    let num = str.indexOf('?');
    str = str.substr(num + 1);
    const arr = str.split('&');
    for (let i = 0; i < arr.length; i++) {
        num = arr[i].indexOf('=');
        if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            obj[name] = isDecode ? decodeURIComponent(value) : value;
        }
    }
    return obj;
}
// 修改 url 中的参数，返回修改后的 url
export function changeUrlQueries(href, keyValue, isEncode = true) {
    Object.keys(keyValue).forEach(k => {
        href = changeUrlQuery(href, k, keyValue[k], isEncode);
    });
    return href;
}
export function changeUrlQuery(href, key, value, isEncode = true) {
    const oldValue = getUrlQuery(key, false);
    const newValue = isEncode ? encodeURIComponent(value) : value;
    return href.replace(`${key}=${oldValue}`, `${key}=${newValue}`);
}

export function msToHms(msd) {
    var time = parseFloat(msd) / 1000;
    if (time) {
        if (time > 60 && time < 60 * 60) {
            time = parseInt(time / 60.0, 10) + '分' + parseInt((parseFloat(time / 60.0) -
                parseInt(time / 60.0, 10)) * 60, 10) + '秒';
        }
        else if (time >= 60 * 60 && time < 60 * 60 * 24) {
            time = parseInt(time / 3600.0, 10) + '小时' + parseInt((parseFloat(time / 3600.0) -
                parseInt(time / 3600.0, 10)) * 60, 10) + '分' +
                parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0, 10)) * 60) -
                    parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0, 10)) * 60, 10)) * 60, 10) + '秒';
        }
        else {
            time = parseInt(time, 10) + '秒';
        }
    }
    return time;
}

// 根据文件的比特大小自动转换单位
export function bytesToSize(bytes) {
    if (bytes === 0) return '0 B';
    var k = 1024,
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

/**
 * @description 数值转换
 * @param {number | string} v 要转换的内容
 * @param {boolean} minus 是否允许转换为负数，默认为只转换成正数
 * @param {number} digits 保留小数位数
 * @param {boolean} stringify 返回值是否为字符串，主要用户 input 输入框，可以返回 '12.' 这样的内容
 * @return {number | string} 返回数值时，''和'-'返回0
 * */
export function transNum(v, { minus = false, digits = 2, stringify = false } = {}) {
    let res;
    if (isNumber(v)) {
        if (minus) {
            res = Number(v.toFixed(digits));
        } else {
            res = Number(Math.abs(v).toFixed(digits));
        }
        res = stringify ? String(res) : res;
    } else {
        const reg = /^-?[0-9]*\.?[0-9]*/;
        res = v.match(reg);

        if (res) {
            res = res[0];
        } else {
            res = '';
        }

        if (!minus && res.includes('-')) {
            res = res.substr(1);
        }

        if (stringify) {
            const decimal = res.split('.')[1];
            if (decimal && decimal.length > digits) {
                res = Number(res).toFixed(digits);
            }
        } else {
            if (res === '' || res === '-') {
                res = 0;
            } else {
                res = Number(Number(res).toFixed(digits));
            }
        }
    }
    return  res;
}

// 替换动态路由中的 :xxx 为 obj 中对应 key 的 value 值
export function replaceRouteParams(route, obj) {
    return route.replace(/:\w+/g, word => {
        const key = word.substr(1);
        return obj[key];
    });
}

// 打开链接，解决用户填写的链接不带协议导致打开异常的问题
export function openUrl(url) {
    if (/^http/.test(url)) {
        window.open(url);
    } else {
        window.open(`http://${url}`);
    }
}
