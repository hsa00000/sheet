<template>
  <v-container class="print-only-pt-mt">
    <v-row class="d-flex justify-center print-only-pt-mt">
      <v-col cols="12" lg="6" class="print-full-width print-only-pt-mt">
        <v-card variant="text">
          <!-- 列印提示 -->
          <v-card-title class="no-print d-flex justify-center">
            直接使用 Chrome 列印即可
          </v-card-title>

          <!-- 每一頁 -->
          <v-card
            v-for="(pageItems, pageIndex) in paginatedItems"
            :key="pageIndex"
            class="print-page"
            variant="text"
          >
            <div class="page-body">
              <!-- 活動標題／基本資料 -->
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

              <!-- 自訂表格 -->
              <table class="custom-table">
                <thead>
                  <tr>
                    <th v-for="header in headers" :key="header.value">
                      {{ header.title }}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <template v-for="(row, idx) in pageItems" :key="idx">
                    <!-- 主資料列 -->
                    <tr v-if="!row._isCompanion">
                      <td :rowspan="row._rowspan">{{ row._displayIndex }}</td>
                      <td :rowspan="row._rowspan">{{ row.id }}</td>
                      <td :rowspan="row._rowspan">
                        {{
                          modeStore.displayExtendedAsRegular && row.department === '數學延'
                            ? '數學四'
                            : row.department
                        }}
                      </td>
                      <td :rowspan="row._rowspan">{{ row.name }}</td>

                      <!-- 本人簽名 ── 讓它跨列 -->
                      <td :rowspan="row._rowspan" style="height: 70px"></td>

                      <!-- 攜伴欄保持單列，不合併 -->
                      <td style="height: 70px"></td>
                    </tr>

                    <!-- 攜伴簽名列 -->
                    <tr v-else>
                      <!-- 只剩下攜伴欄 -->
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
import { headers } from '@/script/computeHeader'
import type { Participant } from '@/type/type'

const activityStore = useActivityStore()
const participantStore = useParticipantStore()
const emptyPageNumberStore = useEmptyPageNumberStore()
const modeStore = useModeStore()

/* ========= 型別 ========= */
type Row = Participant & {
  _isCompanion: boolean
  _rowspan?: number
  _displayIndex?: number
}

/* ========= 分頁邏輯 ========= */
const paginatedItems = computed(() => {
  const pages: Row[][] = []
  let currentPage: Row[] = []
  let remain = itemsPerPage
  let globalIndex = 1

  const pushPage = () => {
    while (currentPage.length < itemsPerPage) {
      currentPage.push({
        id: '',
        department: '',
        name: '',
        food: '',
        companion: 0,
        _isCompanion: false,
        _displayIndex: globalIndex++,
      })
    }
    pages.push(currentPage)
    currentPage = []
    remain = itemsPerPage
  }

  // 逐筆處理
  for (const p of participantStore.participantList) {
    let companionsLeft = p.companion //  ≥ 1 已保證
    let firstChunk = true

    while (companionsLeft > 0) {
      if (remain === 0) pushPage()

      /* ✅ 本頁可容納的「總列數」（本人 + 攜伴） */
      const capacity = Math.min(companionsLeft, remain)

      /* ✅ rowspan = capacity（不再 +1） */
      currentPage.push({
        ...p,
        _isCompanion: false,
        _rowspan: capacity,
        _displayIndex: firstChunk ? globalIndex : undefined,
      })
      remain-- // 已放本人

      /* ✅ 只插入 capacity-1 筆攜伴列 */
      for (let i = 0; i < capacity - 1; i++) {
        currentPage.push({
          id: '',
          department: '',
          name: '',
          food: '',
          companion: 0,
          _isCompanion: true,
        })
        remain--
      }

      companionsLeft -= capacity // 扣掉已處理列數
      firstChunk = false
    }
    globalIndex++
  }

  if (currentPage.length) pushPage()

  /* 其它：額外空白頁保持不變 */
  for (let i = 0; i < emptyPageNumberStore.emptyPageNumber; i++) {
    pages.push(
      Array.from({ length: itemsPerPage }, () => ({
        id: '',
        department: '',
        name: '',
        food: '',
        companion: 0,
        _isCompanion: false,
        _displayIndex: globalIndex++,
      })),
    )
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
