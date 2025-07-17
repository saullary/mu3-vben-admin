<script lang="ts" setup>
import type {
  VxeTableGridOptions,
  OnActionClickParams,
} from '#/adapter/vxe-table';
import { Page, useVbenDrawer } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { Button, message } from 'ant-design-vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useGridColumns, useGridFormSchema } from './data';
import Form from './form.vue';
import { queryAdmin, upsertAdmin } from '#/api';
import { TAB_NAME } from '#/utils/constant';

const [DrawerModal, drawerModalApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 编辑门店 */
function handleEdit(row?: any) {
  drawerModalApi.setData(row).open();
}

/** 删除门店 */
async function handleDelete(row: any) {
  const hideLoading = message.loading({
    content: `正在删除${row.name}`,
    key: 'action_process_msg',
  });

  try {
    await upsertAdmin(TAB_NAME.SHOP.GOODS, null, row.id);
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
    proxyConfig: {
      ajax: {
        query: queryAdmin(TAB_NAME.SHOP.GOODS),
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
    <DrawerModal @success="onRefresh" />

    <Grid table-title="商品列表">
      <template #toolbar-tools>
        <Button type="primary" @click="handleEdit()">
          <template #icon>
            <IconifyIcon icon="lucide:plus" />
          </template>
          新增
        </Button>
      </template>

      <!-- 商品价格 -->
      <template #price="{ row }">
        <!-- 售价 -->
        {{ row.price }}

        <!-- 原价 -->
        <template v-if="row.price_old">
          <span class="mx-1">/</span>
          <span class="text-th text-[#999] line-through">
            {{ row.price_old }}
          </span>
        </template>
      </template>
    </Grid>
  </Page>
</template>
