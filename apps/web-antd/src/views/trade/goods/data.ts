import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions, OnActionClickFn } from '#/adapter/vxe-table';
import { z } from '#/adapter/form';
import { DRangePickerProps } from '#/utils/date';
import { listAdmin } from '#/api';

export const table = 'shop_goods';

const goodsStatusSel = [
  { label: '上架', value: 1 },
  { label: '下架', value: 0 },
];

const goodsTypeSel = [] as { label: string; value: string }[];

/** 加载配置数据 */

await listAdmin('shop_goods_type').then((res) => {
  const guide = (res ?? []).map((item: { name: string; id: number }) => ({
    label: item.name,
    value: item.id + '',
  }));
  goodsTypeSel.push(...guide);
});

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
      component: 'Select',
      fieldName: 'type',
      label: '商品类型',
      rules: 'selectRequired',
      componentProps: {
        options: goodsTypeSel,
      },
    },
    {
      component: 'Input',
      label: '商品名称',
      fieldName: 'name',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      fieldName: 'price',
      label: '售价',
      componentProps: {
        min: 0,
        prefix: '￥',
        precision: 2,
      },
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'bio',
      label: '简介',
    },
    {
      component: 'InputNumber',
      label: '原价',
      fieldName: 'price_old',
      componentProps: {
        min: 0,
        prefix: '￥',
        precision: 2,
      },
    },
    {
      component: 'InputNumber',
      label: '保质期',
      fieldName: 'shelf_day',
      componentProps: {
        min: 0,
        addonAfter: '天',
        precision: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'RadioGroup',
      componentProps: {
        options: goodsStatusSel,
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: z.number().default(1),
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '名称',
      component: 'Input',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: goodsStatusSel,
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
export function useGridColumns<T = any>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: 'ID',
      fixed: 'left',
    },
    {
      field: 'type',
      title: '商品分类',
      cellRender: {
        name: 'CellTag',
        props: {
          loose: true,
        },
        options: goodsTypeSel,
      },
    },
    {
      field: 'name',
      title: '商品名称',
    },
    {
      field: 'price',
      title: '售价',
    },
    {
      field: 'price_old',
      title: '原价',
    },
    {
      field: 'bio',
      title: '简介',
    },
    {
      field: 'status',
      title: '状态',
      cellRender: {
        name: 'CellTag',
        options: [
          { label: '上架', value: 1, color: 'green' },
          { label: '下架', value: 0, color: 'red' },
        ],
      },
    },
    {
      field: 'created_at',
      title: '创建时间',
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      field: 'operation',
      align: 'center',
      cellRender: {
        name: 'CellOperation',
        attrs: {
          nameField: 'name',
          nameTitle: '商品',
          onClick: onActionClick,
        },
      },
    },
  ];
}
