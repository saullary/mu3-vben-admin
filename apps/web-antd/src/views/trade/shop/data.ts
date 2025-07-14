import type { Dayjs } from 'dayjs';

import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

import { z } from '#/adapter/form';

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
    // {
    //   component: 'ImageUpload',
    //   fieldName: 'logo',
    //   label: '门店logo',
    //   componentProps: {
    //     maxSize: 1,
    //   },
    //   rules: 'required',
    // },
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
    // 门店类型
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
      rules: '',
    },
    {
      fieldName: 'area_name',
      label: '地址',
      component: 'ApiTreeSelect',
      componentProps: {
        // api: () => getAreaTree(),
        fieldNames: { label: 'name', value: 'id', children: 'children' },
      },
    },
    {
      fieldName: 'status',
      label: '门店状态',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '营业中', value: 1 },
          { label: '休息中', value: 2 },
        ],
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
      fieldName: 'phone',
      label: '门店手机',
      component: 'Input',
    },
    {
      fieldName: 'name',
      label: '门店名称',
      component: 'Input',
    },
    {
      fieldName: 'status',
      label: '门店状态',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [],
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        placeholder: ['开始时间', '结束时间'],
        presets: [
          {
            label: '今天',
            value: () =>
              [dayjs().startOf('day'), dayjs().endOf('day')] as [Dayjs, Dayjs],
          },
          {
            label: '最近一周',
            value: () =>
              [
                dayjs().subtract(7, 'day').startOf('day'),
                dayjs().endOf('day'),
              ] as [Dayjs, Dayjs],
          },
          {
            label: '最近三十天',
            value: () =>
              [
                dayjs().subtract(30, 'day').startOf('day'),
                dayjs().endOf('day'),
              ] as [Dayjs, Dayjs],
          },
          {
            label: '昨天',
            value: () =>
              [
                dayjs().subtract(1, 'day').startOf('day'),
                dayjs().subtract(1, 'day').endOf('day'),
              ] as [Dayjs, Dayjs],
          },
        ],
        showTime: {
          defaultValue: [
            dayjs('00:00:00', 'HH:mm:ss'),
            dayjs('23:59:59', 'HH:mm:ss'),
          ],
          format: 'HH:mm:ss',
        },
        transformDateFunc: (dates: any) => {
          if (dates && dates.length === 2) {
            // 格式化为后台支持的时间格式
            return [dates.createTime[0], dates.createTime[1]].join(',');
          }
          return {};
        },
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        allowClear: true,
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: '编号',
    },
    {
      field: 'logo',
      title: '门店logo',
      cellRender: {
        name: 'CellImage',
      },
    },
    {
      field: 'name',
      title: '门店名称',
    },
    {
      field: 'phone',
      title: '门店手机',
    },
    {
      field: 'detailAddress',
      title: '地址',
    },
    {
      field: 'openingTime',
      title: '营业时间',
      formatter: ({ row }) => {
        return `${row.openingTime} ~ ${row.closingTime}`;
      },
    },
    {
      field: 'status',
      title: '开启状态',
      cellRender: {
        name: 'CellDict',
        props: { type: 'common_status' },
      },
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
