import React, { Component, lazy } from 'react';

import lazyLoad from './lazyLoad';

export default [
    {
        name: 'test',
        // component: lazy(() => import('@containers/test/Test')),
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