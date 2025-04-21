import type { Header } from '@/type/type'

export const itemsPerPage = 10
export const BASE_HEADERS: Header[] = [
  { title: '#', value: 'index', width: '5px', align: 'center' },
  { title: '學號', value: 'id', width: '100px', align: 'center' },
  { title: '單位', value: 'department', width: '100px', align: 'center' },
  { title: '姓名', value: 'name', width: '100px', align: 'center' },
  { title: '簽名', value: 'sign', width: '100px', align: 'center' },
  { title: '用餐', value: 'food', width: '100px', align: 'center' },
]

export const DEPARTMENT_ORDER = ['數學系', '數學延', '數學四', '數學三', '數學二', '數學一']
