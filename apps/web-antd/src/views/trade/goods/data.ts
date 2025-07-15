import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import { z } from '#/adapter/form';
import { DRangePickerProps } from '#/utils';


export const table = "shop_goods"

const goodsStatusSel = [
  { label: "上架", value: 1 },
  { label: "下架", value: 0 }
]


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
      component: 'Input',
      label: '商品名称',
      fieldName: 'name',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      fieldName: 'price',
      label: '售卖价格',
      componentProps: {
        min: 0,
        prefix: '￥',
        precision: 2
      },
      rules: 'required'
    },
    {
      component: 'Textarea',
      fieldName: 'bio',
      label: '商品简介',
    },
    {
      component: 'InputNumber',
      label: '划线价格',
      fieldName: 'price_old',
      componentProps: {
        min: 0,
        prefix: '￥',
        precision: 2
      },
    },
    // {
    //   component: 'DatePicker',
    //   label: '保质期',
    //   fieldName: 'shelf_day',
    //   componentProps: {
    //     valueFormat: 'YYYY-MM-DD',
    //   },
    //   rules: 'selectRequired'
    // },
    {
      component: 'InputNumber',
      label: '售卖天数',
      fieldName: 'shelf_day',
      componentProps: {
        min: 0,
        addonAfter: '天',
        precision: 0
      },
      rules: 'required'
    },
    {
      fieldName: 'status',
      label: '商品状态',
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
    // {
    //   fieldName: 'created_at',
    //   label: '创建时间',
    //   component: 'RangePicker',
    //   componentProps: DRangePickerProps,
    // },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: '编号',
      fixed: 'left',
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
          { label: '上架', value: 1 },
          { label: '下架', value: 0 }
        ]
      }
    },
    {
      field: 'createTime',
      title: '创建时间',
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
