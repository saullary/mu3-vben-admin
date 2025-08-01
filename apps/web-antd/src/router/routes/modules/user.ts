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
          icon: 'hugeicons:wechat',
        },
        name: 'UserWXUser',
        path: '/user/wx_user',
        component: () => import('#/views/user/wx_user/list.vue'),
      },
      {
        meta: {
          title: 'Web3用户',
          icon: 'pixel:web3',
        },
        name: 'UserWeb3User',
        path: '/user/web3_user',
        component: () => import('#/views/user/web3_user/list.vue'),
      },
      {
        meta: {
          title: '代金券记录',
          icon: 'icon-park-outline:coupon',
        },
        name: 'UserCouponRecord',
        path: '/user/coupon_record',
        component: () => import('#/views/user/coupon_record/list.vue'),
      },
    ],
  },
];

export default routes;
