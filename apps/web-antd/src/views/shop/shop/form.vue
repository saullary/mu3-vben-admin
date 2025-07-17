<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { $t } from '#/locales';

import { useFormSchema, table } from './data';

import { upsertAdmin } from '#/api';

const emit = defineEmits(['success']);
const formData = ref();
const getTitle = computed(() => (formData.value?.id ? '修改门店' : '新增门店'));

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

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    drawerApi.lock();

    // 提交表单
    const data = await formApi.getValues();

    try {
      // 等待服务端响应
      await upsertAdmin(table, data, data?.id, drawerApi.getData());
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
