<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { useGridColumns, useGridFormSchema } from './data';
import Form from './form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 创建门店 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑门店 */
// function handleEdit(row: any) {
//   formModalApi.setData(row).open();
// }

const [Grid, gridApi] = useVbenVxeGrid({
  // 搜索条件
  formOptions: {
    schema: useGridFormSchema(),
  },

  // 表格配置
  gridOptions: {
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        // query: async ({ page }, formValues) => {
        query: async () => {
          // page: currentPage  pageSize total
          // formValues: 搜索条件
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      refresh: { code: 'query' },
      search: true,
      custom: true,
      zoom: true,
    },
  } as VxeTableGridOptions<any>,
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />

    <Grid table-title="门店列表">
      <template #toolbar-tools>
        <Button type="primary" @click="handleCreate()">
          <template #icon>
            <IconifyIcon icon="lucide:plus" />
          </template>
          新增
        </Button>
      </template>

      <template #actions>
        <div>操作列</div>
      </template>
    </Grid>
  </Page>
</template>
