import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: '电商管理', // $t('demos.title'),
    },
    name: 'Trade',
    path: '/trade',
    children: [
      {
        meta: {
          title: '门店管理',
        },
        name: 'shop',
        path: '/trade/shop',
        component: () => import('#/views/trade/shop/list.vue'),
      },
    ],
  },
];

export default routes;
