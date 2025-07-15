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
        name: 'Shop',
        path: '/trade/shop',
        component: () => import('#/views/trade/shop/list.vue'),
      },
      {
        meta: {
          title: '商品分类',
        },
        name: 'Classify',
        path: '/trade/cassify',
        component: () => import('#/views/trade/classify/list.vue'),
      },
      {
        meta: {
          title: '商品管理',
        },
        name: 'Goods',
        path: '/trade/goods',
        component: () => import('#/views/trade/goods/list.vue'),
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
