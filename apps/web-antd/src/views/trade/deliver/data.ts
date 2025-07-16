import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { VbenFormSchema } from '#/adapter/form';
import { kdStates, kdCompanys } from './comp/kd100.js';
import { DRangePickerProps } from '#/utils/date.js';

// 快递签收状态
const signerType = kdStates
  .filter(({ code }) => +code < 100)
  .map(({ code, name }) => ({ label: name, value: code }));

// 快递公司
const companyType = kdCompanys.map(({ code, name }) => ({
  label: name,
  value: code,
}));

export function useColumns(
  onActionClick: OnActionClickFn<any>,
): VxeTableGridOptions<any>['columns'] {
  return [
    {
      field: 'company',
      title: '快递公司', //$t('kd.company'),
      slots: { default: 'company' },
    },
    {
      align: 'center',
      field: 'order_no',
      title: '订单号',
    },
    {
      field: 'phone',
      title: '手机号',
    },
    {
      field: 'result',
      slots: { default: 'result' },
      title: '物流信息',
    },
    {
      field: 'status',
      slots: { default: 'status' },
      title: '状态',
    },

    {
      field: 'created_t',
      title: '创建时间',
      minWidth: 120,
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'company',
      label: '快递公司',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: companyType,
        showSearch: true,
        filterOption: (
          input: string,
          option: { label: string; value: string },
        ) => option.label.includes(input),
      },
    },
    {
      fieldName: 'order_no',
      label: '订单号',
      component: 'Input',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: signerType,
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
