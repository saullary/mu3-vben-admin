import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import { queryAdmin } from '#/api';
import { TAB_NAME } from '#/utils/constant';
import { DRangePickerProps } from '#/utils/date';
import { codeAndName } from '#/utils/table';
import { ref } from 'vue';

// 订单状态
const orderCodeToStr = {
  0: '待支付',
  1: '备货中',
  2: '待发货',
  3: '已发货',
  4: '待签收',
  6: '已签收',
  7: '转售中',
  8: '已转售',
  11: '退款中',
  12: '已退款',
  21: '已取消',
  31: '已认养',
} as Record<number, string>;

const orderStatusSel = Object.entries(orderCodeToStr).map(([key, value]) => ({
  label: value,
  value: key,
}));

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
      label: '订单状态',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: orderStatusSel,
      },
    },
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
      field: 'final_price',
      title: '金额(元)',
    },
    {
      title: '订单状态',
      slots: {
        default: ({ row }) => orderCodeToStr[row.status] ?? '',
      },
    },
    {
      field: 'created_at',
      title: '创建时间',
      formatter: 'formatDateTime',
    },
  ];
}
