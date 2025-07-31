import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ep:goods',
      keepAlive: true,
      order: 1000,
      title: '门店管理',
    },
    name: 'shop',
    path: '/shop',
    children: [
      {
        meta: {
          title: '门店信息',
        },
        name: 'Shop',
        path: '/shop/shop',
        component: () => import('#/views/shop/shop/list.vue'),
      },
      {
        meta: {
          title: '商品分类',
        },
        name: 'GoodsType',
        path: '/shop/goodsType',
        component: () => import('#/views/shop/goods_type/list.vue'),
      },
      {
        meta: {
          title: '商品管理',
        },
        name: 'Goods',
        path: '/shop/goods',
        component: () => import('#/views/shop/goods/list.vue'),
      },
      {
        meta: {
          title: '代金券',
        },
        name: 'ShopCoupon',
        path: '/shop/coupon',
        component: () => import('#/views/shop/coupon/list.vue'),
      },
    ],
  },
];

export default routes;
