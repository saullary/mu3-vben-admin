<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import kd100 from './comp/kd100';
import modalResult from './modal-result.vue';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { useColumns, useGridFormSchema } from './data';
import { queryAdmin, upsertAdmin } from '#/api';
import { TAB_NAME } from '#/utils/constant';

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
  },

  gridOptions: {
    columns: useColumns(onActionClick),
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: queryAdmin(TAB_NAME.trade.deliver),
      },
    },
  } as VxeTableGridOptions,
});

function onActionClick({ code, row }: OnActionClickParams<any>) {
  switch (code) {
    case 'delete': {
      onDelete(row);
      break;
    }
    default: {
      break;
    }
  }
}

function onRefresh() {
  gridApi.query();
}

function onDelete(row: any) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  upsertAdmin(TAB_NAME.trade.deliver, null, row.id)
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
</script>
<template>
  <Page auto-content-height>
    <Grid table-title="快递记录">
      <template #company="{ row }">
        {{ kd100.getKdCompany(row.company) }}
      </template>

      <template #result="{ row }">
        <modal-result
          :title="kd100.getKdCompany(row.company) + ' ' + row.order_no"
          :result="row.result"
        />
      </template>

      <template #status="{ row }">
        {{ kd100.getKdState(row.status) }}
      </template>
    </Grid>
  </Page>
</template>
