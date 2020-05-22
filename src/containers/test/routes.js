import lazy from '@/utils/lazy';

export default [
    {
        name: 'testChild',
        component: lazy(() => import('./child/Child')),
        path: '/test/child',
        exact: true,
    }
];
