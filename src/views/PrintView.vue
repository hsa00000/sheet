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
          <v-card v-for="(page, pageIdx) in pages" :key="pageIdx" class="print-page" variant="text">
            <div class="page-body">
              <!-- ── 活動標題 / 基本資料 ─────────────────────────── -->
              <h1
                v-if="activityStore.showTitle"
                class="font-weight-bold text-center fixed-two-line-truncate"
              >
                {{ activityStore.title }}
              </h1>

              <v-card-text class="text-body-1">
                <p v-if="activityStore.showName" class="text-h5 fixed-two-line-truncate">
                  <span class="label-strong">活動名稱：</span>
                  {{ activityStore.name }}
                </p>
                <p v-if="activityStore.showPeriod" class="text-h5 fixed-two-line-truncate">
                  <span class="label-strong">活動期間：</span>
                  {{ activityStore.period }}
                </p>
                <p v-if="activityStore.showLocation" class="text-h5 fixed-two-line-truncate">
                  <span class="label-strong">活動地點：</span>
                  {{ activityStore.location }}
                </p>
              </v-card-text>

              <!-- ── 列印表格 ─────────────────────────────────────── -->
              <table class="custom-table">
                <colgroup>
                  <col style="width: 5%" />
                  <col style="width: 15%" />
                  <col style="width: 15%" />
                  <col style="width: 15%" />
                  <col style="width: 15%" />
                  <col v-if="showCompanion" style="width: 15%" />
                  <col v-if="showFood" style="width: 15%" />
                </colgroup>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>學號</th>
                    <th>單位</th>
                    <th>姓名</th>
                    <th>簽名</th>
                    <th v-if="showCompanion">攜伴</th>
                    <th v-if="showFood">用餐</th>
                  </tr>
                </thead>

                <tbody>
                  <template v-for="(row, rIdx) in page" :key="rIdx">
                    <tr v-if="!row._isCompanion">
                      <!-- 固定欄 -->
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
                      <td :rowspan="row._rowspan" style="height: 70px"></td>

                      <!-- 可選欄 -->
                      <td v-if="showCompanion" style="height: 70px"></td>
                      <td v-if="showFood" :rowspan="row._rowspan">{{ row.food }}</td>
                    </tr>

                    <!-- 攜伴列（只有攜伴欄） -->
                    <tr v-else-if="showCompanion">
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
// ── Imports ────────────────────────────────────────────────────────────────
import { computed } from 'vue'
import { useActivityStore } from '@/stores/activityStore'
import { useParticipantStore } from '@/stores/participantStore'
import { useEmptyPageNumberStore } from '@/stores/emptyPageNumberStore'
import { useModeStore } from '@/stores/modeStore'
import { itemsPerPage } from '@/const/const'
import type { Participant } from '@/type/type'

// ── Pinia Stores ───────────────────────────────────────────────────────────
const activityStore = useActivityStore()
const participantStore = useParticipantStore()
const emptyPageStore = useEmptyPageNumberStore()
const modeStore = useModeStore()

// ── Reactive Switches ──────────────────────────────────────────────────────
const showCompanion = computed(() => modeStore.displayCompanion)
const showFood = computed(() => modeStore.enableFood)

// ── Local Types / Helpers ──────────────────────────────────────────────────
type Row = Participant & {
  _isCompanion: boolean
  _rowspan?: number
  _displayIndex?: number
}

const createBlankRow = (index?: number): Row => ({
  id: '',
  department: '',
  name: '',
  food: '',
  companion: 0,
  _isCompanion: false,
  _displayIndex: index,
})

// ── Pagination Core ───────────────────────────────────────────────────────
function paginate(source: Participant[]): Row[][] {
  const pages: Row[][] = []
  let page: Row[] = []
  let remain = itemsPerPage
  let idx = 1

  const pushPage = () => {
    while (page.length < itemsPerPage) page.push(createBlankRow(idx++))
    pages.push(page)
    page = []
    remain = itemsPerPage
  }

  for (const p of source) {
    const companions = showCompanion.value ? p.companion : 0
    let left = companions
    let first = true

    // — 本人 & 可能的攜伴 —
    const addChunk = (span: number) => {
      page.push({
        ...p,
        _isCompanion: false,
        _rowspan: span,
        _displayIndex: first ? idx : undefined,
      })
      remain--
      for (let i = 0; i < span - 1; i++) {
        page.push({ ...createBlankRow(), _isCompanion: true })
        remain--
      }
      first = false
    }

    while (left > 0) {
      if (!remain) pushPage()
      const span = Math.min(left, remain)
      addChunk(span)
      left -= span
    }

    // 若不顯示攜伴，至少要放本人一列
    if (companions === 0) {
      if (!remain) pushPage()
      addChunk(1)
    }

    idx++
  }

  if (page.length) pushPage()

  // — 額外空白頁 —
  for (let i = 0; i < emptyPageStore.emptyPageNumber; i++) {
    pages.push(Array.from({ length: itemsPerPage }, () => createBlankRow(idx++)))
  }

  return pages
}

// ── Computed Pages (reacts to mode switches) ───────────────────────────────
const pages = computed(() => paginate(participantStore.participantList))
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

/* ── Print Layout ─────────────────────────────────────────────────────── */
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

/* ── Helpers ──────────────────────────────────────────────────────────── */
.fixed-two-line-truncate {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
</style>
