import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions, OnActionClickFn } from '#/adapter/vxe-table';
import { z } from '#/adapter/form';
import { DRangePickerProps } from '#/utils/date';
import { queryAdmin } from '#/api';
import { TAB_NAME } from '#/utils/constant';
import { ref } from 'vue';
import { codeAndName } from '#/utils/table';

const goodsStatusSel = [
  { label: '上架', value: 1 },
  { label: '下架', value: 0 },
];

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
      },
      fieldName: 'shop_id',
      label: '归属店铺',
      rules: 'selectRequired',
    },
    {
      component: 'ApiSelect',
      componentProps: {
        api: queryAdmin(TAB_NAME.SHOP.TYPE, {
          _select: 'id,name',
        }),
      },
      fieldName: 'type',
      label: '商品类型',
      rules: 'selectRequired',
    },
    {
      label: '商品图片',
      component: 'UploadImg',
      fieldName: 'cover',
      rules: z.string().min(1, '请上传商品图片'),
    },
    {
      component: 'Input',
      label: '商品名称',
      fieldName: 'name',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      fieldName: 'price',
      label: '售价',
      componentProps: {
        min: 0,
        prefix: '￥',
        precision: 2,
      },
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'bio',
      label: '简介',
    },
    {
      label: '详情图片',
      component: 'UploadImg',
      fieldName: 'detail_imgs',
      componentProps: {
        maxCount: 5,
      },
    },
    {
      component: 'InputNumber',
      label: '原价',
      fieldName: 'price_old',
      componentProps: {
        min: 0,
        prefix: '￥',
        precision: 2,
      },
    },
    {
      component: 'InputNumber',
      label: '保质期',
      fieldName: 'shelf_day',
      componentProps: {
        min: 0,
        addonAfter: '天',
        precision: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'RadioGroup',
      componentProps: {
        options: goodsStatusSel,
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: z.number().default(1),
    },
  ];
}

/** 门店列表 */
const shopList = ref([]);

/** 分类列表 */
const typeList = ref([]);

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'ApiSelect',
      componentProps: {
        api: queryAdmin(
          TAB_NAME.SHOP.INFO,
          {
            _select: 'id,name',
          },
          (data: any) => {
            shopList.value = data;
          },
        ),
      },
      fieldName: 'shop_id',
      label: '门店',
    },
    {
      component: 'ApiSelect',
      componentProps: {
        api: queryAdmin(
          TAB_NAME.SHOP.TYPE,
          {
            _select: 'id,name',
          },
          (data: any) => {
            typeList.value = data;
          },
        ),
      },
      fieldName: 'type',
      label: '分类',
    },
    {
      fieldName: 'name',
      label: '名称',
      component: 'Input',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: goodsStatusSel,
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
      field: 'id',
      title: 'ID',
      fixed: 'left',
      width: 80,
    },
    {
      field: 'shop_id',
      title: '门店ID',
      slots: {
        default: ({ row: { shop_id } }) => codeAndName(shop_id, shopList.value),
      },
    },
    {
      field: 'type',
      title: '分类ID',
      slots: {
        default: ({ row: { type } }) => codeAndName(type, typeList.value),
      },
    },
    {
      field: 'cover',
      title: '商品图片',
      cellRender: {
        name: 'CellImage',
        props: {
          height: 'auto',
        },
      },
    },
    {
      field: 'name',
      title: '商品名称',
    },
    {
      field: 'price',
      title: '售价/原价',
      slots: { default: 'price' },
    },
    {
      field: 'bio',
      title: '简介',
    },
    {
      field: 'status',
      title: '状态',
      cellRender: {
        name: 'CellTag',
        options: [
          { label: '上架', value: 1, color: 'green' },
          { label: '下架', value: 0, color: 'red' },
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
      field: 'operation',
      align: 'center',
      cellRender: {
        name: 'CellOperation',
        attrs: {
          nameField: 'name',
          nameTitle: '商品',
          onClick: onActionClick,
        },
      },
    },
  ];
}
