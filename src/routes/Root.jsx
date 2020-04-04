import React, { Component, Suspense, lazy } from 'react';
import { Switch, Route, HashRouter, BrowserRouter, Redirect } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import { setConfig } from 'react-hot-loader';

const Test = lazy(() => import('@containers/test/Test'));
const NotFound = lazy(() => import('@containers/error/notFound/NotFound'));

const Root = () => {
    return (
        <HashRouter>
            sssw
            <Suspense fallback={<div>loading</div>}>
                <Switch>
                    <Route
                        path="/"
                        exact
                        component={Test}
                    />
                    <Route
                        path="/notfound"
                        exact
                        component={NotFound}
                    />
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