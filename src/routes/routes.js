export default [
    {
        name: 'test',
        component: import('@containers/test/Test'),
        path: '/',
        exact: true
    },
    {
        name: 'notFound',
        component: import('@containers/error/notFound/NotFound'),
        path: '/notfound',
        exact: true
    }
];