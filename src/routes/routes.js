import lazyLoad from './lazyLoad';

export default [
    {
        name: 'test',
        component: lazyLoad('containers/test/Test'),
        path: '/',
        exact: true
    },
    {
        name: 'notFound',
        component: lazyLoad('containers/error/notFound/NotFound'),
        path: '/notfound',
        exact: true
    }
];