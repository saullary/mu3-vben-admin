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

/** 账号状态 */
const userState = [
  { label: '游客', value: 1 },
  { label: '普通用户', value: 2 },
  { label: '代理商会员', value: 3 },
];
const userStateStr = generateObj(userState);

/** 认养情况 */
const adoptState = [{ label: '未认养', value: 1 }];
const adoptStateStr = generateObj(adoptState);

function generateObj(data: { label: string; value: number | string }[]) {
  return data.reduce(
    (pre, cur) => {
      pre[cur.value] = cur.label;
      return pre;
    },
    {} as Record<number | string, string>,
  );
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
      label: '状态',
      fieldName: 'status',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: userState,
      },
    },
    {
      label: '认养情况',
      component: 'Select',
      fieldName: 'got_tree',
      componentProps: {
        allowClear: true,
        options: adoptState,
      },
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
      fixed: 'left',
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
    {
      title: '状态',
      slots: {
        default: ({ row }) => userStateStr[row.status] ?? '',
      },
    },
    {
      title: '认养情况',
      slots: {
        default: ({ row }) => adoptStateStr[row.got_tree] ?? '',
      },
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
