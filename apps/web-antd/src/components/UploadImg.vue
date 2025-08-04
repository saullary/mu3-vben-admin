<script lang="ts" setup>
import type { UploadChangeParam, UploadFile } from 'ant-design-vue';
import { onMounted, ref, watch } from 'vue';
import { Upload, message, Modal } from 'ant-design-vue';
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
    default: 0.5,
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

const localFileList = ref<UploadFile[]>([]);

watch(
  () => props.modelValue,
  (nd) => {
    if (!nd || nd.length === 0) {
      localFileList.value = [];
      return;
    }
    // 已经在上传结果列表
    let imgs = nd;
    if (typeof imgs === 'string') {
      imgs = [imgs];
    }

    localFileList.value = imgs.map((url, i) => ({
      url: url as string,
      uid: i + '', // 占位
      name: i + '', // 占位
    }));
  },
  {
    immediate: true,
  },
);

function handleChange({ fileList }: UploadChangeParam<UploadFile<any>>) {
  const isFileReady = fileList.some((row) => {
    // 跳过回显文件
    if (row.url) {
      return false;
    }

    // 选择文件后触发的特征 || 文件上传中的特征
    return (
      (row.percent === 0 && !row.thumbUrl) ||
      (!row.thumbUrl && row.status === 'uploading')
    );
  });

  if (isFileReady) {
    return;
  }

  // 有上传失败的文件, 进行提示
  for (const row of fileList) {
    if (!row.url && !row.status) {
      message.error(`${row.name} 上传失败`);
    }
  }

  // url: 回显赋值; response?.url 服务端响应数据
  let val = fileList
    .map((row) => row.url || row.response?.url)
    .filter((url) => url);

  // 最大上传数为1, 直接返回文件链接
  if (props.maxCount === 1) {
    val = val[0];
  }

  emits('update:modelValue', val);
}

function beforeUpload(curFile: UploadFile, curFileList: UploadFile[]) {
  const fSize = curFile.size! / 1024 / 1024;

  if (fSize > props.maxSize) {
    message.error(`${curFile.name}文件超过${props.maxSize}MB`);
    // 标记不符文件
    const index = curFileList.findIndex((file) => file.uid === curFile.uid);
    curFileList[index]!.status = 'error';

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

// -------------------- 预览
const previewImg = ref('');

async function handlePreview(curFile: UploadFile) {
  previewImg.value = curFile.url as string;
}
</script>

<template>
  <div>
    <Upload
      v-model:file-list="localFileList"
      list-type="picture-card"
      :accept="props.accept"
      action="https://tg2.quzz.fun/v1/fun/auth/upload"
      :headers="uploadHead"
      :max-count="props.maxCount"
      :multiple="props.maxCount > 1"
      :before-upload="beforeUpload"
      @change="handleChange"
      @preview="handlePreview"
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
      <div class="text-primary mx-1 font-bold">{{ props.maxSize }}MB</div>
    </div>

    <!-- 图片预览 -->
    <Modal
      :open="!!previewImg"
      :footer="null"
      @cancel="previewImg = ''"
      title="门店LOGO"
    >
      <img alt="example" style="width: 100%" :src="previewImg" />
    </Modal>
  </div>
</template>
