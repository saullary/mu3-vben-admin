<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import { Page } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useGridColumns, useGridFormSchema } from './data';
import { queryAdmin } from '#/api';
import { TAB_NAME } from '#/utils/constant';

const [Grid] = useVbenVxeGrid({
  // 搜索条件
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
  },

  // 表格配置
  gridOptions: {
    columns: useGridColumns(),
    proxyConfig: {
      ajax: {
        // 使用example代替实际的API调用
        query: queryAdmin(TAB_NAME.trade.pay),
      },
    },
    cellConfig: {
      height: 80,
    },
  } as VxeTableGridOptions<any>,
});
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="支付列表"> </Grid>
  </Page>
</template>
