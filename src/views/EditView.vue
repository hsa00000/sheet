<template>
  <v-container class="fill-height d-flex align-center justify-center text-center">
    <v-row>
      <v-col cols="12" xl="3">
        <!-- 勾選 -->
        <v-list>
          <v-list-item>
            <v-list-item-action start>
              <v-checkbox-btn
                :model-value="modeStore.enableFood"
                @update:model-value="modeStore.setEnableFood"
                label="顯示用餐資訊"
              />
            </v-list-item-action>
          </v-list-item>

          <v-list-item>
            <v-list-item-action start>
              <v-checkbox-btn
                :model-value="modeStore.displayExtendedAsRegular"
                @update:model-value="modeStore.setDisplayExtendedAsRegular"
                label="顯示「數學延」為「數學四」"
              />
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="12" xl="6">
        <v-card>
          <v-list>
            <!-- 活動標題 -->
            <v-list-item>
              <template #prepend>
                <v-list-item-action start>
                  <v-checkbox-btn
                    :model-value="activityStore.showTitle"
                    @update:model-value="activityStore.setShowTitle"
                  />
                </v-list-item-action>
              </template>
              <v-text-field
                :model-value="activityStore.title"
                @update:model-value="activityStore.setTitle"
                :disabled="!activityStore.showTitle"
                label="標題"
                variant="underlined"
                dense
              ></v-text-field>
            </v-list-item>

            <!-- 活動名稱 -->
            <v-list-item>
              <template #prepend>
                <v-list-item-action start>
                  <v-checkbox-btn
                    :model-value="activityStore.showName"
                    @update:model-value="activityStore.setShowName"
                  />
                </v-list-item-action>
              </template>
              <v-text-field
                :model-value="activityStore.name"
                @update:model-value="activityStore.setName"
                :disabled="!activityStore.showName"
                label="活動名稱"
                variant="underlined"
                dense
              ></v-text-field>
            </v-list-item>

            <!-- 活動日期 -->
            <v-list-item>
              <template #prepend>
                <v-list-item-action start>
                  <v-checkbox-btn
                    :model-value="activityStore.showPeriod"
                    @update:model-value="activityStore.setShowPeriod"
                  />
                </v-list-item-action>
              </template>
              <v-text-field
                :model-value="activityStore.period"
                @update:model-value="activityStore.setPeriod"
                :disabled="!activityStore.showPeriod"
                label="活動日期"
                variant="underlined"
                dense
              ></v-text-field>
            </v-list-item>

            <!-- 活動地點 -->
            <v-list-item>
              <template #prepend>
                <v-list-item-action start>
                  <v-checkbox-btn
                    :model-value="activityStore.showLocation"
                    @update:model-value="activityStore.setShowLocation"
                  />
                </v-list-item-action>
              </template>
              <v-text-field
                :model-value="activityStore.location"
                @update:model-value="activityStore.setLocation"
                :disabled="!activityStore.showLocation"
                label="活動地點"
                variant="underlined"
                dense
              ></v-text-field>
            </v-list-item>
          </v-list>
          <v-data-table
            :headers="tableHeaders"
            :items="participantStore.participantList"
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
              <v-text-field
                v-model="item.id"
                hide-details
                @update:model-value="saveParticipants(participantStore.participantList)"
              ></v-text-field>
            </template>

            <!-- Editable department column -->
            <template #[`item.department`]="{ item }">
              <v-text-field
                v-model="item.department"
                hide-details
                @update:model-value="saveParticipants(participantStore.participantList)"
              ></v-text-field>
            </template>

            <!-- Editable name column -->
            <template #[`item.name`]="{ item }">
              <v-text-field
                v-model="item.name"
                hide-details
                @update:model-value="saveParticipants(participantStore.participantList)"
              ></v-text-field>
            </template>

            <!-- Editable food column -->
            <template #[`item.food`]="{ item }">
              <v-text-field
                v-model="item.food"
                hide-details
                @update:model-value="saveParticipants(participantStore.participantList)"
              ></v-text-field>
            </template>

            <!-- button column -->
            <template #[`item.actions`]="{ item }">
              <div class="d-flex flex-row justify-center ga-1">
                <v-btn variant="outlined" @click="deleteParticipant(item)">刪除</v-btn>
                <v-btn
                  variant="outlined"
                  @click="moveUp(item)"
                  :disabled="participantStore.participantList.findIndex((p) => p === item) === 0"
                >
                  上移
                </v-btn>
                <v-btn
                  variant="outlined"
                  @click="moveDown(item)"
                  :disabled="
                    participantStore.participantList.findIndex((p) => p === item) ===
                    participantStore.participantList.length - 1
                  "
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
          :model-value="emptyPageNumberStore.emptyPageNumber"
          @update:model-value="emptyPageNumberStore.setEmptyPageNumber"
          label="額外空白簽到頁數"
          :min="0"
          :step="1"
          control-variant="default"
          hide-details
          class="mb-5"
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
import { saveModeState, saveParticipants } from '@/db/db'
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
  const index = participantStore.participantList.findIndex((p) => p === participant)
  if (index !== -1) {
    participantStore.participantList.splice(index, 1)
    saveParticipants(participantStore.participantList)
  }
}

const moveUp = (participant: Participant) => {
  const index = participantStore.participantList.findIndex((p) => p === participant)
  if (index > 0) {
    participantStore.moveUpInParticipantList(index)
    saveParticipants(participantStore.participantList)
  }
}

const moveDown = (participant: Participant) => {
  const index = participantStore.participantList.findIndex((p) => p === participant)
  if (index >= 0 && index < participantStore.participantList.length - 1) {
    participantStore.moveDownInParticipantList(index)
    saveParticipants(participantStore.participantList)
  }
}

const addOutsider = () => {
  const name = newOutsider.value.trim()
  if (!name) return

  const exists = participantStore.participantList.some((p) => p.name === name)
  if (!exists) {
    participantStore.participantList.unshift({
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

      if (parsed.length === 0) {
        messageStore.error('CSV 檔案內容為空或格式錯誤')
        return
      }

      await saveParticipants(parsed)
      participantStore.participantList = parsed
      messageStore.success('匯入成功')
    } catch (err: unknown) {
      console.error('CSV 解析失敗', err)
      messageStore.error('CSV 解析失敗')
    }
  }

  reader.readAsArrayBuffer(file)
})

watch(
  () => ({
    enableFood: modeStore.enableFood,
    displayExtendedAsRegular: modeStore.displayExtendedAsRegular,
  }),
  (newVal) => {
    saveModeState(newVal)
  },
  { deep: true },
)
</script>

<style scoped></style>
