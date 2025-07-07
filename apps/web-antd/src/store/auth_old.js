async function authLogin(params, onSuccess) {
  const {
    data: { accessToken },
  } = await loginApi2(params);

  // 如果成功获取到 accessToken
  if (accessToken) {
    accessStore.setAccessToken(accessToken);

    // 获取用户信息并存储到 accessStore 中
    const [fetchUserInfoResult, accessCodes] = await Promise.all([
      fetchUserInfo(),
      getAccessCodesApi(),
    ]);

    userInfo = fetchUserInfoResult;

    userStore.setUserInfo(userInfo);
    accessStore.setAccessCodes(accessCodes);

    if (accessStore.loginExpired) {
      accessStore.setLoginExpired(false);
    } else {
      onSuccess
        ? await onSuccess?.()
        : await router.push(
            userInfo.homePath || preferences.app.defaultHomePath,
          );
    }

    if (userInfo?.realName) {
      notification.success({
        description: `${$t('authentication.loginSuccessDesc')}:${userInfo?.realName}`,
        duration: 3,
        message: $t('authentication.loginSuccess'),
      });
    }
  }
}
