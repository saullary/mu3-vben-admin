import { z, type VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions, OnActionClickFn } from '#/adapter/vxe-table';
import { DRangePickerProps } from '#/utils/date';
import { queryAdmin } from '#/api';
import { ref } from 'vue';
import { codeAndName } from '#/utils/table';
import { TAB_NAME } from '#/utils/constant';

/** 新增/修改的表单 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      // 业务主键-不展示
      component: 'Input',
      fieldName: 'id',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      component: 'ApiSelect',
      componentProps: {
        api: queryAdmin(TAB_NAME.SHOP.INFO, {
          _select: 'id,name',
        }),
      },
      fieldName: 'shop_id',
      label: '门店',
      rules: 'selectRequired',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '分类名称',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      fieldName: 'seq',
      label: '排序',
      rules: z.number().default(1000),
      componentProps: {
        precision: 0,
      },
    },
  ];
}

const shopList = ref([]);

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'ApiTreeSelect',
      componentProps: {
        api: queryAdmin(
          TAB_NAME.SHOP.INFO,
          {
            _select: 'id,name',
          },
          (data: any) => {
            shopList.value = data;
          },
        ),
      },
      fieldName: 'shop_id',
      label: '门店',
    },
    {
      fieldName: 'name',
      label: '分类名称',
      component: 'Input',
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
export function useGridColumns<T = any>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: 'ID',
      fixed: 'left',
      width: 90,
    },
    {
      field: 'shop_id',
      title: '店铺ID',
      slots: {
        default: ({ row: { shop_id } }) => codeAndName(shop_id, shopList.value),
      },
    },
    {
      field: 'name',
      title: '分类名称',
    },
    {
      field: 'created_at',
      title: '创建时间',
      formatter: 'formatDateTime',
    },
    {
      title: '排序值',
      field: 'seq',
      sortable: true,
    },
    {
      title: '操作',
      field: 'operation',
      align: 'center',
      cellRender: {
        name: 'CellOperation',
        attrs: {
          onClick: onActionClick,
          nameField: 'name',
          nameTitle: '门店',
        },
      },
    },
  ];
}
