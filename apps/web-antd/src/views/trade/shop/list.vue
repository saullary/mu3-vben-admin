<script lang="ts" setup>
import type { VxeTableGridOptions, OnActionClickParams } from '#/adapter/vxe-table';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { useGridColumns, useGridFormSchema, table } from './data';
import Form from './form.vue';
import { queryAdmin, upsertAdmin } from '#/api';
import { $t } from '@vben/locales';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 编辑门店 */
function handleEdit(row?: any) {  
  formModalApi.setData(row).open();
}

/** 删除门店 */
async function handleDelete(row: any) {

  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });

  try {
    await upsertAdmin(table, null, row.id)
    message.success({
      content: `${row.name}删除成功`,
      key: 'action_process_msg',
    })

    onRefresh();
  } finally {
    hideLoading();
  }
}

function onActionClick({ code, row } : OnActionClickParams<any>) {
  switch (code) {
    case 'delete': {
      handleDelete(row);      
      break;
    }
    case 'edit': {
      handleEdit(row);
      break;
    }
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  // 搜索条件
  formOptions: {
    schema: useGridFormSchema(),
  },

  // 表格配置
  gridOptions: {
    columns: useGridColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: queryAdmin(table),
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
        <Button type="primary" @click="handleEdit()">
          <template #icon>
            <IconifyIcon icon="lucide:plus" />
          </template>
          新增
        </Button>
      </template>

    </Grid>
  </Page>
</template>
