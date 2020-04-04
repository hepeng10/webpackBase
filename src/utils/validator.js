// 手机格式验证
export const mobileCheck = {
    message: '手机格式不正确',
    pattern: /^(1)\d{10}$/
};
// 邮箱格式验证
export const EmallCheck = {
    message: '邮箱格式不正确',
    pattern: /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};
// 3-20位字母数字下划线组合 肖思汗
export const VerificationUserName = {
    message: '用户名（3-20位字母、数字、下划线，需以字母开头）',
    pattern: /^[a-zA-z][a-zA-z0-9_]{2,19}$/
};

// 6-20位字母数字下划线组合 肖思汗
export const Password = {
    message: '请输入6-20位密码',
    pattern: /^\S{6,20}$/
};

// 大于500的数字 肖思汗
export const greaterThan500 = {
    message: '只能输入大于等于500的数字',
    pattern: /([5-9]\d{2}|\d{4,})/
};

export function checkPwd(rule, value, callback) {
    this.password2 = value;
    if (this.password !== this.password2) {
        this.setState({
            pwdIsEqual: false
        });
    } else {
        this.setState({
            pwdIsEqual: true
        });
    }
    callback();
}

export const LoginName = {
    message: '用户名错误',
    pattern: /^([A-Za-z][A-Za-z_0-9]{2,19}|1\d{10}|([a-zA-Z0-9_\.\-])+([_\.\-])?([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+)$/
};

export function tipsLessN(n) {
    return `长度不能小于${n}位`;
}

export function tipsMoreN(n) {
    return `长度不能大于${n}位`;
}

export const pwdRule = [{
    required: true, message: '密码不能为空'
}, {
    min: 6, message: tipsLessN(6)
}, {
    max: 20, message: tipsMoreN(20)
}, {
    validator: (rule, value, callback) => {
        const space = / /.test(value);
        if (space) {
            callback('不能包含空格');
        }
        const chinese = /[\u4E00-\uFA29]|[\uE7C7-\uE7F3]/.test(value);
        if (chinese) {
            callback('不能包含中文字符');
        }
        callback();
    }
}];
