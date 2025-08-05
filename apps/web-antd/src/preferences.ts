import { defineOverridesPreferences } from '@vben/preferences';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    name: import.meta.env.VITE_APP_TITLE,
    authPageLayout: 'panel-center',
    enableCheckUpdates: true,
    layout: 'sidebar-mixed-nav',
    defaultHomePath: '/trade/order',
  },
  sidebar: {
    collapsed: true,
  },
  tabbar: {
    enable: false,
  },
  logo: {
    source: '/img/logo.webp',
  },
  copyright: {
    enable: false,
  },
  transition: {
    name: 'fade',
  },
  breadcrumb: {
    showIcon: false,
    showHome: false,
    hideOnlyOne: true,
  },
  theme: {
    mode: 'auto',
  },
  widget: {
    languageToggle: false,
    notification: false,
  },
});
