import dayjs from 'dayjs';


/** 日期选择框, 预设范围  */
export const DRangePickerProps = {
  format: 'YYYY-MM-DD HH:mm:ss',
  placeholder: ['开始时间', '结束时间'],
  presets: [
    {
      label: '今天',
      value: [dayjs().startOf('day'), dayjs().endOf('day')],
    },
    {
      label: '最近一周',
      value: [dayjs().subtract(7, 'day').startOf('day'), dayjs().endOf('day')],
    },
    {
      label: '最近三十天',
      value: [dayjs().subtract(30, 'day').startOf('day'), dayjs().endOf('day')],
    },
    {
      label: '昨天',
      value: [
        dayjs().subtract(1, 'day').startOf('day'),
        dayjs().subtract(1, 'day').endOf('day'),
      ],
    },
  ],
  showTime: {
    defaultValue: [
      dayjs('00:00:00', 'HH:mm:ss'),
      dayjs('23:59:59', 'HH:mm:ss'),
    ],
    format: 'HH:mm:ss',
  },
  valueFormat: 'YYYY-MM-DD HH:mm:ss',
  allowClear: true,
};
