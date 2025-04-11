<template>
  <v-container class="py-10">
    <v-row justify="center" class="mb-6">
      <v-col cols="12" class="text-center">
        <h1 class="font-weight-bold mb-4">如何操作</h1>
      </v-col>
    </v-row>

    <v-row justify="center" align="stretch" class="text-center" dense>
      <v-col cols="12" lg="4">
        <v-card class="pa-4" elevation="2">
          <h3 class="mb-3">1. 匯出 CSV 檔</h3>
          <img src="/assets/guide1.gif" class="guide-img" />
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card class="pa-4" elevation="2">
          <h3 class="mb-3">2. 載入 CSV 檔</h3>
          <img src="/assets/guide2.gif" class="guide-img" />
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card class="pa-4" elevation="2">
          <h3 class="mb-3">3. 列印</h3>
          <img src="/assets/guide3.gif" class="guide-img" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.guide-img {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
}
</style>
