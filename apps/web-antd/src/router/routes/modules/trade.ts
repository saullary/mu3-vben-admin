import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lsicon:order-outline',
      keepAlive: true,
      order: 1000,
      title: '订单物流',
    },
    name: 'Trade',
    path: '/trade',
    children: [
      {
        meta: {
          title: '订单记录',
        },
        name: 'order',
        path: '/trade/order',
        component: () => import('#/views/trade/list/list.vue'),
      },
      {
        meta: {
          title: '支付记录',
        },
        name: 'TradePay',
        path: '/trade/pay',
        component: () => import('#/views/trade/pay/list.vue'),
      },
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
