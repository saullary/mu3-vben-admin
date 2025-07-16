<script lang="ts" setup>
import type { UploadChangeParam, UploadFile } from 'ant-design-vue';
import { onMounted, ref, watch } from 'vue';
import { Upload, message } from 'ant-design-vue';
import { IconifyIcon } from '@vben/icons';
import supabase from '#/api/core/supabase';

defineOptions({ name: 'UploadImg', inheritAttrs: false });

const props = defineProps({
  maxCount: {
    type: Number,
    default: 1,
  },
  maxSize: {
    type: Number,
    default: 500,
  },
  modelValue: {
    type: [Array, String],
    default: () => [],
  },
  accept: {
    type: String,
    default: 'image/*',
  },
});

const emits = defineEmits(['update:modelValue']);

const localFileList = ref<{ url: String }[]>([]);

watch(
  () => props.modelValue,
  (nd) => {
    // 已经在上传结果列表
    let imgs = nd;
    if (typeof imgs === 'string') {
      imgs = [imgs];
    }

    localFileList.value = imgs.map((url) => ({ url: url as string }));
  },
  {
    immediate: true,
  },
);

function handleChange({ fileList }: UploadChangeParam<UploadFile<any>>) {
  console.log(fileList);

  for (const row of fileList) {
    if (!row.url && row.status !== 'done') {
      return;
    }
  }

  let val = fileList.map((file) => file.url || file.response?.url);

  if (props.maxCount === 1) {
    val = val[0];
  }

  emits('update:modelValue', val);
}

function beforeUpload(curFile: File) {
  const fSize = curFile.size / 1024 / 1024;

  if (fSize > props.maxSize) {
    message.error(`上传文件大小不能超过${props.maxSize}M`);
    return false;
  }

  return true;
}

const uploadHead = {
  Authorization: '',
};

onMounted(() => {
  supabase.auth.getSession().then((res) => {
    uploadHead.Authorization = res.data?.session?.access_token
      ? `Bearer ${res.data?.session?.access_token}`
      : '';
  });
});
</script>

<template>
  <div>
    <Upload
      v-model:file-list="localFileList"
      list-type="picture-card"
      :accept="props.accept"
      action="https://mu3.hqs.link/v1/fun/auth/upload"
      :headers="uploadHead"
      :max-count="props.maxCount"
      :multiple="props.maxCount > 1"
      :before-upload="beforeUpload"
      @change="handleChange"
    >
      <div
        v-if="props.maxCount > localFileList.length"
        class="flex flex-col items-center justify-center"
      >
        <IconifyIcon icon="iwwa:upload" class="size-8" />
        <div class="mt-2">点击上传</div>
      </div>
    </Upload>

    <!-- 上传提示 -->
    <div class="mt-2 flex flex-wrap items-center text-[14px]">
      文件大小限
      <div class="text-primary mx-1 font-bold">{{ props.maxCount }}MB</div>
    </div>
  </div>
</template>
