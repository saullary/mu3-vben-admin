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
          title: '微信用户',
        },
        name: 'UserSimpleUser',
        path: '/user/simple_user',
        component: () => import('#/views/user/simple_user/list.vue'),
      },
    ],
  },
];

export default routes;
