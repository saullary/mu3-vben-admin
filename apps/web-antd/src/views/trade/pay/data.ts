import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import { queryAdmin } from '#/api';
import { TAB_NAME } from '#/utils/constant';
import { DRangePickerProps } from '#/utils/date';
import { codeAndName } from '#/utils/table';
import { ref } from 'vue';

const payStatusSel = [
  { label: '待支付', value: 0 },
  { label: '已支付', value: 1 },
  { label: '已取消', value: 2 },
];

/** 支付平台 */
const platform = [
  { label: '微信', value: 0 },
  { label: 'DeJoy', value: 1 },
  { label: 'Telegram', value: 2 },
];

/** 货币单位  */
// const currency = [
//   { label: 'RMB', value: 'RMB' },
//   { label: 'USDT', value: 'USDT' },
// ];

const shopInfoList = ref<IdAndName[]>([]);

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      label: '门店',
      fieldName: 'shop_id',
      component: 'ApiSelect',
      componentProps: {
        api: queryAdmin(
          TAB_NAME.SHOP.INFO,
          {
            _select: 'id,name',
          },
          (data: IdAndName[]) => {
            shopInfoList.value = data;
          },
        ),
      },
    },
    {
      fieldName: 'ord_no',
      label: '订单号',
      component: 'Input',
    },
    {
      fieldName: 'user_id',
      label: '用户ID',
      component: 'Input',
    },
    {
      fieldName: 'status',
      label: '支付状态',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: payStatusSel,
      },
    },
    {
      label: '支付平台',
      fieldName: 'bot_type',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: platform,
      },
    },
    // 目前, 微信-RMB 其余USDT
    // {
    //   label: '货币单位',
    //   fieldName: 'currency',
    //   component: 'Select',
    //   componentProps: {
    //     allowClear: true,
    //     options: currency,
    //   },
    // },
    {
      fieldName: 'created_at',
      label: '创建时间',
      component: 'RangePicker',
      componentProps: DRangePickerProps,
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'ord_no',
      title: '订单号',
      fixed: 'left',
    },
    {
      field: 'shop_id',
      title: '门店',
      slots: {
        default: ({ row: { shop_id } }) =>
          codeAndName(shop_id, shopInfoList.value),
      },
    },
    {
      field: 'user_id',
      title: '用户ID',
    },
    {
      title: '支付平台',
      slots: {
        default: ({ row: { bot_type } }) =>
          platform.find((item) => item.value === bot_type)!.label,
      },
    },
    {
      field: 'amount',
      title: '支付金额',
      slots: {
        // 货币类型
        default: ({ row }) => `${row.amount} ${row.currency}`,
      },
    },
    {
      field: 'status',
      title: '支付状态',
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'orange', label: '待支付', value: 0 },
          { color: 'green', label: '已支付', value: 1 },
          { color: 'red', label: '已取消', value: 2 },
        ],
      },
    },
    {
      field: 'created_at',
      title: '创建时间',
      formatter: 'formatDateTime',
    },
  ];
}
