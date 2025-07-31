/** supabase表名 */
export const TAB_NAME = {
  /** 门店模块 */
  SHOP: {
    /** 商品管理 */
    GOODS: 'shop_goods',
    /** 商品类别 */
    TYPE: 'shop_goods_type',
    /** 门店 */
    INFO: 'shop_info',
    /** 代金券 */
    COUPON: 'shop_coupon',
  },
  trade: {
    deliver: 'trade_deliver', // 快递记录
    pay: 'trade_pay', // 支付记录
    order: 'trade_order', // 门店订单
  },
  system: {
    log: 'sys_log',
    role: 'sys_role',
    dept: 'sys_dept',
    menu: 'sys_menu',
    user: 'sys_user',
  },
  USER: {
    ORDINARY: 'user_info', // 普通用户
    ADDR: 'user_addr', // 普通用户地址
  },
} as const;
