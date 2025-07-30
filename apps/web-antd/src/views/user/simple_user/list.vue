<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';

import { Page, useVbenModal } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { queryAdmin } from '#/api';

import { useColumns, useGridFormSchema } from './data';
import { TAB_NAME } from '#/utils/constant';
import ShowInfo from './showInfo.vue';

const [FormDrawer, formDrawerApi] = useVbenModal({
  connectedComponent: ShowInfo,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    proxyConfig: {
      ajax: {
        query: queryAdmin(TAB_NAME.USER.ORDINARY),
      },
    },
  } as VxeTableGridOptions,
});

function onActionClick({ row }: OnActionClickParams) {
  formDrawerApi.setData(row).open();
}

function onRefresh() {
  gridApi.query();
}
</script>

<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <Grid table-title="用户列表"> </Grid>
  </Page>
</template>
