import React, { Component, lazy } from 'react';

export default (route) => {
    return lazy(() => import(`@/${route}`));  // import 接收的参数不能是纯变量，前面必须带有字符串内容
};