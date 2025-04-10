<template>
  <v-container class="fill-height d-flex align-center justify-center text-center">
    <v-row>
      <v-col cols="12">
        <v-card class="pa-6" elevation="4">
          <h1 class="font-weight-bold mb-4">關於本應用程式</h1>

          <p class="text-body-1 mb-2">查看於 GitHub 上的原始碼：</p>

          <a
            href="https://github.com/hsa00000/sheet"
            target="_blank"
            rel="noopener"
            class="text-decoration-underline font-weight-medium"
          >
            https://github.com/hsa00000/sheet
          </a>

          <div class="powered-by d-flex align-center justify-center mt-6">
            <span class="text-body-1 font-weight-medium me-2">Powered by</span>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg"
              class="vue-logo"
            />
            <span class="text-body-1 font-weight-bold ms-2">Vue 3</span>
          </div>

          <p class="text-caption text-grey mt-6">上次更新：{{ buildDate }}</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
const buildDate = new Date(BUILD_DATE).toLocaleDateString('zh-TW', {
  timeZone: 'Asia/Taipei',
  dateStyle: 'long',
})
</script>

<style scoped>
a {
  color: #1976d2;
}
.vue-logo {
  height: 28px;
}
</style>
