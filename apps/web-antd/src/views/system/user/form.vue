<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
// import { getMenuList } from '#/api/system/menu';
// import { createRole, updateRole } from '#/api/system/role';
import { $t } from '#/locales';

import { upsertAdmin } from '#/api';
import { tableName, useFormSchema } from './data';
import type { UserInfoApi } from './data';

const emits = defineEmits(['success']);

const formData = ref<UserInfoApi.UserInfo>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const id = ref();
const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();
    upsertAdmin(tableName, values, id.value, drawerApi.getData())
      .then(() => {
        emits('success');
        drawerApi.close();
      })
      .catch(() => {
        drawerApi.unlock();
      });
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<UserInfoApi.UserInfo>();
      formApi.resetForm();

      if (data) {
        formData.value = data;
        id.value = data.id;
        formApi.setValues(data);
      } else {
        id.value = undefined;
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  return formData.value?.id
    ? $t('common.edit', $t('system.role.name'))
    : $t('common.create', $t('system.role.name'));
});
</script>

<template>
  <Drawer :title="getDrawerTitle">
    <Form> </Form>
  </Drawer>
</template>
