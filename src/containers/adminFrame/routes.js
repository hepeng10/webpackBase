import lazy from '@/utils/lazy'

/**
 * Created by hepeng on 2020/4/10
 */
import departPNG from './images/depart.png';
// sidebar 树状路由
export default [
    {
        name: 'xxx功能',
        path: '/admin/xxx',
        component: lazy(() => import('./audit/Audit')),
        exact: true,
        icon: departPNG,
        subs: [  // subMenu
            {
                name: '关注列表',
                component: lazy(() => import('./publicSource/PublicSource')),
                path: '/admin/xxx/1111111',
                exact: true
            },
            {
                name: '交易列表',
                component: lazy(() => import('./networkSecurity/NetworkSecurity')),
                path: '/admin/xxx/2222222',
                exact: true
            },
            {
                name: '联系人管理',
                component: lazy(() => import('./audit/Audit')),
                path: '/admin/xxx/33333333',
                exact: true
            },
        ],
    },
    {
        name: 'yyy功能',
        path: '/admin/yyy',
        icon: departPNG,
        subs: [  // subMenu
            {
                name: '用户管理',
                component: lazy(() => import('./publicSource/PublicSource')),
                path: '/admin/yyy/1111111',
                exact: true
            },
            {
                name: '权限管理',
                component: lazy(() => import('./networkSecurity/NetworkSecurity')),
                path: '/admin/yyy/2222222',
                exact: true
            },
        ],
    },
];
