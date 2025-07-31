<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';
import { Descriptions, Avatar, Tag } from 'ant-design-vue';
import { ref } from 'vue';
import type { ITableData } from './data';
import { formatDateTime } from '@vben/utils';
import { listAdmin } from '#/api';
import { TAB_NAME } from '#/utils/constant';

const curUserInfo = ref<ITableData | undefined>();

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  footer: false,

  onCancel() {
    modalApi.close();
  },
  onOpenChange(isOpen) {
    if (!isOpen) {
      modalApi.close();
      return;
    }

    curUserInfo.value = modalApi.getData() as ITableData;

    getUserAddress(curUserInfo.value.user_id);
  },
});

const userAddress = ref<string[]>([]);

/** 获取指定用户的地址信息 */
function getUserAddress(user_id: string) {
  listAdmin(TAB_NAME.USER.ADDR, {
    user_id,
  }).then((res: any[]) => {
    userAddress.value = (res ?? []).map(
      ({ area_info: { address, title } }) =>
        address + (title ? `-${title}` : ''),
    );
  });
}
</script>

<template>
  <Modal title="用户信息">
    <Descriptions :column="1">
      <Descriptions.Item label="状态">
        <Tag v-if="curUserInfo?.status === 2" color="success">正常</Tag>
        <Tag v-else color="error">禁用</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="头像">
        <Avatar :src="curUserInfo?.avatar_url" />
      </Descriptions.Item>
      <Descriptions.Item label="姓名">{{
        curUserInfo?.nickname
      }}</Descriptions.Item>
      <Descriptions.Item label="联系方式">{{
        curUserInfo?.phone
      }}</Descriptions.Item>
      <Descriptions.Item label="邮箱">{{
        curUserInfo?.email
      }}</Descriptions.Item>
      <Descriptions.Item label="创建时间">{{
        formatDateTime(curUserInfo!.created_at)
      }}</Descriptions.Item>
      <Descriptions.Item label="地址">
        <!-- 逐行展示, 溢出折行吧. 隐藏还要额外处理 -->
        <div class="show-addr">
          <p v-for="(addr, addrI) of userAddress" :key="addrI" class="addr-row">
            {{ addr }}
          </p>
        </div>
      </Descriptions.Item>
    </Descriptions>
  </Modal>
</template>

<style lang="scss" scoped>
.show-addr {
  counter-reset: addrI;

  .addr-row {
    border-bottom-width: 1px;

    &::before {
      content: counter(addrI) '.';
      counter-increment: addrI;
    }

    & + & {
      margin-top: 0.5rem;
    }
  }
}
</style>
