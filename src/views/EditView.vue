<template>
  <v-card>
    <v-card class="print-page">
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
  </v-card>
</template>

<script setup lang="ts">
import { useActivityStore } from '@/stores/activityStore'
import type { Header, Participant } from '@/type/type'
import { itemsPerPage } from '@/const/const'
import { ref, computed } from 'vue'
import { useParticipantStore } from '@/stores/participantStore'

const props = defineProps<{
  headers: Header[]
}>()

const page = ref(1)
const activityStore = useActivityStore()
const participantStore = useParticipantStore()

// Computed headers to add a delete column dynamically
const tableHeaders = computed(() => [
  ...props.headers,
  { title: '操作', key: 'actions', align: 'center' as const, width: '100px', sortable: false },
])

// Function to delete a participant

const deleteParticipant = (participant: Participant) => {
  const index = participantStore.combinedList.findIndex((p) => p === participant)
  if (index !== -1) {
    participantStore.deleteByCombinedIndex(index)
  }
}

const moveUp = (participant: Participant) => {
  const index = participantStore.combinedList.findIndex((p) => p === participant)
  const participantListIndex = index - participantStore.outsider.length
  if (participantListIndex >= 0) {
    participantStore.moveUpInParticipantList(participantListIndex)
  }
  console.log('participantStore.combinedList is', participantStore.combinedList)
}

const moveDown = (participant: Participant) => {
  const index = participantStore.combinedList.findIndex((p) => p === participant)
  const participantListIndex = index - participantStore.outsider.length
  if (participantListIndex >= 0) {
    participantStore.moveDownInParticipantList(participantListIndex)
  }
}
</script>

<style scoped>
/* Table font size */
.v-data-table,
.v-card-text {
  font-size: 12pt;
}

/* Row height adjustment */
::v-deep .v-data-table.row-height-26 tr,
::v-deep .v-data-table.row-height-26 td {
  height: 70px !important;
}

:deep() .v-table .v-table__wrapper > table {
  border: 2px solid #000 !important; /* Thicker outer border */
  border-collapse: collapse !important; /* Remove double borders */
}

:deep() .v-table .v-table__wrapper > table > thead > tr > th,
:deep() .v-table .v-table__wrapper > table > tbody > tr > td {
  color: #000 !important; /* Black text */
  border: 1px solid #000 !important; /* Black borders */
  padding: 4px; /* Consistent padding */
}

/* Separator lines between columns */
:deep() .v-table .v-table__wrapper > table > thead > tr > th:not(:last-child),
:deep() .v-table .v-table__wrapper > table > tbody > tr > td:not(:last-child) {
  border-right: 1px solid #000 !important;
}
</style>
