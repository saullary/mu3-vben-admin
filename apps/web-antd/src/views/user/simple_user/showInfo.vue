<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';
import { Descriptions, Avatar, Tag } from 'ant-design-vue';
import { ref } from 'vue';
import type { ITableData } from './data';
import { formatDateTime } from '@vben/utils';

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
  },
});
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
    </Descriptions>
  </Modal>
</template>
