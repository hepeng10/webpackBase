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

// 用于 sidebar 这样的路由，将 routes 里面所有对象中 component 有值的项取出来
export const treeRouter = (routes = []) => {
    let routeArr = [];
    const getRoute = (routes = []) => {
        routes.forEach(r => {
            if (r.component) {
                routeArr.push(route(r));
            }
            if (r.subs) {
                getRoute(r.subs)
            }
        });
    }
    getRoute(routes);
    return routeArr;
}

export default (routes = []) =>  routes.map(r => route(r));