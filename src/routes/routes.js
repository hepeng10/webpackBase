// import { lazy } from 'react'
import loadable from '../utils/loadable';

import testRoutes from '../containers/test/routes';

export default [
    {
        name: 'home',
        component: loadable(() => import('../containers/home/Home')),
        path: '/',
        exact: true
    },
    {
        name: 'test',
        // component: lazy(() => import('../containers/test/Test')),  // 怀疑 react-hot-loader 有 bug，这里使用 lazy 不能局部热加载，只能整个分割的 js 热加载
        component: loadable(() => import('../containers/test/Test')),
        path: '/test',
        exact: false,
        routes: testRoutes,
    },
    {
        name: 'notFound',
        component: loadable(() => import('../containers/error/notFound/NotFound')),
        path: '*',
        exact: false
    }
];