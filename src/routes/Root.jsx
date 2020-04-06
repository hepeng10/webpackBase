import React from 'react';
import { Switch, Route, HashRouter, BrowserRouter, Redirect } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import { setConfig } from 'react-hot-loader';
import RouteView from './RouteView';

import routes from './routes';

const Root = () => {
    return (
        <HashRouter>
            <Switch>
                {
                    routes.map(route => <RouteView key={route.path} {...route}/>)
                }
            </Switch>
        </HashRouter>
    );
};

setConfig({
    // trackTailUpdates: false,  // 添加这个配置才能热更新 lazy 组件；react-loadable 不用
    logLevel: 'debug',
    hotHooks: true,
});

export default hot(Root);