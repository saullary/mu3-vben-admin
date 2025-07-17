import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions, OnActionClickFn } from '#/adapter/vxe-table';
import { DRangePickerProps } from '#/utils/date';

import { z } from '#/adapter/form';
export const table = 'shop_info';

const shopInfoStatusSel = [
  { label: '营业中', value: 1 },
  { label: '已暂停', value: 0 },
];

/** 商铺类型 */
export const shopInfoType = {
  1: '商场',
  2: '超市',
} as Record<number, string>;

const shopInfoTypeSel = [] as Record<string, string>[];

for (const key of Object.keys(shopInfoType)) {
  shopInfoTypeSel.push({
    label: shopInfoType[+key] as string,
    value: key,
  });
}

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
      component: 'ApiTreeSelect',
      componentProps: {
        options: shopInfoTypeSel,
      },
      fieldName: 'type',
      label: '门店类型',
      rules: 'required',
    },
    {
      component: 'UploadImg',
      fieldName: 'logos',
      label: '门店logo',
      componentProps: {
        maxCount: 2,
        maxSize: 5,
      },
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '门店名称',
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'bio',
      label: '门店简介',
    },
    {
      component: 'Input',
      fieldName: 'host_name',
      label: '店主名称',
      rules: '',
    },
    {
      component: 'Input',
      fieldName: 'host_tel',
      label: '门店手机',
      // rules: 'mobileRequired',
      rules: z
        .string()
        .regex(/(?:0|86|\+86)?1[3-9]\d{9}/, '请输入正确的手机号码'),
    },
    {
      fieldName: 'area_name',
      label: '地址',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '门店状态',
      component: 'RadioGroup',
      componentProps: {
        options: shopInfoStatusSel,
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
      fieldName: 'host_tel',
      label: '门店手机',
      component: 'Input',
    },
    {
      fieldName: 'host_name',
      label: '门店名称',
      component: 'Input',
    },
    {
      fieldName: 'status',
      label: '门店状态',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: shopInfoStatusSel,
      },
    },
    {
      fieldName: 'type',
      label: '门店类型',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: shopInfoTypeSel,
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
      width: 80,
    },
    {
      field: 'name',
      title: '门店名称',
    },
    {
      field: 'type',
      title: '门店类型',
      slots: {
        default: 'type',
      },
    },
    {
      field: 'host_tel',
      title: '门店手机',
    },
    {
      field: 'area_name',
      title: '地址',
    },
    {
      field: 'status',
      title: '开启状态',
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'red', label: '停业中', value: 0 },
          { color: 'green', label: '营业中', value: 1 },
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
          onClick: onActionClick,
          nameField: 'name',
          nameTitle: '门店',
        },
      },
    },
  ];
}
