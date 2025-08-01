<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import { Page } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { queryAdmin } from '#/api';
import { useColumns, useGridFormSchema } from './data';
import { TAB_NAME } from '#/utils/constant';
import { cloneDeep } from '@vben/utils';

const localReq = queryAdmin(TAB_NAME.USER.COUPON);

const [Grid] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useColumns(),
    proxyConfig: {
      ajax: {
        query: ({ page, sort }, form) => {
          // 拷贝一份, 不影响原始数据
          const formCopy = cloneDeep(form);
          delete formCopy.validTime;

          // TODO GMT格式

          // const timeGuide = formCopy.validTime;
          // if (timeGuide) {
          //   formCopy.valid_begin = new Date(timeGuide[0])
          //     .toISOString()
          //     .replace('Z', '+00:00');
          //   formCopy.valid_end = new Date(timeGuide[1])
          //     .toISOString()
          //     .replace('Z', '+00:00');
          //   delete formCopy.validTime;
          // }

          return localReq({ page, sort }, formCopy);
        },
      },
    },
  } as VxeTableGridOptions,
});
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="领取记录"></Grid>
  </Page>
</template>
