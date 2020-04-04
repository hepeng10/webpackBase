import './styles/main.less';
import './styles/reset.less';
import './styles/btn.less';
import React from 'react';
import { render } from 'react-dom';
import Root from './routes/Root';

render(
    <Root />,
    document.getElementById('app')
);
