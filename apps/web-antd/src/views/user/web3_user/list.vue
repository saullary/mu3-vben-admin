<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { queryAdmin } from '#/api';

import { useColumns, useGridFormSchema } from './data';
import { TAB_NAME } from '#/utils/constant';

const [Grid] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useColumns(),
    proxyConfig: {
      ajax: {
        query: queryAdmin(TAB_NAME.USER.WEB3),
      },
    },
  } as VxeTableGridOptions,
});
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="用户列表"> </Grid>
  </Page>
</template>
