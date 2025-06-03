import { DEPARTMENT_ORDER } from '@/const/const'
import type { Participant } from '@/type/type'
import Papa from 'papaparse'

export function parseCsvToParticipantList(csvText: string): Participant[] {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  })

  const mappedList: Participant[] = (result.data as Record<string, unknown>[])
    .map((row) => {
      const cleanedRow = Object.fromEntries(
        Object.entries(row).map(([key, value]) => [key.trim(), value]),
      )
      return {
        identity: String(cleanedRow['職工/學號'] ?? ''),
        department: String(cleanedRow['單位'] ?? ''),
        name: String(cleanedRow['參加者'] ?? ''),
        food: String(cleanedRow['提供用餐'] ?? ''),
        companion: 1,
      }
    })
    .filter((item) => {
      return item.identity !== '' || item.department !== '' || item.name !== '' || item.food !== ''
    })

  mappedList.sort((a, b) => {
    const indexA = DEPARTMENT_ORDER.indexOf(a.department)
    const indexB = DEPARTMENT_ORDER.indexOf(b.department)
    return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB)
  })

  return mappedList
}
