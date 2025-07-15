<script lang="ts" setup>
import type {
  VxeTableGridOptions,
  OnActionClickParams,
} from '#/adapter/vxe-table';

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

/** 新增操作 */
function handleEdit(row?: any) {
  formModalApi.setData(row).open();
}

/** 删除操作 */
async function handleDelete(row: any) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });

  try {
    await upsertAdmin(table, null, row.id);
    message.success({
      content: `${row.name}删除成功`,
      key: 'action_process_msg',
    });

    onRefresh();
  } finally {
    hideLoading();
  }
}

function onActionClick({ code, row }: OnActionClickParams<any>) {
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
    submitOnChange: true,
  },

  // 表格配置
  gridOptions: {
    columns: useGridColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: queryAdmin(table),
        querySuccess: (...res) => {
          console.log('查询结果', res);
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

function sortItem(row: any, index: number, type: 'down' | 'up') {
  console.log('需要排序', row);
}
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

      <!-- 排序 -->
      <template #orderCol="{ row, rowIndex }">
        <div class="order-class">
          <IconifyIcon
            class="up-icon"
            :rotate="-45"
            icon="ant-design:swap-right-outlined"
            @click="sortItem(row, rowIndex, 'up')"
          />
          <IconifyIcon
            class="down-icon"
            :rotate="45"
            icon="ant-design:swap-right-outlined"
            @click="sortItem(row, rowIndex, 'down')"
          />
        </div>
      </template>
    </Grid>
  </Page>
</template>

<style lang="scss" scoped>
.order-class {
  display: flex;
  justify-content: center;

  .down-icon,
  .up-icon {
    font-size: 30px;
    cursor: pointer;

    &:hover {
      transform: scale(1.2);
    }
  }

  .up-icon {
    color: green;
  }

  .down-icon {
    color: red;
  }
}
</style>
