import { type VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import { queryAdmin } from '#/api';
import { TAB_NAME } from '#/utils/constant';
// import { DRangePickerProps } from '#/utils/date';
import { codeAndName } from '#/utils/table';
import { useDateFormat } from '@vueuse/core';
import { h, ref } from 'vue';

/** 门店列表 */
const shopList = ref<IdAndName[]>([]);

/** 状态 */
// const couponStatusSel = [{ label: '' }];

/** 列表搜索 */
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
            shopList.value = data;
          },
        ),
      },
    },
    {
      label: '名称',
      fieldName: 'name',
      component: 'Input',
    },
    // {
    //   label: '有效期',
    //   fieldName: 'validTime',
    //   component: 'RangePicker',
    //   componentProps: DRangePickerProps,
    // },
    // {
    //   label: '状态',
    //   fieldName: 'status',
    //   component: 'Select',
    //   componentProps: {
    //     allowClear: true,
    //     options: couponStatusSel,
    //   },
    // },
  ];
}

/** 列表展示 */
export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'name',
      title: '名称',
    },
    {
      title: '门店',
      slots: {
        default: ({ row }) => codeAndName(row.shop_id, shopList.value),
      },
    },
    {
      title: '已用 / 可用',
      slots: {
        default: ({ row: { total_num, used_num } }) =>
          h('p', [
            h('span', used_num ?? 0),
            h('span', { class: 'mx-2' }, '/'),
            h('span', total_num ?? 0),
          ]),
      },
    },
    // {
    //   title: '使用状态',
    //   field: 'status',
    //   cellRender: {
    //     name: 'CellTag',
    //     options: [
    //       { color: 'default', label: '未使用', value: 0 },
    //       { color: 'success', label: '已使用', value: 1 },
    //     ],
    //   },
    // },
    {
      title: '有效期',
      slots: {
        default: ({ row: { valid_begin, valid_end } }) =>
          h('div', [
            h('p', useDateFormat(valid_begin, 'YYYY-MM-DD HH:mm:ss').value),
            h('p', useDateFormat(valid_end, 'YYYY-MM-DD HH:mm:ss').value),
          ]),
      },
      rowResize: true,
    },
  ];
}
