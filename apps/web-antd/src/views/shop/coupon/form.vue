<script lang="ts" setup>
import { computed, ref } from 'vue';
import { ApiComponent, useVbenDrawer } from '@vben/common-ui';
import { message } from 'ant-design-vue';
import { useVbenForm } from '#/adapter/form';
import { $t } from '#/locales';
import { useFormSchema, typeCode } from './data';
import { upsertAdmin } from '#/api';
import { TAB_NAME } from '#/utils/constant';

const emit = defineEmits(['success']);
const formData = ref();
const getTitle = computed(
  () => (formData.value?.id ? '修改' : '新增') + '代金券',
);

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

type TApiComponent = InstanceType<typeof ApiComponent>;

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    // 提交表单
    const data = await formApi.getValues();

    // 判断最新总数是否小于已领取数量
    if (data.total_num < data.got_num) {
      message.error('代金券总数小于已领取数量，请重新填写！');
      return;
    }

    let note = '';

    // 满减
    if (data.type === typeCode.Money) {
      note = `门槛金额：${data.base_price}元`;
    }
    // 指定商品
    else if (data.type === typeCode.Goods) {
      const guide = formApi
        .getFieldComponentRef<TApiComponent>('goods_id')!
        .getOptions();
      const goods = guide.find((row) => row.value === data.goods_id)?.label;
      note = `指定商品：${goods}`;
    }
    // 指定分类
    else if (data.type === typeCode.Classify) {
      const guide = formApi
        .getFieldComponentRef<TApiComponent>('goods_type')!
        .getOptions();
      const classify = guide.find(
        (row) => row.value === data.goods_type,
      )?.label;
      note = `指定分类：${classify}`;
    }

    // 代金券默认状态
    if (!data?.id) {
      data.status = 0; // 0-未发放
      data.got_num = 0; // 已发放数量
    }

    // 记录优惠配置
    data.note = note;

    try {
      drawerApi.lock();
      // 等待服务端响应
      await upsertAdmin(
        TAB_NAME.SHOP.COUPON,
        data,
        data?.id,
        drawerApi.getData(),
      );
      // 关闭并提示
      await drawerApi.close();
      emit('success');
      message.success($t('ui.actionMessage.operationSuccess'));
    } finally {
      drawerApi.unlock();
    }
  },

  /** 弹窗显隐变化钩子 */
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      return;
    }
    // 加载数据
    const data = drawerApi.getData();

    if (!data || !data.id) {
      return;
    }
    drawerApi.lock();
    try {
      formData.value = data;

      // 禁止表单修改, 单独设置总数可修改
      formApi.setState({ commonConfig: { disabled: true } });

      await formApi.setValues(formData.value);
    } finally {
      drawerApi.unlock();
    }
  },
});
</script>

<template>
  <Drawer class="w-[40%]" :title="getTitle">
    <Form class="mx-4" />
  </Drawer>
</template>
