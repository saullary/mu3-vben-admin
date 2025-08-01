import { z, type VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions, OnActionClickFn } from '#/adapter/vxe-table';
import { DRangePickerProps } from '#/utils/date';
import { queryAdmin } from '#/api';
import { TAB_NAME } from '#/utils/constant';
import { h, reactive, ref } from 'vue';
import { codeAndName } from '#/utils/table';

export const typeCode = {
  Money: 0, // 满减
  Goods: 1, // 指定商品
  Classify: 2, // 指定分类
};

/** 代金券类型 */
const couponTypes = [
  { label: '满减', value: typeCode.Money },
  { label: '指定商品', value: typeCode.Goods },
  { label: '指定分类', value: typeCode.Classify },
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
      label: '门店',
      rules: 'selectRequired',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '名称',
      rules: 'required',
      disabled: false,
    },
    {
      component: 'ApiSelect',
      componentProps: {
        options: couponTypes,
        allowClear: false,
      },
      dependencies: {
        triggerFields: ['shop_id'],
        show: (formParams) => {
          return formParams.shop_id !== void 0;
        },
      },
      defaultValue: 0,
      fieldName: 'type',
      label: '类型',
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
          return vals.type === typeCode.Money;
        },
        show(vals) {
          // 仅当选择门店后, 展示组件
          return vals.shop_id !== void 0;
        },
        triggerFields: ['type', 'shop_id'],
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
          return vals.type === typeCode.Goods;
        },
        show(vals) {
          // 仅当选择门店后, 展示组件
          return vals.shop_id !== void 0;
        },
        triggerFields: ['type', 'shop_id'],
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
          return vals.type === typeCode.Classify;
        },
        show(vals) {
          // 仅当选择门店后, 展示组件
          return vals.shop_id !== void 0;
        },
        triggerFields: ['type', 'shop_id'],
      },
      rules: 'selectRequired',
    },

    // ------------------------ 不同类型的必填项 end

    {
      label: '优惠金额',
      fieldName: 'cut_price',
      component: 'InputNumber',
      componentProps: {
        precision: 2,
      },
      rules: z
        .number({
          message: '请输入优惠金额',
        })
        .min(0),
    },

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
      label: '有效天数',
      fieldName: 'valid_day',
      component: 'InputNumber',
      componentProps: {
        precision: 0,
        min: 1,
        placeholder: '不填，长期有效',
      },
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

/** 门店列表 */
const shopList = reactive<IdAndName[]>([]);

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
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
            shopList.splice(0, shopList.length, ...data);
          },
        ),
      },
    },

    {
      label: '代金券名称',
      fieldName: 'name',
      component: 'Input',
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
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    {
      title: '所属门店',
      slots: {
        default: ({ row: { shop_id } }) => codeAndName(shop_id, shopList),
      },
    },
    {
      field: 'name',
      title: '名称',
    },
    // {
    //   title: '优惠金额',
    //   slots: {
    //     default: ({ row: { cut_price } }) => h('p', [cut_price, '元']),
    //   },
    // },
    {
      title: '备注',
      showOverflow: false,
      align: 'left',
      slots: {
        default: ({ row }) =>
          h('div', [
            h('p', row.note),
            h('p', `优惠金额: ${row.cut_price}元`),
            h(
              'p',
              `有效期: ${row.valid_day ? `${row.valid_day}天` : '无限制'}`,
            ),
          ]),
      },
      cellRender: {
        props: {
          showOverflowTooltip: false,
        },
      },
    },
    {
      title: '发放情况',
      slots: {
        default: ({ row: { total_num, got_num } }) =>
          `${got_num} / ${total_num}`,
      },
      width: 100,
    },
    {
      field: 'status',
      title: '开启状态',
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
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
          },
          {
            text: '删除',
            code: 'delete',
            // 无人领取, 可删除
            show: (row: any) => row.got_num === 0,
          },
        ],
      },
    },
  ];
}
