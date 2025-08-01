import { type VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { DRangePickerProps } from '#/utils/date';

// 平台
const platform = [
  { label: 'DeJoy', value: 1 },
  { label: 'Telegram', value: 2 },
];

/** 列表搜索 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Select',
      fieldName: 'bot_type',
      label: '平台',
      componentProps: {
        options: platform,
      },
    },
    {
      component: 'Input',
      fieldName: 'nickname',
      label: '用户名',
    },
    {
      component: 'Input',
      fieldName: 'user_id',
      label: '用户ID',
    },
    {
      component: 'Input',
      fieldName: 'by_uid',
      label: '邀请人ID',
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
export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      title: '平台',
      slots: {
        default: ({ row }) =>
          platform.find((item) => item.value === row.bot_type)!.label,
      },
    },
    {
      title: '平台UID',
      field: 'bot_uid',
    },
    {
      field: 'nickname',
      title: '用户名',
    },
    {
      title: '用户ID',
      field: 'user_id',
    },

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
  ];
}
