import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import { listAdmin, queryAdmin } from '#/api';
import { $t } from '#/locales';

export namespace UserInfoApi {
  export interface UserInfo {
    [key: string]: any;
    id: string;
    name: string;
    role: number;
    email?: string;
    status: 0 | 1;
  }
}

export const tableName = 'user_info';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '名字',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: '邮箱',
    },
    {
      component: 'ApiTreeSelect',
      componentProps: {
        api: queryAdmin('sys_role', {
          _select: 'id,name',
        }),
        class: 'w-full',
        labelField: 'name',
        valueField: 'id',
      },
      fieldName: 'role',
      label: '角色',
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '用户名',
    },
    { component: 'Input', fieldName: 'id', label: 'ID' },
    {
      component: 'Input',
      fieldName: 'email',
      label: '邮箱',
    },
    {
      component: 'RangePicker',
      fieldName: 'createTime',
      label: $t('system.role.createTime'),
    },
  ];
}

export function useColumns<T = UserInfoApi.UserInfo>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'name',
      title: '用户名',
      minWidth: 100,
      // sortable: true,
    },
    {
      field: 'id',
      title: 'ID',
      minWidth: 80,
    },
    {
      field: 'email',
      minWidth: 100,
      title: '邮箱',
    },
    {
      field: 'role',
      slots: { default: 'role' },
      minWidth: 100,
      title: '角色',
    },
    {
      field: 'created_t',
      title: $t('system.role.createTime'),
      minWidth: 150,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('system.role.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      // fixed: 'right',
      title: $t('system.role.operation'),
      minWidth: 150,
    },
  ];
}
