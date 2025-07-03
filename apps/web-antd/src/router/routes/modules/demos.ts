import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: '物流管理', // $t('demos.title'),
    },
    name: 'wuliu',
    path: '/demos',
    children: [
      {
        meta: {
          title: '快递记录',
        },
        name: 'deliver_log',
        path: '/demos/deliver',
        component: () => import('#/views/demos/deliver/list.vue'),
      },
    ],
  },
];

export default routes;
