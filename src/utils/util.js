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

// 获取URL上的参数
export function getRequest(key) {
    var url = location.hash.split('?')[1]; // 获取url中'?'符后的字串
    var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
    var result = url.substr().match(reg);
    return result ? decodeURIComponent(result[2]) : null;
}

export function getUrlParam(param) {
    if (location.href.split('?').length <= 1) {
        return;
    }
    let newParam = {};
    let url = location.href.split('?')[1].split('&');
    url.forEach((param) => {
        newParam[param.split('=')[0]] = param.split('=')[1];
    });
    return newParam && newParam[param];
}

/**
 * @desc 通过URL搜索对象获取url参数, 如www.xxx.com?a=1&b=2, getURLParam('a') return 1
 */
export function getURLParam(name) {
    if (isBlank(name)) {
        return;
    }
    // var urlQuery = getURLQuery();
    var urlQuery = getQueryParams();
    return urlQuery[name];
}
/*
* 获取 url 参数，因为 this.props.location.query 不能得到带有 # 的参数，所以添加此方法
*
*/
export function getQueryParams() {
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
            obj[name] = decodeURIComponent(value);
        }
    }
    return obj;
}
