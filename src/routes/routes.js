// import { lazy } from 'react'
import loadable from '@utils/loadable';

export default [
    {
        name: 'test',
        // component: lazy(() => import('@containers/test/Test')),  // 怀疑 react-hot-loader 有 bug，这里使用 lazy 不能局部热加载，只能整个分割的 js 热加载
        component: loadable(() => import('@containers/test/Test')),
        path: '/',
        exact: true
    },
    {
        name: 'notFound',
        component: loadable(() => import('@containers/error/notFound/NotFound')),
        path: '/notfound',
        exact: true
    }
];