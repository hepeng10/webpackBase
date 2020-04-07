// import { lazy } from 'react';  // 怀疑 react-hot-loader 有 bug，这里使用 React.lazy 不能局部热加载，只能整个分割的 js 热加载
import lazy from '@utils/lazy';

import testRoutes from '../containers/test/routes';

export default [
    {
        name: 'home',
        component: lazy(() => import('../containers/home/Home')),
        path: '/',
        exact: true
    },
    {
        name: 'test',
        component: lazy(() => import('../containers/test/Test')),
        path: '/test',
        exact: false,
        routes: testRoutes,
    },
    {
        name: 'notFound',
        component: lazy(() => import('../containers/error/notFound/NotFound')),
        path: '*',
        exact: false
    }
];