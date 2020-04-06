import React from 'react';
import { Switch, Route, HashRouter, BrowserRouter, Redirect } from 'react-router-dom';

export default route => {
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
};