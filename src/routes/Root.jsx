import React, { Component, Suspense, lazy } from 'react';
import { Switch, Route, HashRouter, BrowserRouter, Redirect } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import { setConfig } from 'react-hot-loader';

import lazyLoad from './lazyLoad';

import routes from './routes';

const Root = () => {
    return (
        <HashRouter>
            <Suspense fallback={<div>loading</div>}>
                <Switch>
                    {
                        routes.map(route => {
                            return (
                                <Route
                                    key={route.name}
                                    path={route.path}
                                    exact
                                    component={route.component}
                                    // render={(props) => {
                                    //     const Comp = lazyLoad(route);
                                    //     return <Comp {...props} />
                                    // }}
                                />
                            );
                        })
                    }
                </Switch>
            </Suspense>
        </HashRouter>
    );
};

setConfig({
    trackTailUpdates: false,  // 添加这个配置才能热更新 lazy 组件
    logLevel: 'debug',
    hotHooks: true,
});

export default hot(Root);