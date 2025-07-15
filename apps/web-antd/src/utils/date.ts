import dayjs from 'dayjs';

/** 日期选择框, 预设范围  */
export const DRangePickerProps = {
  // format: 'YYYY-MM-DD HH:mm:ss',
  // placeholder: ['开始时间', '结束时间'],
  presets: [
    {
      label: '今天',
      value: [dayjs().startOf('day'), dayjs().endOf('day')],
    },
    {
      label: '昨天',
      value: [
        dayjs().subtract(1, 'day').startOf('day'),
        dayjs().subtract(1, 'day').endOf('day'),
      ],
    },
    {
      label: '最近3天',
      value: [dayjs().subtract(3, 'day').startOf('day'), dayjs().endOf('day')],
    },
    {
      label: '最近7天',
      value: [dayjs().subtract(7, 'day').startOf('day'), dayjs().endOf('day')],
    },
    {
      label: '最近30天',
      value: [dayjs().subtract(30, 'day').startOf('day'), dayjs().endOf('day')],
    },
  ],
  // valueFormat: 'YYYY-MM-DD HH:mm:ss',
  // allowClear: true,
};
