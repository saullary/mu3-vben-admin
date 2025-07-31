import { z, type VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import { queryAdmin } from '#/api';
import { $t } from '#/locales';
import { TAB_NAME } from '#/utils/constant';
import { DRangePickerProps } from '#/utils/date';

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
      rules: z.string().email(),
      // dependencies: {
      //   disabled(values, row) {
      //     console.log(values, row);
      //     return !values.user_id;
      //   },
      //   triggerFields: ['user_id'],
      // },
    },
    {
      component: 'ApiSelect',
      componentProps: {
        api: queryAdmin(TAB_NAME.system.role, {
          _select: 'id,name',
        }),
        class: 'w-full',
      },
      fieldName: 'role_id',
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
      componentProps: DRangePickerProps,
      fieldName: 'created_at',
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
      // sortable: true,
    },
    {
      field: 'id',
      slots: { default: 'user_id' },
      title: 'ID',
    },
    {
      field: 'email',
      title: '邮箱',
    },
    {
      field: 'role_id',
      slots: { default: 'role_id' },
      title: '角色',
    },
    {
      field: 'created_at',
      title: $t('system.role.createTime'),
      minWidth: 150,
      formatter: 'formatDateTime',
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
