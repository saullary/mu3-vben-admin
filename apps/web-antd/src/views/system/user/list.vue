<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { listAdmin, queryAdmin, upsertAdmin } from '#/api';
import { $t } from '#/locales';

import Form from './form.vue';

import { useColumns, useGridFormSchema, tableName } from './data';
import type { UserInfoApi } from './data';
import { onMounted } from 'vue';
import { TAB_NAME } from '#/utils/constant';

let roleList: any[] = [];

onMounted(() => {
  listAdmin(TAB_NAME.system.role).then((data) => {
    roleList = data;
  });
});
function getRoleName(id: number) {
  return roleList.find((it) => it.id == id)?.name || id;
}

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  // destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    // fieldMappingTime: [['createTime', ['startTime', 'endTime']]],
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    proxyConfig: {
      ajax: {
        query: queryAdmin(tableName),
      },
    },
  } as VxeTableGridOptions<UserInfoApi.UserInfo>,
});

function onActionClick(e: OnActionClickParams<UserInfoApi.UserInfo>) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'edit': {
      onEdit(e.row);
      break;
    }
  }
}

function onEdit(row: UserInfoApi.UserInfo) {
  formDrawerApi.setData(row).open();
}

function onDelete(row: UserInfoApi.UserInfo) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  // deleteRole(row.id)
  upsertAdmin(tableName, null, row.id)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.name]),
        key: 'action_process_msg',
      });
      onRefresh();
    })
    .catch(() => {
      hideLoading();
    });
}

function onRefresh() {
  gridApi.query();
}

function onCreate() {
  formDrawerApi.setData({}).open();
}
</script>

<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <Grid table-title="用户列表">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          新增用户
        </Button>
      </template>

      <template #user_id="{ row }">
        <span>({{ row.id }})</span>
        <span class="ml-1">{{ row.user_id }}</span>
        <!-- <Button type="ghost">{{ row.user_id }}</Button> -->
      </template>
      <template #role_id="{ row }">
        <span>{{ getRoleName(row.role_id) }}</span>
      </template>
    </Grid>
  </Page>
</template>
