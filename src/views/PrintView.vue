<template>
  <v-container class="print-only-pt-mt">
    <v-row class="d-flex justify-center print-only-pt-mt">
      <v-col cols="12" lg="6" class="print-full-width print-only-pt-mt">
        <v-card variant="text">
          <v-card-title class="no-print d-flex justify-center">
            直接使用 Chrome 列印即可
          </v-card-title>

          <v-card
            v-for="(pageItems, pageIndex) in paginatedItems"
            :key="pageIndex"
            class="print-page"
            variant="text"
          >
            <div class="page-body">
              <h1
                v-if="activityStore.showTitle"
                class="font-weight-bold text-center fixed-two-line-truncate"
              >
                {{ activityStore.title }}
              </h1>

              <v-card-text class="text-body-1">
                <p class="text-h5 fixed-two-line-truncate" v-if="activityStore.showName">
                  <span class="label-strong">活動名稱：</span>{{ activityStore.name }}
                </p>
                <p class="text-h5 fixed-two-line-truncate" v-if="activityStore.showPeriod">
                  <span class="label-strong">活動期間：</span>{{ activityStore.period }}
                </p>
                <p class="text-h5 fixed-two-line-truncate" v-if="activityStore.showLocation">
                  <span class="label-strong">活動地點：</span>{{ activityStore.location }}
                </p>
              </v-card-text>

              <table class="custom-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>學號</th>
                    <th>單位</th>
                    <th>姓名</th>
                    <th>簽名</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(entry, i) in pageItems" :key="i">
                    <tr v-if="!entry._isCompanion">
                      <td :rowspan="entry.companion + 1">{{ entry.displayIndex }}</td>
                      <td :rowspan="entry.companion + 1">{{ entry.id }}</td>
                      <td :rowspan="entry.companion + 1">
                        {{
                          modeStore.displayExtendedAsRegular && entry.department === '數學延'
                            ? '數學四'
                            : entry.department
                        }}
                      </td>
                      <td :rowspan="entry.companion + 1">{{ entry.name }}</td>
                      <td style="height: 70px"></td>
                    </tr>
                    <tr v-for="n in entry.companion" :key="`companion-${i}-${n}`">
                      <td style="height: 70px"></td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useActivityStore } from '@/stores/activityStore'
import { useParticipantStore } from '@/stores/participantStore'
import { useEmptyPageNumberStore } from '@/stores/emptyPageNumberStore'
import { useModeStore } from '@/stores/modeStore'
import { itemsPerPage } from '@/const/const'
import type { Participant } from '@/type/type'

const activityStore = useActivityStore()
const participantStore = useParticipantStore()
const emptyPageNumberStore = useEmptyPageNumberStore()
const modeStore = useModeStore()

type ExtendedParticipant = Participant & {
  _isCompanion?: boolean
  displayIndex?: number
}

const paginatedItems = computed(() => {
  const expanded: ExtendedParticipant[] = []
  let globalIndex = 1

  for (const p of participantStore.participantList) {
    expanded.push({
      ...p,
      _isCompanion: false,
      displayIndex: globalIndex++,
    })
    // 不加入 companion 資料，只生成簽名欄行數
    for (let i = 0; i < p.companion; i++) {
      expanded.push({
        id: '',
        department: '',
        name: '',
        food: '',
        companion: 0,
        _isCompanion: true,
      })
    }
  }

  const totalRows = Math.ceil(expanded.length / itemsPerPage) * itemsPerPage
  const blankRows = totalRows - expanded.length + emptyPageNumberStore.emptyPageNumber * 10

  for (let i = 0; i < blankRows; i++) {
    expanded.push({
      id: '',
      department: '',
      name: '',
      food: '',
      companion: 0,
      _isCompanion: false,
      displayIndex: globalIndex++,
    })
  }

  const pages: ExtendedParticipant[][] = []
  for (let i = 0; i < expanded.length; i += itemsPerPage) {
    pages.push(expanded.slice(i, i + itemsPerPage))
  }

  return pages
})
</script>

<style scoped>
.custom-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14pt;
  color: black;
}

.custom-table th,
.custom-table td {
  border: 1px solid black;
  text-align: center;
  padding: 6px;
}

.label-strong {
  font-weight: bold;
  color: #000;
}

@media print {
  .no-print {
    display: none !important;
  }

  .print-page {
    width: 210mm;
    min-height: 290mm;
    padding: 0 4mm;
    box-sizing: border-box;
    display: flex !important;
    page-break-after: always;
  }

  .page-body {
    margin: auto 0;
    width: 100%;
  }

  .print-only-pt-mt {
    padding-top: 0 !important;
    margin-top: 0 !important;
  }
}

.fixed-two-line-truncate {
  display: -webkit-box;
  display: box;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
</style>
