<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Button, message, Popconfirm } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { useGridColumns, useGridFormSchema, table } from './data';
import Form from './form.vue';
import { queryAdmin, upsertAdmin } from '#/api';

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
    content: `正在删除${row.name}`,
    key: 'action_process_msg',
  })

  try {
    console.log('删除门店', row);
    gridApi.setLoading(true)

    await upsertAdmin(table, null, row.id)

    message.success({
      content: `${row.name}删除成功`,
      key: 'action_process_msg',
    })

    onRefresh();
  } finally {
    hideLoading();
    gridApi.setLoading(false)
  }
}

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

      <template #actions="{ row } ">
        <Button type="link" @click="handleEdit(row)">
          <template #icon>
            <IconifyIcon icon="lucide:edit" />
          </template>
          编辑
        </Button>

        <Popconfirm
          title="确定删除吗？"
          @confirm="handleDelete(row)"          
        >
          <Button danger type="link">
            <template #icon>
              <IconifyIcon icon="lucide:trash" />
            </template>
            <span>删除</span>
          </Button>
        </Popconfirm>
      </template>
    </Grid>
  </Page>
</template>
