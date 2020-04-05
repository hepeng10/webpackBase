import React from 'react';
import { Switch, Route, HashRouter, BrowserRouter, Redirect } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import { setConfig } from 'react-hot-loader';

import routes from './routes';

const Root = () => {
    return (
        <HashRouter>
            <Switch>
                {
                    routes.map(route => {
                        const { component: Comp, exact, ...attrs } = route;

                        return (
                            <Route
                                key={route.name}
                                path={route.path}
                                exact={exact}
                                render={(props) => {
                                    return <Comp {...attrs} {...props} />
                                }}
                            />
                        );
                    })
                }
            </Switch>
        </HashRouter>
    );
};

setConfig({
    trackTailUpdates: false,  // 添加这个配置才能热更新 lazy 组件
    logLevel: 'debug',
    hotHooks: true,
});

export default hot(Root);