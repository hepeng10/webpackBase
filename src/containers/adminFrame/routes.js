import lazy from '@utils/lazy'

/**
 * Created by hepeng on 2020/4/10
 */
import departPNG from './images/depart.png';
// sidebar 树状路由
export default [
    {
        name: 'xxx管理',
        path: '/admin',
        icon: departPNG,
        subs: [  // subMenu
            {
                name: '公共管理',
                component: lazy(() => import('./publicSource/PublicSource')),
                path: '/admin/publicSource',
                exact: true
            },
            {
                name: '网络管理',
                component: lazy(() => import('./networkSecurity/NetworkSecurity')),
                path: '/admin/networkSecurity',
                exact: true
            },
            {
                name: '审核管理',
                component: lazy(() => import('./audit/Audit')),
                path: '/admin/audit',
                exact: true
            },
        ],
    }
];