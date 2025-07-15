import type { Recordable, UserInfo } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

// import { notification } from 'ant-design-vue';
import { defineStore } from 'pinia';

import {
  // getAccessCodesApi,
  getUserInfoApi,
} from '#/api';
// import { $t } from '#/locales';
import supabase, { getSbData } from '#/api/core/supabase';

export function getPswHash(psw: string) {
  return psw;
}

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   */
  async function authLogin(
    params: Recordable<any>,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let userInfo: null | UserInfo = null;
    try {
      loginLoading.value = true;
      console.log(params);
      const res = await supabase.auth.signInWithPassword({
        email: params.username,
        password: getPswHash(params.password),
      });
      const { user, session } = getSbData(res, true, {
        getErrMsg(err: any) {
          let msg = err.message;
          if (/invalid/i.test(msg)) msg = '登录信息不正确';
          return msg;
        },
      });
      accessStore.setAccessToken(session.access_token);

      userInfo = {
        userId: user.id,
        username: user.email,
        realName: user.email,
        avatar: '',
        desc: 'test',
        homePath: '/',
        token: session.access_token,
      };
      userStore.setUserInfo(userInfo);
      // userStore.setSupaUser(user)
      accessStore.setAccessCodes([
        'AC_100100',
        'AC_100110',
        'AC_100120',
        'AC_100010',
      ]);

      if (onSuccess) {
        await onSuccess();
      } else {
        console.log('111');
        await router.push(userInfo.homePath || preferences.app.defaultHomePath);
      }
    } finally {
      loginLoading.value = false;
    }

    return {
      userInfo,
    };
  }

  async function logout(redirect: boolean = true) {
    try {
      // await logoutApi();
      await supabase.auth.signOut();
    } catch {
      // 不做任何处理
    }
    resetAllStores();
    accessStore.setLoginExpired(false);

    // 回登录页带上当前路由地址
    await router.replace({
      path: LOGIN_PATH,
      query: redirect
        ? {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          }
        : {},
    });
  }

  async function fetchUserInfo() {
    let userInfo: null | UserInfo = null;
    userInfo = await getUserInfoApi();
    userStore.setUserInfo(userInfo);
    return userInfo;
  }

  function $reset() {
    loginLoading.value = false;
  }

  return {
    $reset,
    authLogin,
    fetchUserInfo,
    loginLoading,
    logout,
  };
});
