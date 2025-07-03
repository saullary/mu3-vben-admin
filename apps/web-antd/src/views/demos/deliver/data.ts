import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';
import type { OnActionClickFn } from '#/adapter/vxe-table';

export function useColumns(
  onActionClick: OnActionClickFn<any>,
): VxeTableGridOptions<any>['columns'] {
  return [
    {
      field: 'company',
      title: '快递公司', //$t('kd.company'),
      slots: { default: 'company' },
      minWidth: 100,
    },
    {
      align: 'center',
      field: 'order_no',
      title: '订单号',
      // width: 100,
    },
    {
      field: 'phone',
      title: '手机号',
      // width: 200,
    },
    {
      field: 'result',
      slots: { default: 'result' },
      title: '物流信息',
      // width: 200,
    },
    {
      field: 'status',
      slots: { default: 'status' },
      title: '状态',
      // width: 200,
    },

    {
      field: 'created_t',
      title: '创建时间',
      // width: 180,
    },
  ];
}
