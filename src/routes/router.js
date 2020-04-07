import React from 'react';
import { Route } from 'react-router-dom';

// route: { name, path, component, exact } 必须属性
export const route = route => {
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

export default routes => routes.map(r => route(r));