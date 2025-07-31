import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import { queryAdmin } from '#/api';
import { TAB_NAME } from '#/utils/constant';
import { DRangePickerProps } from '#/utils/date';
import { codeAndName } from '#/utils/table';
import { ref } from 'vue';

// 订单状态
const orderStatusList = [
  { label: '未结算', value: 0, color: 'info' },
  { label: '结算中', value: 1, color: 'warning' },
  { label: '已结算', value: 2, color: 'success' },
];

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
        options: orderStatusList,
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
      field: 'total_price',
      title: '订单金额',
    },
    {
      field: 'status',
      title: '订单状态',
      cellRender: {
        name: 'CellTag',
        options: orderStatusList,
      },
    },
    {
      field: 'created_at',
      title: '创建时间',
      formatter: 'formatDateTime',
    },
  ];
}
