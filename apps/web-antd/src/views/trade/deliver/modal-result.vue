<script lang="ts" setup>
import { useVbenDrawer, VbenButton, JsonViewer } from '@vben/common-ui';

const [Modal, modalApi] = useVbenDrawer();

interface Props {
  title: string;
  result: Object;
}

const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
  <div>
    <VbenButton variant="ghost" size="sm" @click="() => modalApi.open()"
      >JSON</VbenButton
    >
    <Modal class="w-[600px]" :title="props.title">
      <JsonViewer :value="props.result" copyable preview-mode />
    </Modal>
  </div>
</template>
