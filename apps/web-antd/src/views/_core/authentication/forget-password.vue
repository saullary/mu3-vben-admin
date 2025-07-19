<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { computed, ref } from 'vue';

import { AuthenticationForgetPassword, z } from '@vben/common-ui';
import { $t } from '@vben/locales';
import supabase, { getSbData } from '#/api/core/supabase';

defineOptions({ name: 'ForgetPassword' });

const loading = ref(false);
const sendTo = ref('');

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: 'example@example.com',
      },
      fieldName: 'email',
      label: $t('authentication.email'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.emailTip') })
        .email($t('authentication.emailValidErrorTip')),
    },
  ];
});

async function handleSubmit(value: Recordable<any>) {
  // console.log('reset email:', value);
  try {
    loading.value = true;
    const res = await supabase.auth.resetPasswordForEmail(value.email, {
      redirectTo: location.origin + '/auth/update-password',
    });
    console.log(res);
    getSbData(res);
    sendTo.value = value.email;
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}
</script>

<template>
  <div v-if="sendTo" class="text-center">
    <div class="text-base">密码重置邮件已发送至</div>
    <div class="mt-2">{{ sendTo }}</div>
  </div>
  <AuthenticationForgetPassword
    v-else
    :form-schema="formSchema"
    :loading="loading"
    @submit="handleSubmit"
  />
</template>
