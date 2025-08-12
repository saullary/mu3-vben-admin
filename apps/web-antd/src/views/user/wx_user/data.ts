import { type VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { DRangePickerProps } from '#/utils/date';

export interface ITableData {
  id: number;
  created_at: string;
  user_id: string;
  nickname: string;
  email: null | string;
  phone: string;
  wx_uid: string;
  wx_oid: string;
  status: number;
  by_uid: null | string;
  avatar_url: string;
  extra_obj: null | string;
}

/** 表单配置 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'nickname',
      label: '名字',
    },
  ];
}

/** 列表搜索 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'nickname',
      label: '用户名',
    },
    { component: 'Input', fieldName: 'user_id', label: 'ID' },
    {
      component: 'Input',
      fieldName: 'by_uid',
      label: '邀请人ID',
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: '手机号',
    },
    {
      component: 'RangePicker',
      componentProps: DRangePickerProps,
      fieldName: 'created_at',
      label: $t('system.role.createTime'),
    },
  ];
}

/** 列表展示 */
export function useColumns<T = any>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'nickname',
      title: '用户名',
    },
    {
      title: 'ID',
      slots: {
        default: ({ row }) => `(${row.id}) ${row.user_id}`,
      },
    },
    {
      field: 'phone',
      title: '手机号',
    },
    // {
    //   field: 'email',
    //   title: '邮箱',
    // },
    {
      title: '邀请人ID',
      field: 'by_uid',
    },
    {
      field: 'created_at',
      title: $t('system.role.createTime'),
      minWidth: 150,
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
        },
        options: [{ code: 'view', text: '详情' }],
      },
    },
  ];
}
