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
  },
  trade: {
    deliver: 'trade_deliver', // 快递记录
  },
  system: {
    log: 'sys_log',
    role: 'sys_role',
    dept: 'sys_dept',
    menu: 'sys_menu',
  },
  USER: {
    ORDINARY: 'user_info', // 普通用户
    SYS: 'sys_user', // 系统用户
  },
} as const;
