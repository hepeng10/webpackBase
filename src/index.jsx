import './styles/main.less';
import './styles/reset.less';
import './styles/btn.less';
import React from 'react';
import { render } from 'react-dom';
import Root from './routes/Root';

// 浏览器兼容 polyfill
import 'core-js/stable';
import 'regenerator-runtime/runtime';

render(
    <Root />,
    document.getElementById('app')
);
