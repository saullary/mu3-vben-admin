import { z, type VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions, OnActionClickFn } from '#/adapter/vxe-table';
import { DRangePickerProps } from '#/utils/date';
import { queryAdmin } from '#/api';
import { TAB_NAME } from '#/utils/constant';
import { ref } from 'vue';

/** 代金券类型 */
const couponTypes = [
  { label: '满减', value: 0 },
  { label: '指定商品', value: 1 },
  { label: '指定分类', value: 2 },
];
/** 代金券状态 */
const couponStatus = [
  { label: '已停用', value: -1 },
  { label: '未发放', value: 0 },
  { label: '已发放', value: 1 },
];

/** 编辑需要的联动数据 */
const formParams = ref<{
  shop_id?: number;
}>({});

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
    {
      component: 'ApiSelect',
      componentProps: {
        api: queryAdmin(TAB_NAME.SHOP.INFO, {
          _select: 'id,name',
        }),
        onChange: (val: number) => {
          formParams.value.shop_id = val;
        },
      },
      fieldName: 'shop_id',
      label: '归属店铺',
      rules: 'selectRequired',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '代金券名称',
      rules: 'required',
    },
    {
      component: 'ApiSelect',
      componentProps: {
        options: couponTypes,
        allowClear: false,
      },
      defaultValue: 0,
      fieldName: 'type',
      label: '代金券类型',
    },
    // ------------------------ 不同类型的必填项 start
    {
      label: '满减金额',
      component: 'InputNumber',
      fieldName: 'base_price',
      componentProps: {
        precision: 2,
      },
      dependencies: {
        if(vals, formApi) {
          if (!vals.id) {
            formApi.resetField('base_price', undefined);
          }
          return vals.type === 0;
        },
        triggerFields: ['type'],
      },
      rules: 'required',
    },
    {
      label: '指定商品',
      fieldName: 'goods_id',
      component: 'ApiTreeSelect',
      componentProps: {
        params: formParams,
        api: queryAdmin(TAB_NAME.SHOP.GOODS, {
          _select: 'id,name',
        }),
      },
      dependencies: {
        if(vals, formApi) {
          if (!vals.id) {
            formApi.resetField('goods_id', undefined);
          }

          return vals.type === 1;
        },
        triggerFields: ['type'],
      },
      rules: 'selectRequired',
    },
    {
      label: '指定分类',
      fieldName: 'goods_type',
      component: 'ApiTreeSelect',
      componentProps: {
        params: formParams,
        api: queryAdmin(TAB_NAME.SHOP.TYPE, {
          _select: 'id,name',
        }),
      },
      dependencies: {
        if(vals, formApi) {
          if (!vals.id) {
            formApi.resetField('goods_type', undefined);
          }
          return vals.type === 2;
        },
        triggerFields: ['type'],
      },
      rules: 'selectRequired',
    },

    // ------------------------ 不同类型的必填项 end

    {
      label: '发放总数',
      fieldName: 'total_num',
      component: 'InputNumber',
      componentProps: {
        precision: 0,
        min: 1,
      },
      disabled: false,
      rules: z
        .number({
          message: '请输入发放总数',
        })
        .min(1)
        .default(1),
    },
    {
      // 已领取数量, 编辑判断使用
      component: 'Input',
      fieldName: 'got_num',
      dependencies: {
        triggerFields: [''],
        show: false,
      },
    },
  ];
}

/** 共用对应关系, 减少请求次数 */
export const shopInfos = ref<Record<number, string>>({});

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      label: '代金券名称',
      fieldName: 'name',
      component: 'Input',
    },
    {
      label: '所属门店',
      fieldName: 'shop_name',
      component: 'ApiSelect',
      componentProps: {
        api: queryAdmin(
          TAB_NAME.SHOP.INFO,
          {
            _select: 'id,name',
          },
          (data: IdAndName[]) => {
            shopInfos.value = data.reduce(
              (pre, cur) => {
                pre[cur.id] = cur.name;
                return pre;
              },
              {} as Record<number, string>,
            );
          },
        ),
      },
    },

    {
      label: '发放状态',
      fieldName: 'status',
      component: 'ApiSelect',
      componentProps: {
        options: couponStatus,
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

/** 列表的字段 */
export function useGridColumns<T = any>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'name',
      title: '名称',
      slots: {
        default: ({ row: { name, id } }) => `(${id}) ${name}`,
      },
    },
    {
      title: '所属门店',
      slots: {
        default: 'shop',
      },
    },
    {
      title: '发放情况',
      slots: {
        default: ({ row: { total_num, got_num } }) =>
          `${got_num} / ${total_num}`,
      },
    },
    {
      field: 'status',
      title: '开启状态',
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'red', label: '已停用', value: -1 },
          { color: 'gray', label: '未发放', value: 0 },
          { color: 'green', label: '已发放', value: 1 },
        ],
      },
    },
    {
      field: 'created_at',
      title: '创建时间',
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      align: 'center',
      cellRender: {
        name: 'CellOperation',
        attrs: {
          onClick: onActionClick,
          nameField: 'name',
          nameTitle: '代金券',
        },
        options: [
          {
            text: '修改',
            code: 'edit',
            show: (row: any) => {
              // 未发放判断
              const isNotGranted = row.status === 0;

              // 已发放判断
              const isGranted = row.status === 1;

              // 没有领取完毕
              const isNotFinished = row.got_num < row.total_num;

              return (isNotGranted || isGranted) && isNotFinished;
            },
          },
          {
            text: '删除',
            code: 'delete',
            // 未发放的代金券可删除
            show: (row: any) => row.status === 0,
          },
          {
            text: '停止发放',
            code: 'stop',
            color: 'warning',
            // 已发放 且 领取数量小于总数
            show: (row: any) => row.status === 1 && row.got_num < row.total_num,
          },
        ],
      },
    },
  ];
}
