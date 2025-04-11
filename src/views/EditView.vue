<template>
  <v-container class="fill-height d-flex align-center justify-center text-center">
    <v-row>
      <v-col cols="12" xl="3">
        <!-- 用餐勾選 -->
        <v-list-item>
          <template #prepend>
            <v-list-item-action start>
              <v-checkbox-btn v-model="modeStore.enableFood" label="用餐" />
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-col>
      <v-col cols="12" xl="6">
        <v-card>
          <v-card-text>
            <v-text-field
              v-model="activityStore.name"
              label="活動名稱"
              variant="underlined"
              dense
            ></v-text-field>
            <v-text-field
              v-model="activityStore.period"
              label="活動日期"
              variant="underlined"
              dense
            ></v-text-field>
            <v-text-field
              v-model="activityStore.location"
              label="活動地點"
              variant="underlined"
              dense
            ></v-text-field>
          </v-card-text>

          <v-data-table
            :headers="tableHeaders"
            :items="participantStore.combinedList"
            v-model:page="page"
            class="print-table row-height-26 text-center text-black"
            :items-per-page="itemsPerPage"
            no-data-text="請先選擇 csv 檔"
            items-per-page-text="每頁顯示數量"
          >
            <!-- Index column -->
            <template #[`item.index`]="{ index }">
              {{ (page - 1) * itemsPerPage + index + 1 }}
            </template>

            <!-- Editable id column -->
            <template #[`item.id`]="{ item }">
              <v-text-field v-model="item.id" hide-details></v-text-field>
            </template>

            <!-- Editable department column -->
            <template #[`item.department`]="{ item }">
              <v-text-field v-model="item.department" hide-details></v-text-field>
            </template>

            <!-- Editable name column -->
            <template #[`item.name`]="{ item }">
              <v-text-field v-model="item.name" hide-details></v-text-field>
            </template>

            <!-- Editable food column -->
            <template #[`item.food`]="{ item }">
              <v-text-field v-model="item.food" hide-details></v-text-field>
            </template>

            <!-- button column -->
            <template #[`item.actions`]="{ item }">
              <div class="d-flex flex-row justify-center ga-1">
                <v-btn variant="outlined" @click="deleteParticipant(item)">刪除</v-btn>
                <v-btn
                  variant="outlined"
                  @click="moveUp(item)"
                  :disabled="participantStore.isOutsider(item)"
                >
                  上移
                </v-btn>
                <v-btn
                  variant="outlined"
                  @click="moveDown(item)"
                  :disabled="participantStore.isOutsider(item)"
                >
                  下移
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="12" xl="3">
        <v-file-input
          prepend-icon=""
          append-inner-icon="mdi-paperclip"
          v-model="uploadedFile"
          label="選擇 CSV 檔"
          accept=".csv"
          show-size
        />
        <v-text-field v-model="newOutsider" label="新增校外人士" hide-details class="mb-5">
          <template #append-inner>
            <v-btn variant="text" @click="addOutsider" :disabled="!newOutsider"> 新增 </v-btn>
          </template>
        </v-text-field>
        <v-number-input
          v-model="emptyPageNumberStore.emptyPageNumber"
          label="額外空白簽到頁數"
          :min="0"
          :step="1"
          control-variant="default"
          hide-details
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useActivityStore } from '@/stores/activityStore'
import type { Participant } from '@/type/type'
import { itemsPerPage } from '@/const/const'
import { ref, computed, watch } from 'vue'
import { useParticipantStore } from '@/stores/participantStore'
import { useModeStore } from '@/stores/modeStore'
import { useEmptyPageNumberStore } from '@/stores/emptyPageNumberStore'
import { saveParticipants } from '@/db/db'
import { headers } from '@/script/computeHeader'
import { parseCsvToParticipantList } from '@/script/parse'
import { useMessageStore } from '@/stores/messageStore'

const emptyPageNumberStore = useEmptyPageNumberStore()
const page = ref(1)
const activityStore = useActivityStore()
const participantStore = useParticipantStore()
const modeStore = useModeStore()
const messageStore = useMessageStore()

const newOutsider = ref('')

// Computed headers to add a delete column dynamically

const tableHeaders = computed(() => [
  ...headers.value,
  { title: '操作', key: 'actions', align: 'center' as const, width: '100px', sortable: false },
])

// Function to delete a participant

const deleteParticipant = (participant: Participant) => {
  const index = participantStore.combinedList.findIndex((p) => p === participant)
  if (index !== -1) {
    participantStore.deleteByCombinedIndex(index)
    saveParticipants(participantStore.participantList)
  }
}

const moveUp = (participant: Participant) => {
  const index = participantStore.combinedList.findIndex((p) => p === participant)
  const participantListIndex = index - participantStore.outsider.length
  if (participantListIndex >= 0) {
    participantStore.moveUpInParticipantList(participantListIndex)
    saveParticipants(participantStore.participantList)
  }
}

const moveDown = (participant: Participant) => {
  const index = participantStore.combinedList.findIndex((p) => p === participant)
  const participantListIndex = index - participantStore.outsider.length
  if (participantListIndex >= 0) {
    participantStore.moveDownInParticipantList(participantListIndex)
    saveParticipants(participantStore.participantList)
  }
}

const addOutsider = () => {
  const name = newOutsider.value.trim()
  if (!name) return

  const exists = participantStore.outsider.some((p) => p.name === name)
  if (!exists) {
    participantStore.outsider.push({
      id: '',
      department: '校外人士',
      name,
      food: '無須用餐',
    })
    newOutsider.value = ''
    saveParticipants(participantStore.participantList)
  }
}

const uploadedFile = ref<File | null>(null)

watch(uploadedFile, async (file) => {
  if (!file) return

  const fileName = file.name.toLowerCase()
  const validExtension = fileName.endsWith('.csv')
  const validMimeType =
    file.type === 'text/csv' || file.type === 'application/vnd.ms-excel' || file.type === ''

  if (!validExtension || !validMimeType) {
    messageStore.error('只能上傳 CSV 檔案')
    uploadedFile.value = null
    return
  }

  const maxSize = 1 * 1024 * 1024 // 1MB
  if (file.size > maxSize) {
    messageStore.error('檔案大小不能超過 1MB')
    uploadedFile.value = null
    return
  }

  const reader = new FileReader()
  reader.onload = async () => {
    try {
      const uint8Array = new Uint8Array(reader.result as ArrayBuffer)
      const decoder = new TextDecoder('big5')
      const text = decoder.decode(uint8Array)

      const parsed = parseCsvToParticipantList(text)
      await saveParticipants(parsed)
      participantStore.participantList = parsed
    } catch (err: unknown) {
      console.error('CSV 解析失敗', err)
      messageStore.error('CSV 解析失敗')
    }
  }

  reader.readAsArrayBuffer(file)
})
</script>

<style scoped></style>
