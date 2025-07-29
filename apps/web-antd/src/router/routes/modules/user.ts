import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'stash:user-cog',
      keepAlive: true,
      order: 1000,
      title: '用户管理',
    },
    name: 'User',
    path: '/user',
    children: [
      {
        meta: {
          title: '系统用户',
        },
        path: '/user/sys_user',
        name: 'UserSysUser',
        component: () => import('#/views/user/sys_user/list.vue'),
      },
      {
        meta: {
          title: '普通用户',
        },
        name: 'UserSimpleUser',
        path: '/user/simple_user',
        component: () => import('#/views/user/simple_user/list.vue'),
      },
    ],
  },
];

export default routes;
