<template>
  <MainView />
  <v-snackbar-queue v-model="messageStore.queue" timeout="2500" />
</template>
<script setup lang="ts">
import { useMessageStore } from './stores/messageStore'
import MainView from './views/MainView.vue'

const messageStore = useMessageStore()
</script>

<style scoped>
body,
html {
  margin: 0;
  padding: 0;
  width: 210mm;
  height: 297mm;
}
</style>
