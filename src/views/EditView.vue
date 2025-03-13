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
        :items="participantList"
        v-model:sort-by="sortBy"
        v-model:page="page"
        class="print-table row-height-26 text-center text-black"
        :items-per-page="itemsPerPage"
      >
        <!-- Index column -->
        <template #[`item.index`]="{ index }">
          {{ (page - 1) * itemsPerPage + index + 1 }}
        </template>

        <!-- Editable name column -->
        <template #[`item.name`]="{ item }">
          <v-text-field v-model="item.name" hide-details></v-text-field>
        </template>

        <!-- Delete button column -->
        <template #[`item.actions`]="{ item }">
          <v-btn icon color="red" @click="deleteParticipant(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-card>
</template>

<script setup lang="ts">
import { useActivityStore } from '@/stores/activityStore'
import type { Header, Participant } from '@/type/type'
import { sortBy, itemsPerPage } from '@/const/const'
import { ref, computed } from 'vue'

const props = defineProps<{
  participantList: Participant[]
  headers: Header[]
}>()

const page = ref(1)
const activityStore = useActivityStore()

// Computed headers to add a delete column dynamically
const tableHeaders = computed(() => [
  ...props.headers,
  { title: '操作', key: 'actions', align: 'center' as const, width: '5px', sortable: false },
])

// Function to delete a participant
const deleteParticipant = (participant: Participant) => {
  const index = props.participantList.findIndex((p) => p === participant)
  if (index !== -1) {
    props.participantList.splice(index, 1)
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
