<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { computed, onMounted, ref } from 'vue';

import { AuthenticationForgetPassword, z } from '@vben/common-ui';
import { message } from 'ant-design-vue';
import supabase from '#/api/core/supabase';
import { useRouter } from 'vue-router';
import { getPswHash } from '#/store';
// import { $t } from '@vben/locales';

defineOptions({ name: 'UpdatePassword' });

const loading = ref(false);
const email = ref('');
const router = useRouter();

onMounted(async () => {
  const res = await supabase.auth.getSession();
  email.value = res.data?.session?.user.email ?? '';
});

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: '新密码',
      },
      fieldName: 'psw',
      label: '新密码',
      rules: z.string().min(6, { message: '密码不少于6位' }),
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: '确认新密码',
      },
      fieldName: 'repsw',
      label: '确认新密码',
      rules: z.string().min(6, { message: '密码不少于6位' }),
    },
  ];
});

async function handleSubmit(value: Recordable<any>) {
  if (value.psw != value.repsw) {
    message.error('两次输入密码不一致');
    return;
  }
  // console.log('reset email:', value);
  try {
    loading.value = true;
    await supabase.auth.updateUser({ password: getPswHash(value.psw) });
    message.success('密码重置成功');
    router.push('/auth/login');
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}
</script>

<template>
  <AuthenticationForgetPassword
    title="重置密码"
    :sub-title="email"
    submitButtonText="确认重置"
    :form-schema="formSchema"
    :loading="loading"
    @submit="handleSubmit"
  />
</template>
