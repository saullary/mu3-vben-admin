<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useVbenModal } from '@vben/common-ui';
import { message } from 'ant-design-vue';
import { useVbenForm } from '#/adapter/form';
import { $t } from '#/locales';
import { useFormSchema } from './data';
import { upsertAdmin } from '#/api';
import { TAB_NAME } from '#/utils/constant';

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

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    modalApi.lock();

    // 提交表单
    const data = await formApi.getValues();

    try {
      // 等待服务端响应
      await upsertAdmin(TAB_NAME.SHOP.TYPE, data, data?.id, modalApi.getData());
      // 关闭并提示
      await modalApi.close();
      emit('success');
      message.success($t('ui.actionMessage.operationSuccess'));
    } finally {
      modalApi.unlock();
    }
  },

  /** 弹窗显隐变化钩子 */
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      return;
    }
    // 加载数据
    const data = modalApi.getData();

    if (!data || !data.id) {
      return;
    }
    modalApi.lock();
    try {
      formData.value = data;

      await formApi.setValues(formData.value);
    } finally {
      modalApi.unlock();
    }
  },
});
</script>

<template>
  <Modal class="w-[40%]" :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
