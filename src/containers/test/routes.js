import loadable from '@utils/loadable';

export default [
    {
        name: 'testChild',
        component: loadable(() => import('./child/Child')),
        path: '/test/child',
        exact: true,
    }
];