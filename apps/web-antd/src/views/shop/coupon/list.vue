<script lang="ts" setup>
import type {
  VxeTableGridOptions,
  OnActionClickParams,
} from '#/adapter/vxe-table';
import { confirm, Page, useVbenDrawer } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { Button, message } from 'ant-design-vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useGridColumns, useGridFormSchema, shopInfos } from './data';
import Form from './form.vue';
import { queryAdmin, upsertAdmin } from '#/api';
import { $t } from '@vben/locales';
import { TAB_NAME } from '#/utils/constant';

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 编辑 */
function handleEdit(row?: any) {
  formDrawerApi.setData(row).open();
}

/** 删除 */
async function handleDelete(row: any) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });

  try {
    await upsertAdmin(TAB_NAME.SHOP.COUPON, null, row.id);
    message.success({
      content: `${row.name}删除成功`,
      key: 'action_process_msg',
    });

    onRefresh();
  } finally {
    hideLoading();
  }
}

/** 停止发放 */
async function handleStop(row: any) {
  await confirm({
    title: '确定要停止发放吗？',
    content: `停止发放后，优惠券 ${row.name} 将不再发放给用户`,
  }).catch(() => Promise.reject());

  const hideLoading = message.loading({
    content: `正在停止发放 ${row.name}`,
    duration: 0,
    key: 'action_process_msg',
  });

  try {
    await upsertAdmin(TAB_NAME.SHOP.COUPON, { status: -1 }, row.id);

    message.success({
      content: `${row.name}已停止发放`,
      key: 'action_process_msg',
    });

    onRefresh();
  } finally {
    hideLoading();
  }
}

/** 操作函数 */
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
    case 'stop': {
      // 没想好怎么二次提示
      handleStop(row);
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
        query: queryAdmin(TAB_NAME.SHOP.COUPON),
      },
    },
    cellConfig: {
      height: 80,
    },
  } as VxeTableGridOptions<any>,
});

// -------------------- 门店id对应门名称
</script>

<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />

    <Grid table-title="代金券列表">
      <template #toolbar-tools>
        <Button type="primary" @click="handleEdit()">
          <template #icon>
            <IconifyIcon icon="lucide:plus" />
          </template>
          新增
        </Button>
      </template>

      <template #shop="{ row: { shop_id } }">{{ shopInfos[shop_id] }}</template>
    </Grid>
  </Page>
</template>
