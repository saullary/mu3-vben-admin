import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: '订单物流',
    },
    name: 'Trade',
    path: '/trade',
    children: [
      {
        meta: {
          title: '快递记录',
        },
        name: 'deliver_log',
        path: '/trade/deliver',
        component: () => import('#/views/trade/deliver/list.vue'),
      },
    ],
  },
];

export default routes;
